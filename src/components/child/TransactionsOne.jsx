"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useTransactions } from "@/features/finance/hooks/useTransactions";

const TransactionsOne = () => {
  const t = useTranslations("dashboard");
  const [period, setPeriod] = useState('this_month');
  const { transactions } = useTransactions(period === "this_month" ? 6 : 12);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);

  const handleChange = (e) => {
    setPeriod(e.target.value);
  };

  const currentTransactions = transactions;

  return (
    <div className='col-xxl-3'>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg'>{t("transactions")}</h6>
            <div className=''>
              <select
                className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                defaultValue='this_month'
                onChange={handleChange}
              >
                <option value='this_month'>{t("this_month")}</option>
                <option value='last_month'>{t("last_month")}</option>
              </select>
            </div>
          </div>
          <div className='mt-32'>
            {currentTransactions.map((tx, index) => (
              <div key={tx.id || index} className={`d-flex align-items-center justify-content-between gap-3 ${index !== currentTransactions.length - 1 ? 'mb-32' : ''}`}>
                <div className='d-flex align-items-center gap-2'>
                  <img
                    src='/assets/images/payment/payment1.png'
                    alt=''
                    className='w-40-px h-40-px radius-8 flex-shrink-0'
                  />
                  <div className='flex-grow-1'>
                    <h6 className='text-md mb-0 fw-normal'>{tx.type}</h6>
                    <span className='text-sm text-secondary-light fw-normal'>
                      {tx.reference || t("transactions")}
                    </span>
                  </div>
                </div>
                <span className='text-md fw-medium'>
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsOne;
