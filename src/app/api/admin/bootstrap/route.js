import { provisionUser, supabaseAdmin } from "@/lib/supabase/admin";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST() {
  try {
    console.log("Bootstrap: Starting...");
    
    if (!supabaseAdmin) {
      console.error("Bootstrap: Supabase admin not configured");
      return Response.json({ error: "Supabase admin not configured" }, { status: 500 });
    }
    
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("Bootstrap: Admin credentials missing");
      return Response.json({ error: "Admin env vars are missing" }, { status: 500 });
    }

    console.log("Bootstrap: Checking admin user...");
    
    // Use listUsers to find admin (more reliable than getUserByEmail)
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000
    });

    if (listError) {
      console.error("Bootstrap: Error listing users", listError);
      // Don't fail completely - return success to not block login
      return Response.json({ ok: true, warning: "Could not verify admin" }, { status: 200 });
    }

    const existingUser = listData.users.find(u => u.email === ADMIN_EMAIL);

    if (existingUser) {
      console.log("Bootstrap: Admin user exists, syncing...");
      
      // Sync admin status (non-blocking)
      try {
        await supabaseAdmin
          .from("app_admins")
          .upsert({ user_id: existingUser.id }, { onConflict: 'user_id' });
        console.log("Bootstrap: Admin status synced");
      } catch (syncError) {
        console.warn("Bootstrap: Failed to sync admin status", syncError);
        // Don't fail - admin might already be synced
      }

      // Provision user (non-blocking)
      try {
        await provisionUser({
          userId: existingUser.id,
          email: existingUser.email,
          fullName: existingUser.user_metadata?.full_name || "Administrador Alob",
        });
        console.log("Bootstrap: User provisioned");
      } catch (provisionError) {
        console.warn("Bootstrap: Provision failed (non-critical)", provisionError);
        // Don't fail - user might already be provisioned
      }

      return Response.json({ ok: true, created: false });
    }

    // Create admin user if doesn't exist
    console.log("Bootstrap: Creating admin user...");
    
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Administrador Alob" },
    });

    if (createError) {
      console.error("Bootstrap: Failed to create admin", createError);
      // Don't fail completely if user might already exist
      return Response.json({ ok: true, warning: "Could not create admin" }, { status: 200 });
    }

    if (created?.user?.id) {
      console.log("Bootstrap: Admin created, setting up...");
      
      // Add to app_admins
      try {
        await supabaseAdmin
          .from("app_admins")
          .insert({ user_id: created.user.id });
        console.log("Bootstrap: Admin role assigned");
      } catch (insertError) {
        console.warn("Bootstrap: Failed to assign admin role", insertError);
      }

      // Provision user
      try {
        await provisionUser({
          userId: created.user.id,
          email: created.user.email,
          fullName: created.user.user_metadata?.full_name || "Administrador Alob",
        });
        console.log("Bootstrap: User provisioned");
      } catch (provisionError) {
        console.warn("Bootstrap: Provision failed", provisionError);
      }
    }

    return Response.json({ ok: true, created: true });
  } catch (e) {
    console.error("Bootstrap error:", e);
    // Return success to not block login - bootstrap is not critical
    return Response.json({ ok: true, warning: e.message }, { status: 200 });
  }
}
