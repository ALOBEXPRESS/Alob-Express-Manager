"use client";
import useReactApexChart from "@/hook/useReactApexChart";
import dynamic from "next/dynamic";
import { useTranslations } from 'next-intl';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ClientPaymentOne = () => {
  let { paymentStatusChartSeriesTwo, paymentStatusChartOptionsTwo } =
    useReactApexChart();
  const t = useTranslations('dashboard');

  return (
    <div className='col-xxl-4 col-sm-6'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24'>
          <h6 className='mb-2 fw-bold text-lg'>{t('client_payment_status')}</h6>
          <span className='text-sm fw-medium text-secondary-light'>
            {t('weekly_report')}
          </span>
          <ul className='d-flex flex-wrap align-items-center justify-content-center mt-32'>
            <li className='d-flex align-items-center gap-2 me-28'>
              <span className='w-12-px h-12-px rounded-circle bg-success-main' />
              <span className='text-secondary-light text-sm fw-medium'>
                {t('paid')}: 500
              </span>
            </li>
            <li className='d-flex align-items-center gap-2 me-28'>
              <span className='w-12-px h-12-px rounded-circle bg-info-main' />
              <span className='text-secondary-light text-sm fw-medium'>
                {t('pending')}: 500
              </span>
            </li>
            <li className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px rounded-circle bg-warning-main' />
              <span className='text-secondary-light text-sm fw-medium'>
                {t('overdue')}: 1500
              </span>
            </li>
          </ul>
          <div className='mt-40'>
            <ReactApexChart
              options={paymentStatusChartOptionsTwo}
              series={paymentStatusChartSeriesTwo}
              type='bar'
              height={350}
              id='paymentStatusChart'
              className='margin-16-minus'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPaymentOne;
