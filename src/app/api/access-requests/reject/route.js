import { supabaseAdmin } from "@/lib/supabase/admin";

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
    .select("id,status")
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
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUser.id,
    })
    .eq("id", requestId);

  return Response.json({ ok: true });
}
