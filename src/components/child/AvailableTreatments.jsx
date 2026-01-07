import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

const AvailableTreatments = () => {
  const t = useTranslations("dashboard");
  return (
    <div className='col-xxl-12 col-xl-6'>
      <div className='card'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("available_treatments")}</h6>
            <Link
              href='#'
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {t("view_all")}
              <iconify-icon
                icon='solar:alt-arrow-right-linear'
                className='icon'
              />
            </Link>
          </div>
        </div>
        <div className='card-body'>
          <div className='d-flex align-items-center justify-content-between gap-3 mb-24'>
            <div className='d-flex align-items-center gap-12'>
              <div className='w-40-px h-40-px rounded-circle flex-shrink-0 bg-info-50 d-flex justify-content-center align-items-center'>
                <img
                  src='/assets/images/home-eight/treatment-icon1.png'
                  alt=''
                  className=''
                />
              </div>
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0 fw-normal'>{t("psychiatry")}</h6>
                <span className='text-sm text-secondary-light fw-normal'>
                  57 {t("doctors")}
                </span>
              </div>
            </div>
            <span className='text-secondary-light'>08:45 AM</span>
          </div>
          <div className='d-flex align-items-center justify-content-between gap-3 mb-24'>
            <div className='d-flex align-items-center gap-12'>
              <div className='w-40-px h-40-px rounded-circle flex-shrink-0 bg-success-50 d-flex justify-content-center align-items-center'>
                <img
                  src='/assets/images/home-eight/treatment-icon2.png'
                  alt=''
                  className=''
                />
              </div>
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0 fw-normal'>{t("orthopedics")}</h6>
                <span className='text-sm text-secondary-light fw-normal'>
                  85 {t("doctors")}
                </span>
              </div>
            </div>
            <span className='text-secondary-light'>08:45 AM</span>
          </div>
          <div className='d-flex align-items-center justify-content-between gap-3 mb-24'>
            <div className='d-flex align-items-center gap-12'>
              <div className='w-40-px h-40-px rounded-circle flex-shrink-0 bg-lilac-50 d-flex justify-content-center align-items-center'>
                <img
                  src='/assets/images/home-eight/treatment-icon3.png'
                  alt=''
                  className=''
                />
              </div>
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0 fw-normal'>{t("cardiology")}</h6>
                <span className='text-sm text-secondary-light fw-normal'>
                  60 {t("doctors")}
                </span>
              </div>
            </div>
            <span className='text-secondary-light'>08:45 AM</span>
          </div>
          <div className='d-flex align-items-center justify-content-between gap-3 mb-24'>
            <div className='d-flex align-items-center gap-12'>
              <div className='w-40-px h-40-px rounded-circle flex-shrink-0 bg-warning-50 d-flex justify-content-center align-items-center'>
                <img
                  src='/assets/images/home-eight/treatment-icon4.png'
                  alt=''
                  className=''
                />
              </div>
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0 fw-normal'>{t("pediatrics")}</h6>
                <span className='text-sm text-secondary-light fw-normal'>
                  120 {t("doctors")}
                </span>
              </div>
            </div>
            <span className='text-secondary-light'>08:45 AM</span>
          </div>
          <div className='d-flex align-items-center justify-content-between gap-3 mb-24'>
            <div className='d-flex align-items-center gap-12'>
              <div className='w-40-px h-40-px rounded-circle flex-shrink-0 bg-danger-50 d-flex justify-content-center align-items-center'>
                <img
                  src='/assets/images/home-eight/treatment-icon5.png'
                  alt=''
                  className=''
                />
              </div>
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0 fw-normal'>{t("neurology")}</h6>
                <span className='text-sm text-secondary-light fw-normal'>
                  25 {t("doctors")}
                </span>
              </div>
            </div>
            <span className='text-secondary-light'>08:45 AM</span>
          </div>
          <div className='d-flex align-items-center justify-content-between gap-3 mb-0'>
            <div className='d-flex align-items-center gap-12'>
              <div className='w-40-px h-40-px rounded-circle flex-shrink-0 bg-primary-50 d-flex justify-content-center align-items-center'>
                <img
                  src='/assets/images/home-eight/treatment-icon6.png'
                  alt=''
                  className=''
                />
              </div>
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0 fw-normal'>{t("gastroenterology")}</h6>
                <span className='text-sm text-secondary-light fw-normal'>
                  95 {t("doctors")}
                </span>
              </div>
            </div>
            <span className='text-secondary-light'>08:45 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableTreatments;
