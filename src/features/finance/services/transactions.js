import { supabase } from "@/lib/supabase/client";
import { getActiveOrganizationId } from "@/features/core/services/organization-membership";

export const getRecentTransactions = async (limit = 6) => {
  const organizationId = await getActiveOrganizationId();
  if (!organizationId) return [];

  const { data: wallets, error: walletError } = await supabase
    .from("wallets")
    .select("id")
    .eq("organization_id", organizationId)
    .limit(1)
    .maybeSingle();

  if (walletError || !wallets?.id) return [];

  const { data, error } = await supabase
    .from("transactions")
    .select("id,type,amount,status,created_at,reference")
    .eq("wallet_id", wallets.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
};
