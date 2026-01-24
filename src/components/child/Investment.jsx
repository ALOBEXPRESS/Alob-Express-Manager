"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const Investment = () => {
  const t = useTranslations("dashboard");
  const [selectedPeriod, setSelectedPeriod] = useState(t("weekly"));

  const data = {
    [t("today")]: {
      total: "$0.00",
      percentages: { income: "0%", realState: "0%", business: "0%" },
      values: { income: "$0.00", realState: "$0.00", business: "$0.00" }
    },
    [t("weekly")]: {
      total: "$0.00",
      percentages: { income: "0%", realState: "0%", business: "0%" },
      values: { income: "$0.00", realState: "$0.00", business: "$0.00" }
    },
    [t("monthly")]: {
      total: "$0.00",
      percentages: { income: "0%", realState: "0%", business: "0%" },
      values: { income: "$0.00", realState: "$0.00", business: "$0.00" }
    },
    [t("yearly")]: {
      total: "$0.00",
      percentages: { income: "0%", realState: "0%", business: "0%" },
      values: { income: "$0.00", realState: "$0.00", business: "$0.00" }
    }
  };

  const currentData = data[selectedPeriod] || data[t("weekly")];

  return (
    <div className='card radius-16 mt-24'>
      <div className='card-header'>
        <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
          <h6 className='mb-2 fw-bold text-lg mb-0'>{t("investment")}</h6>
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
      <div className='card-body py-20'>
        <p className='text-center text-secondary-light d-flex align-items-center gap-8 justify-content-center'>
          {t("total_investment")}:{" "}
          <span className='fw-semibold text-primary-light'>{currentData.total}</span>{" "}
        </p>
        <div className='mt-40 mb-24 text-center pe-110 position-relative max-w-288-px mx-auto'>
          <div className='w-170-px h-170-px rounded-circle z-1 position-relative d-inline-flex justify-content-center align-items-center border border-white border-width-2-px'>
            <img
              src='/assets/images/home-eleven/bg/radial-bg1.png'
              alt=''
              className='position-absolute top-0 start-0 z-n1 w-100 h-100 object-fit-cover'
            />
            <h5 className='text-white'> {currentData.percentages.income} </h5>
          </div>
          <div className='w-144-px h-144-px rounded-circle z-1 position-relative d-inline-flex justify-content-center align-items-center border border-white border-width-3-px position-absolute top-0 end-0 mt--36'>
            <img
              src='/assets/images/home-eleven/bg/radial-bg2.png'
              alt=''
              className='position-absolute top-0 start-0 z-n1 w-100 h-100 object-fit-cover'
            />
            <h5 className='text-white'> {currentData.percentages.realState} </h5>
          </div>
          <div className='w-110-px h-110-px rounded-circle z-1 position-relative d-inline-flex justify-content-center align-items-center border border-white border-width-3-px position-absolute bottom-0 start-50 translate-middle-x ms-48'>
            <img
              src='/assets/images/home-eleven/bg/radial-bg3.png'
              alt=''
              className='position-absolute top-0 start-0 z-n1 w-100 h-100 object-fit-cover'
            />
            <h5 className='text-white'> {currentData.percentages.business} </h5>
          </div>
        </div>
        <div className='d-flex align-items-center flex-wrap gap-24 justify-content-between'>
          <div className='d-flex flex-column align-items-start'>
            <div className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px rounded-pill bg-primary-600' />
              <span className='text-secondary-light text-sm fw-normal'>
                {t("net_income")}
              </span>
            </div>
            <h6 className='text-primary-light fw-semibold mb-0 mt-4 text-lg'>
              {currentData.values.income}
            </h6>
          </div>
          <div className='d-flex flex-column align-items-start'>
            <div className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px rounded-pill bg-purple' />
              <span className='text-secondary-light text-sm fw-normal'>
                {t("real_state")}
              </span>
            </div>
            <h6 className='text-primary-light fw-semibold mb-0 mt-4 text-lg'>
              {currentData.values.realState}
            </h6>
          </div>
          <div className='d-flex flex-column align-items-start'>
            <div className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px rounded-pill bg-success-600' />
              <span className='text-secondary-light text-sm fw-normal'>
                {t("business")}
              </span>
            </div>
            <h6 className='text-primary-light fw-semibold mb-0 mt-4 text-lg'>
              {currentData.values.business}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investment;
