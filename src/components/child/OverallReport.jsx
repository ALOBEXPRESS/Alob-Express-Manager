"use client";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import useReactApexChart from "../../hook/useReactApexChart";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const OverallReport = () => {
  const t = useTranslations("dashboard");
  let { userOverviewDonutChartOptionsTwo, userOverviewDonutChartSeriesTwo } =
    useReactApexChart();
  return (
    <div className='col-xxl-4 col-md-6'>
      <div className='card h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg'>{t("overall_report")}</h6>
            <select className='form-select form-select-sm w-auto bg-base border text-secondary-light'>
              <option>{t("yearly")}</option>
              <option>{t("monthly")}</option>
              <option>{t("weekly")}</option>
              <option>{t("today")}</option>
            </select>
          </div>
        </div>
        <div className='card-body p-24'>
          <div className='mt-32'>
            <div
              id='userOverviewDonutChart'
              className='mx-auto apexcharts-tooltip-z-none'
            >
              <ReactApexChart
                options={userOverviewDonutChartOptionsTwo}
                series={userOverviewDonutChartSeriesTwo}
                type='donut'
                height={270}
              />
            </div>
          </div>
          <div className='d-flex flex-wrap gap-20 justify-content-center mt-48'>
            <div className='d-flex align-items-center gap-8'>
              <span className='w-16-px h-16-px radius-2 bg-primary-600' />
              <span className='text-secondary-light'>{t("purchase")}</span>
            </div>
            <div className='d-flex align-items-center gap-8'>
              <span className='w-16-px h-16-px radius-2 bg-lilac-600' />
              <span className='text-secondary-light'>{t("sales")}</span>
            </div>
            <div className='d-flex align-items-center gap-8'>
              <span className='w-16-px h-16-px radius-2 bg-warning-600' />
              <span className='text-secondary-light'>{t("expense")}</span>
            </div>
            <div className='d-flex align-items-center gap-8'>
              <span className='w-16-px h-16-px radius-2 bg-success-600' />
              <span className='text-secondary-light'>{t("gross_profit")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallReport;
