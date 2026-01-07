"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const TransactionsOne = () => {
  const t = useTranslations("dashboard");
  const [period, setPeriod] = useState('this_month');

  const transactions = {
    this_month: [
      { img: '/assets/images/payment/payment1.png', name: 'Paytm', desc: 'starbucks', amount: '-$20', amountClass: 'text-danger' },
      { img: '/assets/images/payment/payment2.png', name: 'PayPal', desc: 'client_payment', amount: '+$800', amountClass: 'text-success-main' },
      { img: '/assets/images/payment/payment3.png', name: 'Stripe', desc: 'ordered_iphone_14', amount: '-$300', amountClass: 'text-danger-main' },
      { img: '/assets/images/payment/payment4.png', name: 'Razorpay', desc: 'refund', amount: '+$500', amountClass: 'text-success-main' },
      { img: '/assets/images/payment/payment1.png', name: 'Paytm', desc: 'starbucks', amount: '-$1500', amountClass: 'text-danger-main' },
      { img: '/assets/images/payment/payment3.png', name: 'Stripe', desc: 'ordered_iphone_14', amount: '+$800', amountClass: 'text-success-main' },
    ],
    last_month: [
      { img: '/assets/images/payment/payment2.png', name: 'PayPal', desc: 'client_payment', amount: '+$1200', amountClass: 'text-success-main' },
      { img: '/assets/images/payment/payment1.png', name: 'Paytm', desc: 'starbucks', amount: '-$40', amountClass: 'text-danger' },
      { img: '/assets/images/payment/payment3.png', name: 'Stripe', desc: 'ordered_iphone_14', amount: '-$600', amountClass: 'text-danger-main' },
      { img: '/assets/images/payment/payment4.png', name: 'Razorpay', desc: 'refund', amount: '+$200', amountClass: 'text-success-main' },
    ]
  };

  const handleChange = (e) => {
    setPeriod(e.target.value);
  };

  const currentTransactions = transactions[period] || transactions.this_month;

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
              <div key={index} className={`d-flex align-items-center justify-content-between gap-3 ${index !== currentTransactions.length - 1 ? 'mb-32' : ''}`}>
                <div className='d-flex align-items-center gap-2'>
                  <img
                    src={tx.img}
                    alt=''
                    className='w-40-px h-40-px radius-8 flex-shrink-0'
                  />
                  <div className='flex-grow-1'>
                    <h6 className='text-md mb-0 fw-normal'>{tx.name}</h6>
                    <span className='text-sm text-secondary-light fw-normal'>
                      {t(tx.desc)}
                    </span>
                  </div>
                </div>
                <span className={`${tx.amountClass} text-md fw-medium`}>{tx.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsOne;
