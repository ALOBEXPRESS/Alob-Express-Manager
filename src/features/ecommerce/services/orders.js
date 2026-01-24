import { supabase } from "@/lib/supabase/client";
import { getActiveOrganizationId } from "@/features/core/services/organization-membership";

export const getRecentOrders = async (limit = 6) => {
  const organizationId = await getActiveOrganizationId();
  if (!organizationId) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, total_amount, status, created_at, customers(first_name,last_name), order_items(quantity)"
    )
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
};
