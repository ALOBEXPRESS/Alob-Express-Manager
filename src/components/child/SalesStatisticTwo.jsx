"use client";
import { Icon } from "@iconify/react";
import useReactApexChart from "../../hook/useReactApexChart";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import { useTranslations } from 'next-intl';

const SalesStatisticTwo = () => {
  const t = useTranslations('dashboard');
  let {
    createChartFiveConfig,
    semiCircleGaugeSeriesOne,
    semiCircleGaugeOptionsOne,
    dailyIconBarChartSeriesOne,
    dailyIconBarChartOptionsOne,
  } = useReactApexChart();

  const renderChartFive = (color) => {
    const { options, series } = createChartFiveConfig(color);
    return <ReactApexChart options={options} series={series} type="area" height={60} width={100} />;
  };

  return (
    <div className='col-xxl-4'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24'>
          <h6 className='mb-2 fw-bold text-lg'>{t('statistic')}</h6>
          <div className='mt-24'>
            <div className='d-flex align-items-center gap-1 justify-content-between mb-44'>
              <div>
                <span className='text-secondary-light fw-normal mb-12 text-xl'>
                  {t('daily_conversions')}
                </span>
                <h5 className='fw-semibold mb-0'>0%</h5>
              </div>
              <div className='position-relative'>
                <ReactApexChart
                  id='semiCircleGauge'
                  options={semiCircleGaugeOptionsOne}
                  series={semiCircleGaugeSeriesOne}
                  type='radialBar'
                  width={200}
                />
                <span className='w-36-px h-36-px rounded-circle bg-neutral-100 d-flex justify-content-center align-items-center position-absolute start-50 translate-middle top-100'>
                  <Icon
                    icon='mdi:emoji'
                    className='text-primary-600 text-md mb-0'
                  />
                </span>
              </div>
            </div>
            <div className='d-flex align-items-center gap-1 justify-content-between mb-44'>
              <div>
                <span className='text-secondary-light fw-normal mb-12 text-xl'>
                  {t('visits_by_day')}
                </span>
                <h5 className='fw-semibold mb-0'>0</h5>
              </div>
              <div id='areaChart'>
                {/* Pass the color value */}
                {renderChartFive("#FF9F29")}
              </div>
            </div>
            <div className='d-flex align-items-center gap-1 justify-content-between'>
              <div>
                <span className='text-secondary-light fw-normal mb-12 text-xl'>
                  {t('today_income')}
                </span>
                <h5 className='fw-semibold mb-0'>$0.00</h5>
              </div>
              <ReactApexChart
                id='dailyIconBarChart'
                options={dailyIconBarChartOptionsOne}
                series={dailyIconBarChartSeriesOne}
                type='bar'
                width={164}
                height={80}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesStatisticTwo;
