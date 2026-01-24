"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from 'next-intl';
import { useState } from "react";

const TopPerformanceOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [showAll, setShowAll] = useState(false);

  const initialData = [];

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
            {displayData.length === 0 ? (
                <div className='text-center p-3'>
                  <p className='text-secondary-light'>{tCommon('no_data_available') || 'No data available'}</p>
                </div>
              ) : (
            displayData.map((user, index) => (
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
            ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformanceOne;
