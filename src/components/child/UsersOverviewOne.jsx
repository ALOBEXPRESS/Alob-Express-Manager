"use client";
import useReactApexChart from "@/hook/useReactApexChart";
import { useState } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import { useTranslations } from 'next-intl';

const UsersOverviewOne = () => {
  const t = useTranslations('dashboard');
  let { donutChartSeries, donutChartOptions } = useReactApexChart();
  
  const [series, setSeries] = useState(donutChartSeries);

  const handleChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case t('yearly'):
        setSeries([44, 55, 41, 17]);
        break;
      case t('monthly'):
        setSeries([30, 40, 20, 10]);
        break;
      case t('weekly'):
        setSeries([10, 20, 10, 60]);
        break;
      case t('today'):
        setSeries([5, 10, 5, 80]);
        break;
      default:
        setSeries(donutChartSeries);
    }
  };

  return (
    <div className='col-xxl-3 col-xl-6'>
      <div className='card h-100 radius-8 border-0 overflow-hidden'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg'>{t('users_overview')}</h6>
            <div className=''>
              <select
                className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                defaultValue={t('today')}
                onChange={handleChange}
              >
                <option value={t('today')}>{t('today')}</option>
                <option value={t('weekly')}>{t('weekly')}</option>
                <option value={t('monthly')}>{t('monthly')}</option>
                <option value={t('yearly')}>{t('yearly')}</option>
              </select>
            </div>
          </div>
          <ReactApexChart
            options={donutChartOptions}
            series={series}
            type='donut'
            height={264}
          />
          <ul className='d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3'>
            <li className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px radius-2 bg-primary-600' />
              <span className='text-secondary-light text-sm fw-normal'>
                {t('new')}:
                <span className='text-primary-light fw-semibold'>500</span>
              </span>
            </li>
            <li className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px radius-2 bg-yellow' />
              <span className='text-secondary-light text-sm fw-normal'>
                {t('subscribed')}:
                <span className='text-primary-light fw-semibold'>300</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UsersOverviewOne;
