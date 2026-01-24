import { Icon } from "@iconify/react";
import { useTranslations } from 'next-intl';

const MyOrdersOne = () => {
  const t = useTranslations('dashboard');
  return (
    <div className='col-xxl-6'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg'>{t('my_orders')}</h6>
            <div className=''>
              <select
                className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                defaultValue='Today'
              >
                <option value='Today'>{t('today')}</option>
                <option value='Monthly'>{t('monthly')}</option>
                <option value='Weekly'>{t('weekly')}</option>
                <option value='Today'>{t('today')}</option>
              </select>
            </div>
          </div>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0'>
              <thead>
                <tr>
                  <th scope='col'>{t('rate')}</th>
                  <th scope='col'>{t('amount_eth')} </th>
                  <th scope='col'>{t('price_pln')}</th>
                  <th scope='col' className='text-center'>
                    {t('action')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className='text-success-main'>0</span>
                  </td>
                  <td>0</td>
                  <td>0</td>
                  <td className='text-center line-height-1'>
                    <button
                      type='button'
                      className='text-lg text-danger-main remove-btn'
                    >
                      <Icon icon='radix-icons:cross-2' className='icon' />{" "}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-success-main'>0</span>
                  </td>
                  <td>0</td>
                  <td>0</td>
                  <td className='text-center line-height-1'>
                    <button
                      type='button'
                      className='text-lg text-danger-main remove-btn'
                    >
                      <Icon icon='radix-icons:cross-2' className='icon' />{" "}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-danger-main'>0</span>
                  </td>
                  <td>0</td>
                  <td>0</td>
                  <td className='text-center line-height-1'>
                    <button
                      type='button'
                      className='text-lg text-danger-main remove-btn'
                    >
                      <Icon icon='radix-icons:cross-2' className='icon' />{" "}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-success-main'>0</span>
                  </td>
                  <td>0</td>
                  <td>0</td>
                  <td className='text-center line-height-1'>
                    <button
                      type='button'
                      className='text-lg text-danger-main remove-btn'
                    >
                      <Icon icon='radix-icons:cross-2' className='icon' />{" "}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-danger-main'>0</span>
                  </td>
                  <td>0</td>
                  <td>0</td>
                  <td className='text-center line-height-1'>
                    <button
                      type='button'
                      className='text-lg text-danger-main remove-btn'
                    >
                      <Icon icon='radix-icons:cross-2' className='icon' />{" "}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-danger-main'>0</span>
                  </td>
                  <td>0</td>
                  <td>0</td>
                  <td className='text-center line-height-1'>
                    <button
                      type='button'
                      className='text-lg text-danger-main remove-btn'
                    >
                      <Icon icon='radix-icons:cross-2' className='icon' />{" "}
                    </button>
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

export default MyOrdersOne;
