"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useTopCustomers } from "@/features/ecommerce/hooks/useTopCustomers";

const TopCustomersOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [showAll, setShowAll] = useState(false);
  const limit = showAll ? 12 : 6;
  const { customers } = useTopCustomers(limit);

  const displayData = customers.map((entry) => {
    const name = [entry.customer?.first_name, entry.customer?.last_name]
      .filter(Boolean)
      .join(" ");
    return {
      id: entry.id,
      name: name || tCommon("users"),
      phone: entry.customer?.phone || "",
      orders: entry.orders || 0,
      img: "/assets/images/avatar/avatar1.png",
    };
  });

  const handleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-4 col-lg-6'>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t('top_customers')}</h6>
            <button
              type='button'
              onClick={handleViewAll}
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {showAll ? tCommon('show_less') : tCommon('view_all')}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </button>
          </div>
          <div className='mt-32'>
            {displayData.map((user, index) => (
              <div key={user.id || index} className={`d-flex align-items-center justify-content-between gap-3 ${index !== displayData.length - 1 ? 'mb-32' : ''}`}>
                <div className='d-flex align-items-center gap-2'>
                  <img
                    src={user.img}
                    alt=''
                    className='w-40-px h-40-px radius-8 flex-shrink-0'
                  />
                  <div className='flex-grow-1'>
                    <h6 className='text-md mb-0 fw-normal'>{user.name}</h6>
                    <span className='text-sm text-secondary-light fw-normal'>
                      {user.phone}
                    </span>
                  </div>
                </div>
                <span className='text-primary-light text-md fw-medium'>
                  {t('orders')}: {user.orders}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCustomersOne;
