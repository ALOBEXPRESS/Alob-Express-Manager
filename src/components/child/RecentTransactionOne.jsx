import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

const RecentTransactionOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  
  return (
    <div className='col-xxl-12'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t('recent_transaction')}</h6>
            <Link
              href='#'
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {tCommon('view_all')}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </Link>
          </div>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0 xsm-table'>
              <thead>
                <tr>
                  <th scope='col'>{t('ast')}</th>
                  <th scope='col'>{t('date_time')}</th>
                  <th scope='col'>{tCommon('amount')}</th>
                  <th scope='col'>{t('address')}</th>
                  <th scope='col' className='text-center'>
                    {tCommon('status')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='text-success-main bg-success-focus w-32-px h-32-px d-flex align-items-center justify-content-center rounded-circle text-xl'>
                        <Icon icon='tabler:arrow-up-right' className='icon' />
                      </span>
                      <span className='fw-medium'>{t('bitcoin')}</span>
                    </div>
                  </td>
                  <td>
                    <span className='text-primary-light d-block fw-medium'>
                      10:34 AM
                    </span>
                    <span className='text-secondary-light text-sm'>
                      27 Mar 2024
                    </span>
                  </td>
                  <td>
                    <span className='text-primary-light d-block fw-medium'>
                      + 0.431 BTC
                    </span>
                    <span className='text-secondary-light text-sm'>
                      $3,480.90
                    </span>
                  </td>
                  <td>Abc.........np562</td>
                  <td className='text-center'>
                    <span className='bg-success-focus text-success-main px-16 py-4 radius-4 fw-medium text-sm'>
                      {t('completed')}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='text-danger-main bg-danger-focus w-32-px h-32-px d-flex align-items-center justify-content-center rounded-circle text-xl'>
                        <Icon icon='tabler:arrow-down-left' className='icon' />
                      </span>
                      <span className='fw-medium'>{t('bitcoin')}</span>
                    </div>
                  </td>
                  <td>
                    <span className='text-primary-light d-block fw-medium'>
                      10:34 AM
                    </span>
                    <span className='text-secondary-light text-sm'>
                      27 Mar 2024
                    </span>
                  </td>
                  <td>
                    <span className='text-primary-light d-block fw-medium'>
                      + 0.431 BTC
                    </span>
                    <span className='text-secondary-light text-sm'>
                      $3,480.90
                    </span>
                  </td>
                  <td>Abc.........np562</td>
                  <td className='text-center'>
                    <span className='bg-danger-focus text-danger-main px-16 py-4 radius-4 fw-medium text-sm'>
                      {t('terminated')}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='text-success-main bg-success-focus w-32-px h-32-px d-flex align-items-center justify-content-center rounded-circle text-xl'>
                        <Icon icon='tabler:arrow-up-right' className='icon' />
                      </span>
                      <span className='fw-medium'>{t('bitcoin')}</span>
                    </div>
                  </td>
                  <td>
                    <span className='text-primary-light d-block fw-medium'>
                      10:34 AM
                    </span>
                    <span className='text-secondary-light text-sm'>
                      27 Mar 2024
                    </span>
                  </td>
                  <td>
                    <span className='text-primary-light d-block fw-medium'>
                      + 0.431 BTC
                    </span>
                    <span className='text-secondary-light text-sm'>
                      $3,480.90
                    </span>
                  </td>
                  <td>Abc.........np562</td>
                  <td className='text-center'>
                    <span className='bg-success-focus text-success-main px-16 py-4 radius-4 fw-medium text-sm'>
                      {t('completed')}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='text-danger-main bg-danger-focus w-32-px h-32-px d-flex align-items-center justify-content-center rounded-circle text-xl'>
                        <Icon icon='tabler:arrow-down-left' className='icon' />
                      </span>
                      <span className='fw-medium'>{t('bitcoin')}</span>
                    </div>
                  </td>
                  <td>
                    <span className='text-primary-light d-block fw-medium'>
                      10:34 AM
                    </span>
                    <span className='text-secondary-light text-sm'>
                      27 Mar 2024
                    </span>
                  </td>
                  <td>
                    <span className='text-primary-light d-block fw-medium'>
                      + 0.431 BTC
                    </span>
                    <span className='text-secondary-light text-sm'>
                      $3,480.90
                    </span>
                  </td>
                  <td>Abc.........np562</td>
                  <td className='text-center'>
                    <span className='bg-danger-focus text-danger-main px-16 py-4 radius-4 fw-medium text-sm'>
                      {t('terminated')}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center gap-2'>
                      <span className='text-success-main bg-success-focus w-32-px h-32-px d-flex align-items-center justify-content-center rounded-circle text-xl'>
                        <Icon icon='tabler:arrow-up-right' className='icon' />
                      </span>
                      <span className='fw-medium'>{t('bitcoin')}</span>
                    </div>
                  </td>
                  <td>
                    <span className='text-primary-light d-block fw-medium'>
                      10:34 AM
                    </span>
                    <span className='text-secondary-light text-sm'>
                      27 Mar 2024
                    </span>
                  </td>
                  <td>
                    <span className='text-primary-light d-block fw-medium'>
                      + 0.431 BTC
                    </span>
                    <span className='text-secondary-light text-sm'>
                      $3,480.90
                    </span>
                  </td>
                  <td>Abc.........np562</td>
                  <td className='text-center'>
                    <span className='bg-success-focus text-success-main px-16 py-4 radius-4 fw-medium text-sm'>
                      {t('completed')}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactionOne;
