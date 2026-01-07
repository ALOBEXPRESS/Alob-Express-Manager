"use client";
import useReactApexChart from "../../hook/useReactApexChart";
import { useTranslations } from 'next-intl';
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const UnitCountThree = () => {
  let { createChartThreeConfig } = useReactApexChart();
  const t = useTranslations('dashboard');

  const renderChartThree = (color) => {
    const { options, series } = createChartThreeConfig(color);
    return <ReactApexChart options={options} series={series} type="area" height={60} width={120} />;
  };

  return (
    <div className=' row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4'>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-end-3'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <img
                src='/assets/images/currency/crypto-img1.png'
                alt=''
                className='w-40-px h-40-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-xl mb-1'>{t('bitcoin')}</h6>
                <p className='fw-medium text-secondary-light mb-0'>BTC</p>
              </div>
            </div>
            <div className='mt-3 d-flex flex-wrap justify-content-between align-items-center gap-1'>
              <div className=''>
                <h6 className='mb-8'>$45,138</h6>
                <span className='text-success-main text-md'>+ 27%</span>
              </div>
              <div
                id='bitcoinAreaChart'
                className='remove-tooltip-title rounded-tooltip-value'
              >
                {/* Pass the color value here */}
                {renderChartThree("#F98C08")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-end-1'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <img
                src='/assets/images/currency/crypto-img2.png'
                alt=''
                className='w-40-px h-40-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-xl mb-1'>{t('ethereum')}</h6>
                <p className='fw-medium text-secondary-light mb-0'>ETH</p>
              </div>
            </div>
            <div className='mt-3 d-flex flex-wrap justify-content-between align-items-center gap-1'>
              <div className=''>
                <h6 className='mb-8'>$45,138</h6>
                <span className='text-danger-main text-md'>- 27%</span>
              </div>
              <div
                id='ethereumAreaChart'
                className='remove-tooltip-title rounded-tooltip-value'
              >
                {/* Pass the color value here */}
                {renderChartThree("#5F80FF")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-end-5'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <img
                src='/assets/images/currency/crypto-img3.png'
                alt=''
                className='w-40-px h-40-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-xl mb-1'>{t('solana')}</h6>
                <p className='fw-medium text-secondary-light mb-0'>SOL</p>
              </div>
            </div>
            <div className='mt-3 d-flex flex-wrap justify-content-between align-items-center gap-1'>
              <div className=''>
                <h6 className='mb-8'>$45,138</h6>
                <span className='text-success-main text-md'>+ 27%</span>
              </div>
              <div
                id='solanaAreaChart'
                className='remove-tooltip-title rounded-tooltip-value'
              >
                {/* Pass the color value here */}
                {renderChartThree("#C817F8")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-end-6'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <img
                src='/assets/images/currency/crypto-img4.png'
                alt=''
                className='w-40-px h-40-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-xl mb-1'>{t('litecoin')}</h6>
                <p className='fw-medium text-secondary-light mb-0'>LTE</p>
              </div>
            </div>
            <div className='mt-3 d-flex flex-wrap justify-content-between align-items-center gap-1'>
              <div className=''>
                <h6 className='mb-8'>$45,138</h6>
                <span className='text-success-main text-md'>+ 27%</span>
              </div>
              <div
                id='litecoinAreaChart'
                className='remove-tooltip-title rounded-tooltip-value'
              >
                {/* Pass the color value here */}
                {renderChartThree("#2171EA")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-end-3'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <img
                src='/assets/images/currency/crypto-img5.png'
                alt=''
                className='w-40-px h-40-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-xl mb-1'>{t('dogecoin')}</h6>
                <p className='fw-medium text-secondary-light mb-0'>DOGE</p>
              </div>
            </div>
            <div className='mt-3 d-flex flex-wrap justify-content-between align-items-center gap-1'>
              <div className=''>
                <h6 className='mb-8'>$45,138</h6>
                <span className='text-success-main text-md'>+ 27%</span>
              </div>
              <div
                id='dogecoinAreaChart'
                className='remove-tooltip-title rounded-tooltip-value'
              >
                {/* Pass the color value here */}
                {renderChartThree("#C2A633")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCountThree;
