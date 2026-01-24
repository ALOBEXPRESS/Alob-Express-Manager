import { supabase } from "@/lib/supabase/client";

export const getActiveOrganizationId = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.warn("getActiveOrganizationId: No user found", userError);
    return null;
  }

  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userData.user.id)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getActiveOrganizationId: Error fetching membership", error);
    return null;
  }
  
  if (!data) {
    console.warn("getActiveOrganizationId: User has no organization membership", userData.user.id);
  }

  return data?.organization_id ?? null;
};
