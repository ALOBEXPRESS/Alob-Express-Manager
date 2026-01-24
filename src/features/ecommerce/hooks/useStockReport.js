import { useEffect, useState } from "react";
import { getStockReport } from "@/features/ecommerce/services/products";

export const useStockReport = (limit = 6) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getStockReport(limit);
      if (active) {
        setItems(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [limit]);

  return { items, loading };
};
