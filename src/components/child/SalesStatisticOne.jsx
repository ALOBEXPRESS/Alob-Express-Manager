"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react";
import useReactApexChart from "@/hook/useReactApexChart";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import { useTranslations } from 'next-intl';

const SalesStatisticOne = () => {
  const t = useTranslations('dashboard');
  let { chartOptions, chartSeries } = useReactApexChart();
  
  const [series, setSeries] = useState(chartSeries);

  const handleChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case t('yearly'):
        setSeries([{ name: "This month", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }]);
        break;
      case t('monthly'):
        setSeries([{ name: "This month", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }]);
        break;
      case t('weekly'):
        setSeries([{ name: "This month", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }]);
        break;
      case t('today'):
        setSeries([{ name: "This month", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }]);
        break;
      default:
        setSeries(chartSeries);
    }
  };

  return (
    <div className='col-xxl-6 col-xl-12'>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='d-flex flex-wrap align-items-center justify-content-between'>
            <h6 className='text-lg mb-0'>{t('sales_statistic')}</h6>
            <select
              className='form-select bg-base form-select-sm w-auto'
              defaultValue={t('yearly')}
              onChange={handleChange}
            >
              <option value={t('yearly')}>{t('yearly')}</option>
              <option value={t('monthly')}>{t('monthly')}</option>
              <option value={t('weekly')}>{t('weekly')}</option>
              <option value={t('today')}>{t('today')}</option>
            </select>
          </div>
          <div className='d-flex flex-wrap align-items-center gap-2 mt-8'>
            <h6 className='mb-0'>$0.00</h6>
            <span className='text-sm fw-semibold rounded-pill bg-success-focus text-success-main border br-success px-8 py-4 line-height-1 d-flex align-items-center gap-1'>
              0% <Icon icon='bxs:up-arrow' className='text-xs' />
            </span>
            <span className='text-xs fw-medium'>+ $0.00 {t('per_day')}</span>
          </div>
          <ReactApexChart
            options={chartOptions}
            series={series}
            type='area'
            height={264}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesStatisticOne;
