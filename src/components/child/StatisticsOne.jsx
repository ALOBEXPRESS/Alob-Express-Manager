"use client";
import { Icon } from "@iconify/react";
import useReactApexChart from "../../hook/useReactApexChart";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const StatisticsOne = () => {
  const {
    dailyIconBarChartSeriesTwo,
    dailyIconBarChartOptionsTwo,
    createChartEightConfig,
  } = useReactApexChart();
  const t = useTranslations("dashboard");
  
  const { options: chartEightOptions, series: chartEightSeries } = createChartEightConfig("#FF9F29");

  return (
    <div className='col-xxl-12 col-md-6'>
      <div className='card h-100'>
        <div className='card-header border-bottom d-flex align-items-center flex-wrap gap-2 justify-content-between'>
          <h6 className='fw-bold text-lg mb-0'>{t("statistics")}</h6>
          <Link
            href='#'
            className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
          >
            {t("view_all")}
            <Icon icon='solar:alt-arrow-right-linear' className='icon' />
          </Link>
        </div>
        <div className='card-body'>
          <div className='d-flex align-items-center gap-1 justify-content-between mb-44'>
            <div>
              <h5 className='fw-semibold mb-12'>145</h5>
              <span className='text-secondary-light fw-normal text-xl'>
                {t("total_art_sold")}
              </span>
            </div>

            <ReactApexChart
              id='dailyIconBarChart'
              options={dailyIconBarChartOptionsTwo}
              series={dailyIconBarChartSeriesTwo}
              type='bar'
              height={80}
              width={164}
            />
          </div>
          <div className='d-flex align-items-center gap-1 justify-content-between'>
            <div>
              <h5 className='fw-semibold mb-12'>750 ETH</h5>
              <span className='text-secondary-light fw-normal text-xl'>
                {t("total_earnings")}
              </span>
            </div>

            <div id='areaChart'>
              {/* pass the color value */}
              <ReactApexChart options={chartEightOptions} series={chartEightSeries} type="area" height={80} width={160} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsOne;
