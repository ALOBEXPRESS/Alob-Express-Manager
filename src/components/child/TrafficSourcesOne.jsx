"use client";
import useReactApexChart from "../../hook/useReactApexChart";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const TrafficSourcesOne = () => {
  let { userOverviewDonutChartSeries, userOverviewDonutChartOptions } =
    useReactApexChart();
  const t = useTranslations("dashboard");
  
  const [series, setSeries] = useState(userOverviewDonutChartSeries);

  const handleChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case 'Yearly':
        setSeries([44, 55, 41, 17]);
        break;
      case 'Monthly':
        setSeries([30, 40, 30, 20]);
        break;
      case 'Weekly':
        setSeries([10, 20, 15, 10]);
        break;
      case 'Today':
        setSeries([5, 8, 6, 4]);
        break;
      default:
        setSeries(userOverviewDonutChartSeries);
    }
  };

  return (
    <div className='col-xxl-4 col-md-6'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24 d-flex flex-column justify-content-between gap-8'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("traffic_sources")}</h6>
            <select
              className='form-select form-select-sm w-auto bg-base border text-secondary-light'
              defaultValue='Yearly'
              onChange={handleChange}
            >
              <option value='Yearly'>{t("yearly")}</option>
              <option value='Monthly'>{t("monthly")}</option>
              <option value='Weekly'>{t("weekly")}</option>
              <option value='Today'>{t("today")}</option>
            </select>
          </div>
          <div
            id='userOverviewDonutChart'
            className='margin-16-minus y-value-left'
          />
          <ReactApexChart
            options={userOverviewDonutChartOptions}
            series={series}
            type='donut'
            height={270}
          />
          <ul className='d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3'>
            <li className='d-flex flex-column gap-8'>
              <div className='d-flex align-items-center gap-2'>
                <span className='w-12-px h-12-px rounded-circle bg-warning-600' />
                <span className='text-secondary-light text-sm fw-semibold'>
                  {t("organic_search")}
                </span>
              </div>
              <span className='text-primary-light fw-bold'>875</span>
            </li>
            <li className='d-flex flex-column gap-8'>
              <div className='d-flex align-items-center gap-2'>
                <span className='w-12-px h-12-px rounded-circle bg-success-600' />
                <span className='text-secondary-light text-sm fw-semibold'>
                  {t("referrals")}
                </span>
              </div>
              <span className='text-primary-light fw-bold'>450</span>
            </li>
            <li className='d-flex flex-column gap-8'>
              <div className='d-flex align-items-center gap-2'>
                <span className='w-12-px h-12-px rounded-circle bg-primary-600' />
                <span className='text-secondary-light text-sm fw-semibold'>
                  {t("social_media")}
                </span>
              </div>
              <span className='text-primary-light fw-bold'>4,305</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrafficSourcesOne;
