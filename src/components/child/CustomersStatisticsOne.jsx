"use client";
import { useState } from "react";
import useReactApexChart from "../../hook/useReactApexChart";
import dynamic from "next/dynamic";
import { useTranslations } from 'next-intl';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const CustomersStatisticsOne = () => {
  let { statisticsDonutChartSeries, statisticsDonutChartOptions } =
    useReactApexChart();
  const t = useTranslations('dashboard');
  
  const [series, setSeries] = useState(statisticsDonutChartSeries);
  const [stats, setStats] = useState({ male: '20,000', female: '25,000' });

  const handleChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case 'Yearly':
        setSeries([20000, 25000]);
        setStats({ male: '20,000', female: '25,000' });
        break;
      case 'Monthly':
        setSeries([1500, 2000]);
        setStats({ male: '1,500', female: '2,000' });
        break;
      case 'Weekly':
        setSeries([300, 400]);
        setStats({ male: '300', female: '400' });
        break;
      case 'Today':
        setSeries([50, 60]);
        setStats({ male: '50', female: '60' });
        break;
      default:
        setSeries(statisticsDonutChartSeries);
        setStats({ male: '20,000', female: '25,000' });
    }
  };

  return (
    <div className='col-xxl-3 col-lg-6'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg'>{t('customers_statistics')}</h6>
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
          <div className='position-relative'>
            <span className='w-80-px h-80-px bg-base shadow text-primary-light fw-semibold text-xl d-flex justify-content-center align-items-center rounded-circle position-absolute end-0 top-0 z-1'>
              +30%
            </span>

            <ReactApexChart
              options={statisticsDonutChartOptions}
              series={series}
              type='donut'
              height={230}
              id='statisticsDonutChart'
              className='mt-36 flex-grow-1 apexcharts-tooltip-z-none title-style circle-none'
            />
            <span className='w-80-px h-80-px bg-base shadow text-primary-light fw-semibold text-xl d-flex justify-content-center align-items-center rounded-circle position-absolute start-0 bottom-0 z-1'>
              +25%
            </span>
          </div>
          <ul className='d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3'>
            <li className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px radius-2 bg-primary-600' />
              <span className='text-secondary-light text-sm fw-normal'>
                {t('male')}:
                <span className='text-primary-light fw-bold'>{stats.male}</span>
              </span>
            </li>
            <li className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px radius-2 bg-yellow' />
              <span className='text-secondary-light text-sm fw-normal'>
                {t('female')}:
                <span className='text-primary-light fw-bold'>{stats.female}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomersStatisticsOne;
