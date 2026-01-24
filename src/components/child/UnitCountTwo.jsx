"use client";
import useReactApexChart from "@/hook/useReactApexChart";
import { Icon } from "@iconify/react";
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const UnitCountTwo = () => {
  let { createChartConfig } = useReactApexChart();
  const t = useTranslations('dashboard');

  const renderChart = (color) => {
    const { options, series } = createChartConfig(color);
    return (
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={50}
        width={100}
      />
    );
  };

  return (
    <div className='col-xxl-8'>
      <div className='row gy-4'>
        <div className='col-xxl-4 col-sm-6'>
          <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-1'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-primary-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0'>
                    <Icon icon='mingcute:user-follow-fill' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      {t('new_users')}
                    </span>
                    <h6 className='fw-semibold'>0</h6>
                  </div>
                </div>
                <div
                  id='new-user-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                  {renderChart("#487fff")}
                </div>
              </div>
              <p className='text-sm mb-0'>
                {t('increase_by')}{" "}
                <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                  +0
                </span>{" "}
                {t('this_week')}
              </p>
            </div>
          </div>
        </div>
        <div className='col-xxl-4 col-sm-6'>
          <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-2'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-success-main flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6'>
                    <Icon icon='mingcute:user-follow-fill' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      {t('active_users')}
                    </span>
                    <h6 className='fw-semibold'>0</h6>
                  </div>
                </div>
                <div
                  id='active-user-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                  {renderChart("#45b369")}
                </div>
              </div>
              <p className='text-sm mb-0'>
                {t('increase_by')}{" "}
                <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                  +0
                </span>{" "}
                {t('this_week')}
              </p>
            </div>
          </div>
        </div>
        <div className='col-xxl-4 col-sm-6'>
          <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-3'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-yellow text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6'>
                    <Icon icon='iconamoon:discount-fill' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      {t('total_sales')}
                    </span>
                    <h6 className='fw-semibold'>$0</h6>
                  </div>
                </div>
                <div
                  id='total-sales-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                  {renderChart("#f4941e")}
                </div>
              </div>
              <p className='text-sm mb-0'>
                {t('increase_by')}{" "}
                <span className='bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm'>
                  -$0k
                </span>{" "}
                {t('this_week')}
              </p>
            </div>
          </div>
        </div>
        <div className='col-xxl-4 col-sm-6'>
          <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-4'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-purple text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6'>
                    <Icon icon='mdi:message-text' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      {t('conversion')}
                    </span>
                    <h6 className='fw-semibold'>0%</h6>
                  </div>
                </div>
                <div
                  id='conversion-user-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                  {renderChart("#8252e9")}
                </div>
              </div>
              <p className='text-sm mb-0'>
                {t('increase_by')}{" "}
                <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                  +0%
                </span>{" "}
                {t('this_week')}
              </p>
            </div>
          </div>
        </div>
        <div className='col-xxl-4 col-sm-6'>
          <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-5'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-pink text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6'>
                    <Icon icon='mdi:leads' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      {t('leads')}
                    </span>
                    <h6 className='fw-semibold'>0</h6>
                  </div>
                </div>
                <div
                  id='leads-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                  {renderChart("#de3ace")}
                </div>
              </div>
              <p className='text-sm mb-0'>
                {t('increase_by')}{" "}
                <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                  +0
                </span>{" "}
                {t('this_week')}
              </p>
            </div>
          </div>
        </div>
        <div className='col-xxl-4 col-sm-6'>
          <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-6'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-cyan text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6'>
                    <Icon icon='streamline:bag-dollar-solid' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      {t('total_profit')}
                    </span>
                    <h6 className='fw-semibold'>$0</h6>
                  </div>
                </div>
                <div
                  id='total-profit-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                  {renderChart("#00b8f2")}
                </div>
              </div>
              <p className='text-sm mb-0'>
                {t('increase_by')}{" "}
                <span className='bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm'>
                  -$0k
                </span>{" "}
                {t('this_week')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCountTwo;
