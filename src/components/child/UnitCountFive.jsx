"use client";
import useReactApexChart from "../../hook/useReactApexChart";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const UnitCountFive = () => {
  let { createChartSixConfig } = useReactApexChart();
  const t = useTranslations("dashboard");
  
  const [chartData, setChartData] = useState(createChartSixConfig("#45B369", "#487fff"));

  const renderChartSix = () => {
    const { options, series } = chartData;
    return <ReactApexChart options={options} series={series} type="area" height={264} />;
  };

  const handleChange = (e) => {
    // Simulate data change
    setChartData(createChartSixConfig("#45B369", "#487fff"));
  };

  return (
    <div className='col-xxl-8'>
      <div className='card radius-8 border-0 p-20'>
        <div className='row gy-4'>
          <div className='col-xxl-4'>
            <div className='card p-3 radius-8 shadow-none bg-gradient-dark-start-1 mb-12'>
              <div className='card-body p-0'>
                <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0'>
                  <div className='d-flex align-items-center gap-2 mb-12'>
                    <span className='mb-0 w-48-px h-48-px bg-base text-pink text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6'>
                      <i className='ri-group-fill' />
                    </span>
                    <div>
                      <span className='mb-0 fw-medium text-secondary-light text-lg'>
                        {t("total_students")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-between flex-wrap gap-8'>
                  <h5 className='fw-semibold mb-0'>15,000</h5>
                  <p className='text-sm mb-0 d-flex align-items-center gap-8'>
                    <span className='text-white px-1 rounded-2 fw-medium bg-success-main text-sm'>
                      +2.5k
                    </span>
                    {t("this_month")}
                  </p>
                </div>
              </div>
            </div>
            <div className='card p-3 radius-8 shadow-none bg-gradient-dark-start-2 mb-12'>
              <div className='card-body p-0'>
                <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0'>
                  <div className='d-flex align-items-center gap-2 mb-12'>
                    <span className='mb-0 w-48-px h-48-px bg-base text-purple text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6'>
                      <i className='ri-youtube-fill' />
                    </span>
                    <div>
                      <span className='mb-0 fw-medium text-secondary-light text-lg'>
                        {t("total_courses")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-between flex-wrap gap-8'>
                  <h5 className='fw-semibold mb-0'>420</h5>
                  <p className='text-sm mb-0 d-flex align-items-center gap-8'>
                    <span className='text-white px-1 rounded-2 fw-medium bg-success-main text-sm'>
                      +30
                    </span>
                    {t("this_month")}
                  </p>
                </div>
              </div>
            </div>
            <div className='card p-3 radius-8 shadow-none bg-gradient-dark-start-3 mb-0'>
              <div className='card-body p-0'>
                <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0'>
                  <div className='d-flex align-items-center gap-2 mb-12'>
                    <span className='mb-0 w-48-px h-48-px bg-base text-info text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6'>
                      <i className='ri-money-dollar-circle-fill' />
                    </span>
                    <div>
                      <span className='mb-0 fw-medium text-secondary-light text-lg'>
                        {t("overall_revenue")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-between flex-wrap gap-8'>
                  <h5 className='fw-semibold mb-0'>$50,000</h5>
                  <p className='text-sm mb-0 d-flex align-items-center gap-8'>
                    <span className='text-white px-1 rounded-2 fw-medium bg-success-main text-sm'>
                      +1.5k
                    </span>
                    {t("this_month")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-xxl-8'>
            <div className='card-body p-0'>
              <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
                <h6 className='mb-2 fw-bold text-lg'>
                  {t("average_enrollment_rate")}
                </h6>
                <div className=''>
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
              </div>
              <ul className='d-flex flex-wrap align-items-center justify-content-center mt-3 gap-3'>
                <li className='d-flex align-items-center gap-2'>
                  <span className='w-12-px h-12-px rounded-circle bg-primary-600' />
                  <span className='text-secondary-light text-sm fw-semibold'>
                    {t("paid_course")}:
                    <span className='text-primary-light fw-bold'>350</span>
                  </span>
                </li>
                <li className='d-flex align-items-center gap-2'>
                  <span className='w-12-px h-12-px rounded-circle bg-success-main' />
                  <span className='text-secondary-light text-sm fw-semibold'>
                    {t("free_course")}:
                    <span className='text-primary-light fw-bold'>70</span>
                  </span>
                </li>
              </ul>
              <div className='mt-40'>
                <div
                  id='enrollmentChart'
                  className='apexcharts-tooltip-style-1'
                >
                  {/* Pass the color value */}
                  {renderChartSix()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCountFive;
