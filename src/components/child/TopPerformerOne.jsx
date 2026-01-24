"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from 'next-intl';

const TopPerformerOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');

  return (
    <div className='col-xxl-3 col-xl-12'>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t('top_performer')}</h6>
            <button
              type='button'
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {tCommon('view_all')}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </button>
          </div>
          <div className='mt-32'>
            <p className='text-center text-secondary-light'>No Data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformerOne;
