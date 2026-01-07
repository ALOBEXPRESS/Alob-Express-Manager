"use client";
import useReactApexChart from "../../hook/useReactApexChart";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ETHPriceOne = () => {
  const { createChartSevenConfig } = useReactApexChart();
  const t = useTranslations("dashboard");
  const { options, series } = createChartSevenConfig("#487FFF");

  return (
    <div className='col-xxl-12 col-md-6'>
      <div className='card h-100'>
        <div className='card-header border-bottom d-flex align-items-center flex-wrap gap-2 justify-content-between'>
          <h6 className='fw-bold text-lg mb-0'>{t("eth_price")}</h6>
          <select
            className='form-select form-select-sm w-auto bg-base border text-secondary-light rounded-pill'
            defaultValue=''
          >
            <option value='' disabled>
              {t("select_month")}
            </option>
            <option value='November'>{t("november")}</option>
            <option value='December'>{t("december")}</option>
            <option value='January'>{t("january")}</option>
            <option value='February'>{t("february")}</option>
            <option value='March'>{t("march")}</option>
            <option value='April'>{t("april")}</option>
            <option value='May'>{t("may")}</option>
            <option value='June'>{t("june")}</option>
            <option value='July'>{t("july")}</option>
            <option value='August'>{t("august")}</option>
            <option value='September'>{t("september")}</option>
          </select>
        </div>
        <div className='card-body'>
          <div
            id='enrollmentChart'
            className='apexcharts-tooltip-style-1 yaxies-more'
          >
            {/* pass the color value here */}
            <ReactApexChart options={options} series={series} type="area" height={80} width={160} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETHPriceOne;
