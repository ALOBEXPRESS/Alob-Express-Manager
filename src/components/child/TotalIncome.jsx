"use client";

import useReactApexChart from "@/hook/useReactApexChart";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const TotalIncome = () => {
  const t = useTranslations("dashboard");
  let { statisticsDonutChartOptionsTwo, statisticsDonutChartSeriesTwo } =
    useReactApexChart();
  return (
    <div className='col-xxl-12 col-xl-6'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-header border-bottom d-flex align-items-center flex-wrap gap-2 justify-content-between'>
          <h6 className='mb-2 fw-bold text-lg'>{t("total_income")}</h6>
          <div className=''>
            <select className='form-select form-select-sm w-auto bg-base border-0 text-secondary-light'>
              <option>{t("this_month")}</option>
              <option>{t("this_week")}</option>
              <option>{t("this_year")}</option>
            </select>
          </div>
        </div>
        <div className='card-body p-24'>
          <div className='position-relative'>
            <div
              id='statisticsDonutChart'
              className='mt-36 flex-grow-1 apexcharts-tooltip-z-none title-style circle-none'
            >
              <ReactApexChart
                options={statisticsDonutChartOptionsTwo}
                series={statisticsDonutChartSeriesTwo}
                type='donut'
                height={260}
              />
            </div>
            <div className='text-center position-absolute top-50 start-50 translate-middle'>
              <span className='text-secondary-light'>{t("income")}</span>
              <h6 className=''>$28,500</h6>
            </div>
          </div>
          <ul className='row gy-4 mt-3'>
            <li className='col-6 d-flex flex-column align-items-center'>
              <div className='d-flex align-items-center gap-2'>
                <span className='w-12-px h-8-px rounded-pill bg-warning-600' />
                <span className='text-secondary-light text-sm fw-normal'>
                  {t("net_income")}
                </span>
              </div>
              <h6 className='text-primary-light fw-bold mb-0'>$50,000</h6>
            </li>
            <li className='col-6 d-flex flex-column align-items-center'>
              <div className='d-flex align-items-center gap-2'>
                <span className='w-12-px h-8-px rounded-pill bg-success-600' />
                <span className='text-secondary-light text-sm fw-normal'>
                  {t("commission")}{" "}
                </span>
              </div>
              <h6 className='text-primary-light fw-bold mb-0'>$20,000</h6>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TotalIncome;
