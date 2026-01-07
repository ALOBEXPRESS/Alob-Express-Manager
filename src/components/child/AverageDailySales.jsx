"use client";

import useReactApexChart from "@/hook/useReactApexChart";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const AverageDailySales = () => {
  const t = useTranslations("dashboard");
  let { barChartOptionsOne, barChartSeriesOne } = useReactApexChart();
  return (
    <div className='col-xxl-4 col-xl-6'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("average_daily_sales")}</h6>
            <select className='form-select form-select-sm w-auto bg-base border text-secondary-light'>
              <option>{t("yearly")}</option>
              <option>{t("monthly")}</option>
              <option>{t("weekly")}</option>
              <option>{t("today")}</option>
            </select>
          </div>
          <h6 className='text-center my-20'>$27,500.00</h6>
          <div id='barChart' className='barChart'>
            <ReactApexChart
              options={barChartOptionsOne}
              series={barChartSeriesOne}
              type='bar'
              height={220}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AverageDailySales;
