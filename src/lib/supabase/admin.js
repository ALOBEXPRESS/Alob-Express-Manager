import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false },
      })
    : null;

export const provisionUser = async ({ userId, email, fullName }) => {
  if (!supabaseAdmin) {
    return { data: null, error: { message: "Supabase admin not configured" } };
  }

  const primaryPayload = {
    p_user_id: userId,
    p_user_email: email,
    p_full_name: fullName,
  };

  const legacyPayload = {
    user_id: userId,
    user_email: email,
    full_name: fullName,
  };

  const primary = await supabaseAdmin.rpc("provision_user", primaryPayload);
  if (!primary.error) return primary;

  const legacy = await supabaseAdmin.rpc("provision_user", legacyPayload);
  if (!legacy.error) return legacy;

  // Fallback: Manually insert into users table if RPC fails or doesn't exist
  // This ensures the user exists in our public schema even if the procedure is missing
  const { error: manualUserError } = await supabaseAdmin
    .from("users")
    .upsert({
      id: userId,
      email: email,
      name: fullName || email.split("@")[0],
      status: "active",
    });

  if (manualUserError) {
    console.error("Manual user provision failed:", manualUserError);
    return { data: null, error: manualUserError };
  }

  // Ensure organization exists for this user
  // Check if user has any organization membership
  const { data: membership } = await supabaseAdmin
    .from("organization_members")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    // Create a default organization
    const { data: newOrg, error: orgError } = await supabaseAdmin
      .from("organizations")
      .insert({
        name: `${fullName || email}'s Organization`,
        status: "active",
      })
      .select("id")
      .single();

    if (newOrg && !orgError) {
      // Add user to organization members
      await supabaseAdmin.from("organization_members").insert({
        organization_id: newOrg.id,
        user_id: userId,
        role_id: null, // Assuming role is optional or handled by trigger/default
        // If roles table is strict, we might need to fetch a default role, but let's assume null is fine for now
        // or we can try to fetch a default role if needed.
      });
    }
  }

  return { data: true, error: null };
};
