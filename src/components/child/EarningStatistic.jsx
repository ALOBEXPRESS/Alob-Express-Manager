"use client";

import useReactApexChart from "@/hook/useReactApexChart";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const EarningStatistic = () => {
  const t = useTranslations("dashboard");
  let { enrollmentChartOptions, enrollmentChartSeries } = useReactApexChart();
  return (
    <>
      <div className='col-xxl-12'>
        <div className='card h-100'>
          <div className='card-header'>
            <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
              <h6 className='mb-2 fw-bold text-lg mb-0'>{t("earning_statistic")}</h6>
              <select className='form-select form-select-sm w-auto bg-base border-0 text-secondary-light'>
                <option>{t("this_month")}</option>
                <option>{t("this_week")}</option>
                <option>{t("this_year")}</option>
              </select>
            </div>
          </div>
          <div className='card-body p-24'>
            <ul className='d-flex flex-wrap align-items-center justify-content-center my-3 gap-3'>
              <li className='d-flex align-items-center gap-2'>
                <span className='w-12-px h-8-px rounded-pill bg-primary-600' />
                <span className='text-secondary-light text-sm fw-semibold'>
                  {t("new_patient")}:
                  <span className='text-primary-light fw-bold'>50</span>
                </span>
              </li>
              <li className='d-flex align-items-center gap-2'>
                <span className='w-12-px h-8-px rounded-pill bg-warning-600' />
                <span className='text-secondary-light text-sm fw-semibold'>
                  {t("old_patient")}:
                  <span className='text-primary-light fw-bold'> 500</span>
                </span>
              </li>
            </ul>
            <div id='enrollmentChart' className='apexcharts-tooltip-style-1'>
              <ReactApexChart
                options={enrollmentChartOptions}
                series={enrollmentChartSeries}
                type='area'
                height={260}
                width={"100%"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EarningStatistic;
