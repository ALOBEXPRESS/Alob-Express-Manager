import { useEffect, useState } from "react";
import { getEcommerceSummary } from "@/features/ecommerce/services/summary";

export const useEcommerceSummary = () => {
  const [summary, setSummary] = useState({
    products: 0,
    customers: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getEcommerceSummary();
      if (active) {
        setSummary(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return { summary, loading };
};
