"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

const TopCustomersOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [showAll, setShowAll] = useState(false);

  const initialData = [
    { img: '/assets/images/users/user6.png', name: 'Dianne Russell', phone: '017******58', orders: 30 },
    { img: '/assets/images/users/user1.png', name: 'Wade Warren', phone: '017******58', orders: 30 },
    { img: '/assets/images/users/user2.png', name: 'Albert Flores', phone: '017******58', orders: 35 },
    { img: '/assets/images/users/user3.png', name: 'Bessie Cooper', phone: '017******58', orders: 20 },
    { img: '/assets/images/users/user4.png', name: 'Arlene McCoy', phone: '017******58', orders: 25 },
    { img: '/assets/images/users/user6.png', name: 'John Doe', phone: '017******58', orders: 32 }
  ];

  const displayData = showAll 
    ? [...initialData, ...initialData] 
    : initialData;

  const handleViewAll = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-4 col-lg-6'>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t('top_customers')}</h6>
            <Link
              href='#'
              onClick={handleViewAll}
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {showAll ? tCommon('show_less') : tCommon('view_all')}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </Link>
          </div>
          <div className='mt-32'>
            {displayData.map((user, index) => (
              <div key={index} className={`d-flex align-items-center justify-content-between gap-3 ${index !== displayData.length - 1 ? 'mb-32' : ''}`}>
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
