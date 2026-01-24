"use client";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react";
import useReactApexChart from "@/hook/useReactApexChart";
import { useTranslations } from 'next-intl';
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const EarningStaticOne = () => {
  let { barChartSeriesTwo, barChartOptionsTwo } = useReactApexChart();
  const t = useTranslations('dashboard');
  
  const [series, setSeries] = useState(barChartSeriesTwo);

  const handleChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case 'Yearly':
        setSeries([{ name: "Earnings", data: [30, 40, 45, 50, 49, 60, 70] }]);
        break;
      case 'Monthly':
        setSeries([{ name: "Earnings", data: [10, 20, 30, 40, 50, 60, 70] }]);
        break;
      case 'Weekly':
        setSeries([{ name: "Earnings", data: [5, 10, 15, 20, 25, 30, 35] }]);
        break;
      case 'Today':
        setSeries([{ name: "Earnings", data: [2, 4, 6, 8, 10, 12, 14] }]);
        break;
      default:
        setSeries(barChartSeriesTwo);
    }
  };

  return (
    <div className='col-xxl-8'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <div>
              <h6 className='mb-2 fw-bold text-lg'>{t('earning_statistic')}</h6>
              <span className='text-sm fw-medium text-secondary-light'>
                {t('yearly_earning_overview')}
              </span>
            </div>
            <div className=''>
              <select
                className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                defaultValue='Yearly'
                onChange={handleChange}
              >
                <option value='Yearly'>{t('yearly')}</option>
                <option value='Monthly'>{t('monthly')}</option>
                <option value='Weekly'>{t('weekly')}</option>
                <option value='Today'>{t('today')}</option>
              </select>
            </div>
          </div>
          <div className='mt-20 d-flex justify-content-center flex-wrap gap-3'>
            <div className='d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item'>
              <span className='bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white'>
                <Icon icon='fluent:cart-16-filled' className='icon' />
              </span>
              <div>
                <span className='text-secondary-light text-sm fw-medium'>
                  {t('sales')}
                </span>
                <h6 className='text-md fw-semibold mb-0'>$0k</h6>
              </div>
            </div>
            <div className='d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item'>
              <span className='bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white'>
                <Icon icon='uis:chart' className='icon' />
              </span>
              <div>
                <span className='text-secondary-light text-sm fw-medium'>
                  {t('income')}
                </span>
                <h6 className='text-md fw-semibold mb-0'>$0k</h6>
              </div>
            </div>
            <div className='d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item'>
              <span className='bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white'>
                <Icon icon='ph:arrow-fat-up-fill' className='icon' />
              </span>
              <div>
                <span className='text-secondary-light text-sm fw-medium'>
                  {t('profit')}
                </span>
                <h6 className='text-md fw-semibold mb-0'>$0k</h6>
              </div>
            </div>
          </div>
          <div id='barChart'>
            <ReactApexChart
              options={barChartOptionsTwo}
              series={series}
              type='bar'
              height={310}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningStaticOne;
