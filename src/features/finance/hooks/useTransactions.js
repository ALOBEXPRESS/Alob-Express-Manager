import { useEffect, useState } from "react";
import { getRecentTransactions } from "@/features/finance/services/transactions";

export const useTransactions = (limit = 6) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getRecentTransactions(limit);
      if (active) {
        setTransactions(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [limit]);

  return { transactions, loading };
};
