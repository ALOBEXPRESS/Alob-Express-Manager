"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const LastTransactionOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [showAll, setShowAll] = useState(false);

  const initialData = [];

  const displayData = showAll ? [...initialData, ...initialData] : initialData;

  const handleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-6'>
      <div className='card h-100'>
        <div className='card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between'>
          <h6 className='text-lg fw-semibold mb-0'>{t('last_transaction')}</h6>
          <button
            type='button'
            onClick={handleViewAll}
            className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
          >
            {showAll ? tCommon('show_less') : tCommon('view_all')}
            <Icon icon='solar:alt-arrow-right-linear' className='icon' />
          </button>
        </div>
        <div className='card-body p-24'>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0'>
              <thead>
                <tr>
                  <th scope='col'>{t('transaction_id')}</th>
                  <th scope='col'>{tCommon('date')}</th>
                  <th scope='col'>{tCommon('status')}</th>
                  <th scope='col'>{t('amount')}</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.date}</td>
                    <td>
                      <span className={`${item.statusClass} px-24 py-4 rounded-pill fw-medium text-sm`}>
                        {t(item.status)}
                      </span>
                    </td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastTransactionOne;
