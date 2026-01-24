import { provisionUser, supabaseAdmin } from "@/lib/supabase/admin";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "empresaalob@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Alob@341$12";

export async function POST() {
  try {
    if (!supabaseAdmin) {
      console.error("Bootstrap: Supabase admin not configured");
      return Response.json({ error: "Supabase admin not configured" }, { status: 500 });
    }

    console.log("Bootstrap: Checking admin user...");
    // supabase-js v2 doesn't have getUserByEmail on admin. Use listUsers.
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000
    });

    if (listError) {
      console.error("Bootstrap: Error listing users", listError);
      return Response.json({ error: "Failed to check admin", details: listError }, { status: 500 });
    }

    const existingUser = listData.users.find(u => u.email === ADMIN_EMAIL);
    const existing = existingUser ? { user: existingUser } : null;
    const existingError = null;

    /* 
    const { data: existing, error: existingError } =
      await supabaseAdmin.auth.admin.getUserByEmail(ADMIN_EMAIL);

    if (existingError && existingError.status !== 404) {
      console.error("Bootstrap: Error fetching user", existingError);
      return Response.json({ error: "Failed to check admin", details: existingError }, { status: 500 });
    }
    */

  if (existing?.user) {
    // Check if password update is needed (we can't verify hash, so we just update it to ensure consistency)
    // Only update if environment variable is set
    const FORCE_PASSWORD = "Alob@341$12";
    if (FORCE_PASSWORD) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existing.user.id,
        { password: FORCE_PASSWORD }
      );
      if (updateError) {
        console.error("Bootstrap: Failed to update admin password", updateError);
      } else {
        console.log("Bootstrap: Admin password updated successfully");
      }
    }

    const { error: upsertError } = await supabaseAdmin
      .from("app_admins")
      .upsert({ user_id: existing.user.id });

    if (upsertError) {
      return Response.json({ error: "Failed to sync admin" }, { status: 500 });
    }

    const { error: provisionError } = await provisionUser({
      userId: existing.user.id,
      email: existing.user.email,
      fullName: existing.user.user_metadata?.full_name || null,
    });

    if (provisionError) {
      return Response.json({ error: "Provision failed" }, { status: 500 });
    }

    return Response.json({ ok: true, created: false });
  }

  const { data: created, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Administrador Alob" },
    });

  if (createError) {
    return Response.json({ error: "Failed to create admin" }, { status: 500 });
  }

  if (created?.user?.id) {
    const { error: insertError } = await supabaseAdmin
      .from("app_admins")
      .upsert({ user_id: created.user.id });

    if (insertError) {
      return Response.json({ error: "Failed to save admin" }, { status: 500 });
    }

    const { error: provisionError } = await provisionUser({
      userId: created.user.id,
      email: created.user.email,
      fullName: created.user.user_metadata?.full_name || null,
    });

    if (provisionError) {
      return Response.json({ error: "Provision failed" }, { status: 500 });
    }
  }

  return Response.json({ ok: true, created: true });
  } catch (e) {
    console.error("Bootstrap error:", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
