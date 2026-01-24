import { useEffect, useState } from "react";
import { getTopCustomers } from "@/features/ecommerce/services/customers";

export const useTopCustomers = (limit = 6) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getTopCustomers(limit);
      if (active) {
        setCustomers(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [limit]);

  return { customers, loading };
};
