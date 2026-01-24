import { useEffect, useState } from "react";
import { getRecentOrders } from "@/features/ecommerce/services/orders";

export const useRecentOrders = (limit = 6) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getRecentOrders(limit);
      if (active) {
        setOrders(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [limit]);

  return { orders, loading };
};
