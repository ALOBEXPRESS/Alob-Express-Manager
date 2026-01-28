import { supabase, getSafeUser } from "@/lib/supabase/client";

export const getActiveOrganizationId = async () => {
  const { user, error: userError } = await getSafeUser();
  const message = userError?.message || "";
  if (userError || !user) {
    if (
      userError &&
      !message.includes("Refresh Token Not Found") &&
      !message.includes("Invalid Refresh Token")
    ) {
      console.warn("getActiveOrganizationId: No user found", userError);
    }
    return null;
  }

  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getActiveOrganizationId: Error fetching membership", error);
    return null;
  }
  
  if (!data) {
    console.warn("getActiveOrganizationId: User has no organization membership", user.id);
  }

  return data?.organization_id ?? null;
};
