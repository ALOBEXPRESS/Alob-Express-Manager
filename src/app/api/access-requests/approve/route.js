import { isLeakedPassword, provisionUser, supabaseAdmin } from "@/lib/supabase/admin";

const getAdminUser = async (request) => {
  if (!supabaseAdmin) return null;
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  const { data: adminRow } = await supabaseAdmin
    .from("app_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  return adminRow ? data.user : null;
};

export async function POST(request) {
  if (!supabaseAdmin) {
    return Response.json({ error: "Supabase admin not configured" }, { status: 500 });
  }
  const adminUser = await getAdminUser(request);
  if (!adminUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const requestId = body?.requestId;
  if (!requestId) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { data: accessRequest, error: fetchError } = await supabaseAdmin
    .from("access_requests")
    .select("id,email,status")
    .eq("id", requestId)
    .maybeSingle();

  if (fetchError || !accessRequest) {
    return Response.json({ error: "Request not found" }, { status: 404 });
  }

  if (accessRequest.status !== "pending") {
    return Response.json({ ok: true, status: accessRequest.status });
  }

  await supabaseAdmin
    .from("access_requests")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUser.id,
    })
    .eq("id", requestId);

  const { data: existingUser } =
    await supabaseAdmin.auth.admin.getUserByEmail(accessRequest.email);

  if (existingUser?.user) {
    const { error: provisionError } = await provisionUser({
      userId: existingUser.user.id,
      email: accessRequest.email,
      fullName: existingUser.user.user_metadata?.full_name || null,
    });
    if (provisionError) {
      return Response.json({ error: "Provision failed" }, { status: 500 });
    }
    return Response.json({ ok: true, invited: false });
  }

  let tempPassword = "";
  for (let i = 0; i < 5; i += 1) {
    const candidate = `Alob@${Math.random().toString(36).slice(-8)}1`;
    const leaked = await isLeakedPassword(candidate);
    if (!leaked) {
      tempPassword = candidate;
      break;
    }
  }
  if (!tempPassword) {
    return Response.json({ error: "Failed to generate safe password" }, { status: 500 });
  }
  const { data: createdUser, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email: accessRequest.email,
      password: tempPassword,
      email_confirm: true,
    });

  if (createError || !createdUser?.user) {
    return Response.json({ error: "Invite failed" }, { status: 500 });
  }

  const { error: provisionError } = await provisionUser({
    userId: createdUser.user.id,
    email: accessRequest.email,
    fullName: createdUser.user.user_metadata?.full_name || null,
  });

  if (provisionError) {
    return Response.json({ error: "Provision failed" }, { status: 500 });
  }

  return Response.json({ ok: true, invited: true, tempPassword });
}
