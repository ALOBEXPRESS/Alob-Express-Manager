import { supabase, getSafeUser } from "@/lib/supabase/client";

export const getActiveOrganizationId = async () => {
  if (typeof window === "undefined") return null;

  let resolvedUser = null;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    resolvedUser = sessionData?.session?.user ?? null;
  } catch {}

  if (!resolvedUser) {
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
    resolvedUser = user;
  }

  if (!resolvedUser?.id) {
    console.warn("getActiveOrganizationId: No user found");
    return null;
  }

  const fetchMembership = async (userId) => {
    try {
      return await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();
    } catch (thrown) {
      return { data: null, error: thrown };
    }
  };

  let { data, error } = await fetchMembership(resolvedUser.id);

  if (error) {
    const errorMessage = String(error?.message ?? "");
    const isNetworkError =
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("ERR_CONNECTION") ||
      errorMessage.includes("NetworkError");
    if (isNetworkError) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      ({ data, error } = await fetchMembership(resolvedUser.id));
    }
  }

  if (error && (error.status === 401 || error.code === "PGRST301")) {
    try {
      const { data: refreshed } = await supabase.auth.refreshSession();
      const refreshedUser = refreshed?.session?.user ?? null;
      if (refreshedUser?.id) {
        resolvedUser = refreshedUser;
      }
    } catch {}
    if (resolvedUser?.id) {
      const retry = await fetchMembership(resolvedUser.id);
      data = retry.data;
      error = retry.error;
    }
  }

  if (error) {
    console.error("getActiveOrganizationId: Error fetching membership", {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
      status: error?.status,
    });
    return null;
  }

  if (!data) {
    console.warn("getActiveOrganizationId: User has no organization membership", resolvedUser.id);
  }

  return data?.organization_id ?? null;
};
