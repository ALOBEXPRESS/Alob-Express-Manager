"use client";
import useReactApexChart from "../../hook/useReactApexChart";
import { useTranslations } from 'next-intl';
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const CoinAnalyticsTwo = () => {
  let { createChartFourConfig } = useReactApexChart();
  const t = useTranslations('dashboard');

  const renderChartFour = (color, height, width) => {
    const { options, series } = createChartFourConfig(color, height, width);
    return <ReactApexChart options={options} series={series} type="area" height={height} width={width} />;
  };

  return (
    <div className='col-xxl-6'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg'>{t('coin_analytics')}</h6>
            <div className='border radius-4 px-3 py-2 pe-0 d-flex align-items-center gap-1 text-sm text-secondary-light'>
              {t('currency')}:
              <select
                className='form-select form-select-sm w-auto bg-base border-0 text-primary-light fw-semibold text-sm'
                defaultValue='Select Currency'
              >
                <option value='Select Currency' disabled>
                  {t('select_frequency')}
                </option>
                <option value='USD'>USD</option>
                <option value='BDT'>BDT</option>
                <option value='RUP'>RUP</option>
              </select>
            </div>
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 bg-neutral-200 px-8 py-8 radius-4 mb-16'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='/assets/images/currency/crypto-img1.png'
                alt=''
                className='w-36-px h-36-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>{t('bitcoin')}</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0 text-end flex-shrink-0' style={{ minWidth: 80 }}>$0.00</h6>
            <span className='text-success-main text-md fw-medium text-end flex-shrink-0' style={{ minWidth: 64 }}>0.00%</span>
            <div
              id='markerBitcoinChart'
              className='remove-tooltip-title rounded-tooltip-value flex-shrink-0'
            >
              {/* Pass the color value, height, width  here */}
              {renderChartFour("#45B369", 42, 100)}
            </div>
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 bg-neutral-200 px-8 py-8 radius-4 mb-16'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='/assets/images/currency/crypto-img2.png'
                alt=''
                className='w-36-px h-36-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>{t('ethereum')}</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0 text-end flex-shrink-0' style={{ minWidth: 80 }}>$0.00</h6>
            <span className='text-danger-main text-md fw-medium text-end flex-shrink-0' style={{ minWidth: 64 }}>0.00%</span>
            <div
              id='markerEthereumChart'
              className='remove-tooltip-title rounded-tooltip-value flex-shrink-0'
            >
              {/* Pass the color value, height, width  here */}
              {renderChartFour("#EF4A00", 42, 100)}
            </div>
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 bg-neutral-200 px-8 py-8 radius-4 mb-16'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='/assets/images/currency/crypto-img3.png'
                alt=''
                className='w-36-px h-36-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>{t('solana')}</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0 text-end flex-shrink-0' style={{ minWidth: 80 }}>$0.00</h6>
            <span className='text-success-main text-md fw-medium text-end flex-shrink-0' style={{ minWidth: 64 }}>0.00%</span>
            <div
              id='markerSolanaChart'
              className='remove-tooltip-title rounded-tooltip-value flex-shrink-0'
            >
              {/* Pass the color value, height, width  here */}
              {renderChartFour("#45B369", 42, 100)}
            </div>
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 bg-neutral-200 px-8 py-8 radius-4 mb-16'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='/assets/images/currency/crypto-img4.png'
                alt=''
                className='w-36-px h-36-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>{t('litecoin')}</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0 text-end flex-shrink-0' style={{ minWidth: 80 }}>$0.00</h6>
            <span className='text-success-main text-md fw-medium text-end flex-shrink-0' style={{ minWidth: 64 }}>0.00%</span>
            <div
              id='markerLitecoinChart'
              className='remove-tooltip-title rounded-tooltip-value flex-shrink-0'
            >
              {/* Pass the color value, height, width  here */}
              {renderChartFour("#45B369", 42, 100)}
            </div>
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 bg-neutral-200 px-8 py-8 radius-4 mb-16'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='/assets/images/currency/crypto-img5.png'
                alt=''
                className='w-36-px h-36-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>{t('dogecoin')}</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0 text-end flex-shrink-0' style={{ minWidth: 80 }}>$0.00</h6>
            <span className='text-danger-main text-md fw-medium text-end flex-shrink-0' style={{ minWidth: 64 }}>0.00%</span>
            <div
              id='markerDogecoinChart'
              className='remove-tooltip-title rounded-tooltip-value flex-shrink-0'
            >
              {/* Pass the color value, height, width  here */}
              {renderChartFour("#EF4A00", 42, 100)}
            </div>
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 bg-neutral-200 px-8 py-4 radius-4'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='/assets/images/currency/crypto-img1.png'
                alt=''
                className='w-36-px h-36-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>{t('crypto_currency')}</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0 text-end flex-shrink-0' style={{ minWidth: 80 }}>$0.00</h6>
            <span className='text-danger-main text-md fw-medium text-end flex-shrink-0' style={{ minWidth: 64 }}>0.00%</span>
            <div
              id='markerCryptoChart'
              className='remove-tooltip-title rounded-tooltip-value flex-shrink-0'
            >
              {/* Pass the color value, height, width  here */}
              {renderChartFour("#EF4A00", 42, 100)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinAnalyticsTwo;
