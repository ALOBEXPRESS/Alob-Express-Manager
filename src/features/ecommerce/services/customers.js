import { supabase } from "@/lib/supabase/client";
import { getActiveOrganizationId } from "@/features/core/services/organization-membership";

export const getTopCustomers = async (limit = 6) => {
  const organizationId = await getActiveOrganizationId();
  if (!organizationId) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("customer_id, customers(first_name,last_name,phone)")
    .eq("organization_id", organizationId);

  if (error || !data) return [];

  const counts = data.reduce((acc, order) => {
    if (!order.customer_id) return acc;
    if (!acc[order.customer_id]) {
      acc[order.customer_id] = {
        id: order.customer_id,
        orders: 0,
        customer: order.customers,
      };
    }
    acc[order.customer_id].orders += 1;
    return acc;
  }, {});

  return Object.values(counts)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, limit);
};
