import { useEffect, useState } from "react";
import { getTopSellingProducts } from "@/features/ecommerce/services/products";

export const useTopProducts = (limit = 6) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getTopSellingProducts(limit);
      if (active) {
        setProducts(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [limit]);

  return { products, loading };
};
