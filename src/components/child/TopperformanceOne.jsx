"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useState } from "react";

const TopPerformanceOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [showAll, setShowAll] = useState(false);

  const initialData = [
    { name: 'Dianne Russell', id: '36254', score: '60/80', img: '/assets/images/users/user1.png' },
    { name: 'Wade Warren', id: '36254', score: '50/70', img: '/assets/images/users/user2.png' },
    { name: 'Albert Flores', id: '36254', score: '55/75', img: '/assets/images/users/user3.png' },
    { name: 'Bessie Cooper', id: '36254', score: '60/80', img: '/assets/images/users/user4.png' },
    { name: 'Arlene McCoy', id: '36254', score: '55/75', img: '/assets/images/users/user5.png' },
    { name: 'Arlene McCoy', id: '36254', score: '50/70', img: '/assets/images/users/user1.png' }
  ];

  const displayData = showAll 
    ? [...initialData, ...initialData] 
    : initialData;

  const handleViewAll = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-4'>
      <div className='card'>
        <div className='card-body'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t('top_performer')}</h6>
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
                <div className='d-flex align-items-center'>
                  <img
                    src={user.img}
                    alt=''
                    className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                  />
                  <div className='flex-grow-1'>
                    <h6 className='text-md mb-0'>{user.name}</h6>
                    <span className='text-sm text-secondary-light fw-medium'>
                      {t('agent_id')}: {user.id}
                    </span>
                  </div>
                </div>
                <span className='text-primary-light text-md fw-medium'>
                  {user.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformanceOne;
