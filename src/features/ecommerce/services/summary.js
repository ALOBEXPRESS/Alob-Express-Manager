import { supabase } from "@/lib/supabase/client";
import { getActiveOrganizationId } from "@/features/core/services/organization-membership";

export const getEcommerceSummary = async () => {
  const organizationId = await getActiveOrganizationId();
  if (!organizationId) {
    return { products: 0, customers: 0, orders: 0 };
  }

  const [{ count: products }, { count: customers }, { count: orders }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", organizationId),
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", organizationId),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", organizationId),
    ]);

  return {
    products: products ?? 0,
    customers: customers ?? 0,
    orders: orders ?? 0,
  };
};
