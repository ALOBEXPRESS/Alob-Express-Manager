"use client";
import useReactApexChart from "@/hook/useReactApexChart";
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const RevenueGrowthOne = () => {
  let { createChartTwoConfig } = useReactApexChart();
  const t = useTranslations('dashboard');
  const [chartConfig, setChartConfig] = useState(createChartTwoConfig("#487fff"));

  const renderChart = () => {
    const { options, series } = chartConfig;
    return (
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={162}
        width={"100%"}
      />
    );
  };

  const handleChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case 'Yearly':
        setChartConfig((prev) => ({
          ...prev,
          series: [{ name: "Data", data: [0, 0, 0, 0, 0, 0, 0, 0] }]
        }));
        break;
      case 'Monthly':
        setChartConfig((prev) => ({
          ...prev,
          series: [{ name: "Data", data: [0, 0, 0, 0, 0, 0, 0, 0] }]
        }));
        break;
      case 'Weekly':
        setChartConfig((prev) => ({
          ...prev,
          series: [{ name: "Data", data: [0, 0, 0, 0, 0, 0, 0, 0] }]
        }));
        break;
      case 'Today':
        setChartConfig((prev) => ({
          ...prev,
          series: [{ name: "Data", data: [0, 0, 0, 0, 0, 0, 0, 0] }]
        }));
        break;
      default:
        setChartConfig((prev) => ({
          ...prev,
          series: [{ name: "Data", data: [0, 0, 0, 0, 0, 0, 0, 0] }]
        }));
    }
  };

  return (
    <div className='col-xxl-4'>
      <div className='card h-100 radius-8 border'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <div>
              <h6 className='mb-2 fw-bold text-lg'>{t('revenue_growth')}</h6>
              <span className='text-sm fw-medium text-secondary-light'>
                {t('weekly_report')}
              </span>
            </div>
            <div className=''>
              <select
                className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                defaultValue='Monthly'
                onChange={handleChange}
              >
                <option value='Yearly'>{t('yearly')}</option>
                <option value='Monthly'>{t('monthly')}</option>
                <option value='Weekly'>{t('weekly')}</option>
                <option value='Today'>{t('today')}</option>
              </select>
            </div>
          </div>
          <div className='text-end mt-3'>
             <h6 className='mb-2 fw-bold text-lg'>$0.00</h6>
              <span className='bg-success-focus ps-12 pe-12 pt-2 pb-2 rounded-2 fw-medium text-success-main text-sm'>
                 $0k
              </span>
          </div>
          <div id='revenue-chart' className='mt-28'>
            {/* Pass the color value & height here */}
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueGrowthOne;
