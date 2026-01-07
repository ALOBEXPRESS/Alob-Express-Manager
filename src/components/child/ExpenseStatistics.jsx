"use client";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState } from "react";
import useReactApexChart from "../../hook/useReactApexChart";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ExpenseStatistics = () => {
  const t = useTranslations("dashboard");
  let { expenseStatisticsOptions, expenseStatisticsSeries } =
    useReactApexChart();

  const [selectedPeriod, setSelectedPeriod] = useState(t("weekly"));

  const seriesData = {
    [t("today")]: [10, 20, 30, 40],
    [t("weekly")]: expenseStatisticsSeries,
    [t("monthly")]: [15, 25, 35, 25],
    [t("yearly")]: [20, 30, 10, 40]
  };

  const currentSeries = seriesData[selectedPeriod] || expenseStatisticsSeries;

  return (
    <div className='col-md-6'>
      <div className='card radius-16 h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("expense_statistics")}</h6>
            <select 
              className='form-select form-select-sm w-auto bg-base border text-secondary-light'
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value={t("today")}>{t("today")}</option>
              <option value={t("weekly")}>{t("weekly")}</option>
              <option value={t("monthly")}>{t("monthly")}</option>
              <option value={t("yearly")}>{t("yearly")}</option>
            </select>
          </div>
        </div>
        <div className='card-body'>
          <div
            id='expenseStatistics'
            className='apexcharts-tooltip-z-none d-flex justify-content-center w-100'
          >
            <ReactApexChart
              options={expenseStatisticsOptions}
              series={currentSeries}
              type='pie'
              height={350}
              width={"100%"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseStatistics;
