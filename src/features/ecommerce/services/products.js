import { supabase } from "@/lib/supabase/client";
import { getActiveOrganizationId } from "@/features/core/services/organization-membership";

export const getTopSellingProducts = async (limit = 6) => {
  const organizationId = await getActiveOrganizationId();
  if (!organizationId) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("order_items(quantity, product_id, products(id,name,price,stock_quantity))")
    .eq("organization_id", organizationId);

  if (error || !data) return [];

  const totals = data.reduce((acc, order) => {
    const items = order.order_items || [];
    items.forEach((item) => {
      if (!item?.product_id) return;
      if (!acc[item.product_id]) {
        acc[item.product_id] = {
          product: item.products,
          sold: 0,
          totalOrders: 0,
        };
      }
      acc[item.product_id].sold += item.quantity || 0;
      acc[item.product_id].totalOrders += 1;
    });
    return acc;
  }, {});

  return Object.values(totals)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit);
};

export const getStockReport = async (limit = 6) => {
  const organizationId = await getActiveOrganizationId();
  if (!organizationId) return [];

  const { data, error } = await supabase
    .from("products")
    .select("id,name,price,stock_quantity")
    .eq("organization_id", organizationId)
    .order("stock_quantity", { ascending: true })
    .limit(limit);

  if (error) return [];
  return data ?? [];
};
