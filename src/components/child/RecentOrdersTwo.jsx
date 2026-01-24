"use client";
import { Icon } from "@iconify/react";
import useReactApexChart from "../../hook/useReactApexChart";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RecentOrdersTwo = () => {
  let { createChartTwoConfig } = useReactApexChart();
  const t = useTranslations('dashboard');
  const { options, series } = createChartTwoConfig("#487fff", 360);

  return (
    <div className='col-xxl-4'>
      <div className='card h-100 radius-8 border'>
        <div className='card-body p-24'>
          <h6 className='mb-12 fw-bold text-lg mb-0'>{t('recent_orders')}</h6>
          <div className='d-flex align-items-center gap-2'>
            <h6 className='fw-semibold mb-0'>$0.00</h6>
            <p className='text-sm mb-0'>
              <span className='bg-success-focus border border-success px-8 py-2 rounded-pill fw-semibold text-success-main text-sm d-inline-flex align-items-center gap-1'>
                0%
                <Icon icon='iconamoon:arrow-up-2-fill' className='icon' />
              </span>
              {t('increases')}
            </p>
          </div>
          <div id='recent-orders' className='mt-28'>
            {/* Pass the color value & height here */}
            <ReactApexChart options={options} series={series} type="area" height={360} width={"100%"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersTwo;
