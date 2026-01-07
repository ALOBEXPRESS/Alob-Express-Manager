"use client";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react";
import useReactApexChart from "@/hook/useReactApexChart";
import { useTranslations } from "next-intl";
import { useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const CampaignStaticOne = () => {
  const t = useTranslations("dashboard");
  let { donutChartSeriesTwo, donutChartOptionsTwo } = useReactApexChart();
  
  const [progressData, setProgressData] = useState({
    email: 80,
    website: 60,
    facebook: 49,
    other: 70
  });
  const [customerOverviewTimeframe, setCustomerOverviewTimeframe] = useState("Yearly");
  const [customerSeries, setCustomerSeries] = useState(donutChartSeriesTwo);

  const handleChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case 'Yearly':
        setProgressData({ email: 80, website: 60, facebook: 49, other: 70 });
        break;
      case 'Monthly':
        setProgressData({ email: 60, website: 50, facebook: 30, other: 50 });
        break;
      case 'Weekly':
        setProgressData({ email: 40, website: 30, facebook: 20, other: 30 });
        break;
      case 'Today':
        setProgressData({ email: 10, website: 5, facebook: 2, other: 8 });
        break;
      default:
        setProgressData({ email: 80, website: 60, facebook: 49, other: 70 });
    }
  };

  const handleCustomerOverviewChange = (e) => {
    const value = e.target.value;
    setCustomerOverviewTimeframe(value);
    switch (value) {
      case 'Yearly':
        setCustomerSeries(donutChartSeriesTwo);
        break;
      case 'Monthly':
        setCustomerSeries([35, 20, 45]);
        break;
      case 'Weekly':
        setCustomerSeries([25, 15, 60]);
        break;
      case 'Today':
        setCustomerSeries([15, 10, 75]);
        break;
      default:
        setCustomerSeries(donutChartSeriesTwo);
    }
  };

  return (
    <div className='col-xxl-4'>
      <div className='row gy-4'>
        <div className='col-xxl-12 col-sm-6'>
          <div className='card h-100 radius-8 border-0'>
            <div className='card-body p-24'>
              <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
                <h6 className='mb-2 fw-bold text-lg'>{t("campaigns")}</h6>
                <div className=''>
                  <select
                    className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                    defaultValue='Yearly'
                    onChange={handleChange}
                  >
                    <option value='Yearly'>{t("yearly")}</option>
                    <option value='Monthly'>{t("monthly")}</option>
                    <option value='Weekly'>{t("weekly")}</option>
                    <option value='Today'>{t("today")}</option>
                  </select>
                </div>
              </div>
              <div className='mt-3'>
                <div className='d-flex align-items-center justify-content-between gap-3 mb-12'>
                  <div className='d-flex align-items-center'>
                    <span className='text-xxl line-height-1 d-flex align-content-center flex-shrink-0 text-orange'>
                      <Icon icon='majesticons:mail' className='icon' />
                    </span>
                    <span className='text-primary-light fw-medium text-sm ps-12'>
                      {t('email')}
                    </span>
                  </div>
                  <div className='d-flex align-items-center gap-2 w-100'>
                    <div className='w-100 max-w-66 ms-auto'>
                      <div
                        className='progress progress-sm rounded-pill'
                        role='progressbar'
                        aria-label='Success example'
                        aria-valuenow={progressData.email}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className='progress-bar bg-orange rounded-pill'
                          style={{ width: `${progressData.email}%` }}
                        />
                      </div>
                    </div>
                    <span className='text-secondary-light font-xs fw-semibold'>
                      {progressData.email}%
                    </span>
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-between gap-3 mb-12'>
                  <div className='d-flex align-items-center'>
                    <span className='text-xxl line-height-1 d-flex align-content-center flex-shrink-0 text-success-main'>
                      <Icon icon='eva:globe-2-fill' className='icon' />
                    </span>
                    <span className='text-primary-light fw-medium text-sm ps-12'>
                      {t('website')}
                    </span>
                  </div>
                  <div className='d-flex align-items-center gap-2 w-100'>
                    <div className='w-100 max-w-66 ms-auto'>
                      <div
                        className='progress progress-sm rounded-pill'
                        role='progressbar'
                        aria-label='Success example'
                        aria-valuenow={progressData.website}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className='progress-bar bg-success-main rounded-pill'
                          style={{ width: `${progressData.website}%` }}
                        />
                      </div>
                    </div>
                    <span className='text-secondary-light font-xs fw-semibold'>
                      {progressData.website}%
                    </span>
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-between gap-3 mb-12'>
                  <div className='d-flex align-items-center'>
                    <span className='text-xxl line-height-1 d-flex align-content-center flex-shrink-0 text-info-main'>
                      <Icon
                        icon='fa6-brands:square-facebook'
                        className='icon'
                      />
                    </span>
                    <span className='text-primary-light fw-medium text-sm ps-12'>
                      {t('facebook')}
                    </span>
                  </div>
                  <div className='d-flex align-items-center gap-2 w-100'>
                    <div className='w-100 max-w-66 ms-auto'>
                      <div
                        className='progress progress-sm rounded-pill'
                        role='progressbar'
                        aria-label='Success example'
                        aria-valuenow={progressData.facebook}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className='progress-bar bg-info-main rounded-pill'
                          style={{ width: `${progressData.facebook}%` }}
                        />
                      </div>
                    </div>
                    <span className='text-secondary-light font-xs fw-semibold'>
                      {progressData.facebook}%
                    </span>
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-between gap-3'>
                  <div className='d-flex align-items-center'>
                    <span className='text-xxl line-height-1 d-flex align-content-center flex-shrink-0 text-indigo'>
                      <Icon
                        icon='fluent:location-off-20-filled'
                        className='icon'
                      />
                    </span>
                    <span className='text-primary-light fw-medium text-sm ps-12'>
                      {t('email')}
                    </span>
                  </div>
                  <div className='d-flex align-items-center gap-2 w-100'>
                    <div className='w-100 max-w-66 ms-auto'>
                      <div
                        className='progress progress-sm rounded-pill'
                        role='progressbar'
                        aria-label='Success example'
                        aria-valuenow={progressData.other}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className='progress-bar bg-indigo rounded-pill'
                          style={{ width: `${progressData.other}%` }}
                        />
                      </div>
                    </div>
                    <span className='text-secondary-light font-xs fw-semibold'>
                      {progressData.other}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-xxl-12 col-sm-6'>
          <div className='card h-100 radius-8 border-0 overflow-hidden'>
            <div className='card-body p-24'>
              <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
                <h6 className='mb-2 fw-bold text-lg'>{t("customer_overview")}</h6>
                <div className=''>
                  <select
                    className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                    value={customerOverviewTimeframe}
                    onChange={handleCustomerOverviewChange}
                  >
                    <option value='Yearly'>{t("yearly")}</option>
                    <option value='Monthly'>{t("monthly")}</option>
                    <option value='Weekly'>{t("weekly")}</option>
                    <option value='Today'>{t("today")}</option>
                  </select>
                </div>
              </div>
              <div className='d-flex flex-wrap align-items-center mt-3'>
                <ul className='flex-shrink-0'>
                  <li className='d-flex align-items-center gap-2 mb-28'>
                    <span className='w-12-px h-12-px rounded-circle bg-success-main' />
                    <span className='text-secondary-light text-sm fw-medium'>
                      {t("total")}: 500
                    </span>
                  </li>
                  <li className='d-flex align-items-center gap-2 mb-28'>
                    <span className='w-12-px h-12-px rounded-circle bg-warning-main' />
                    <span className='text-secondary-light text-sm fw-medium'>
                      {t("new")}: 500
                    </span>
                  </li>
                  <li className='d-flex align-items-center gap-2'>
                    <span className='w-12-px h-12-px rounded-circle bg-primary-600' />
                    <span className='text-secondary-light text-sm fw-medium'>
                      {t("active")}: 1500
                    </span>
                  </li>
                </ul>
                <div>
                  <ReactApexChart
                    options={donutChartOptionsTwo}
                    series={customerSeries}
                    type='donut'
                    height={300}
                    id='donutChart'
                    className='flex-grow-1 apexcharts-tooltip-z-none title-style circle-none'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignStaticOne;
