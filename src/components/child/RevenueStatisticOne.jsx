"use client";

import useReactApexChart from "@/hook/useReactApexChart";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueStatisticOne = () => {
  const t = useTranslations("dashboard");
  let { revenueChartOptionsOne, revenueChartSeriesOne } = useReactApexChart();
  return (
    <div className='col-xxl-6'>
      <div className='card h-100'>
        <div className='card-body p-24 mb-8'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("revenue_statistic")}</h6>
            <select className='form-select form-select-sm w-auto bg-base border text-secondary-light'>
              <option>{t("yearly")}</option>
              <option>{t("monthly")}</option>
              <option>{t("weekly")}</option>
              <option>{t("today")}</option>
            </select>
          </div>
          <ul className='d-flex flex-wrap align-items-center justify-content-center my-3 gap-24'>
            <li className='d-flex flex-column gap-1'>
              <div className='d-flex align-items-center gap-2'>
                <span className='w-8-px h-8-px rounded-pill bg-primary-600' />
                <span className='text-secondary-light text-sm fw-semibold'>
                  {t("profit")}{" "}
                </span>
              </div>
              <div className='d-flex align-items-center gap-8'>
                <h6 className='mb-0'>$0.00</h6>
                <span className='text-success-600 d-flex align-items-center gap-1 text-sm fw-bolder'>
                  0%
                  <i className='ri-arrow-up-s-fill d-flex' />
                </span>
              </div>
            </li>
            <li className='d-flex flex-column gap-1'>
              <div className='d-flex align-items-center gap-2'>
                <span className='w-8-px h-8-px rounded-pill bg-lilac-600' />
                <span className='text-secondary-light text-sm fw-semibold'>
                  {t("loss")}{" "}
                </span>
              </div>
              <div className='d-flex align-items-center gap-8'>
                <h6 className='mb-0'>$0.00</h6>
                <span className='text-danger-600 d-flex align-items-center gap-1 text-sm fw-bolder'>
                  0%
                  <i className='ri-arrow-down-s-fill d-flex' />
                </span>
              </div>
            </li>
          </ul>
          <div id='revenueChart' className='apexcharts-tooltip-style-1'>
            <ReactApexChart
              options={revenueChartOptionsOne}
              series={revenueChartSeriesOne}
              type='area'
              height={150}
              width={"100%"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueStatisticOne;
