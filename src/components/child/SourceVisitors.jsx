import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

const SourceVisitors = () => {
  const t = useTranslations("dashboard");
  return (
    <div className='col-xxl-6'>
      <div className='card h-100'>
        <div className='card-header border-bottom-0 pb-0 d-flex align-items-center flex-wrap gap-2 justify-content-between'>
          <h6 className='mb-2 fw-bold text-lg mb-0'>{t("source_visitors")}</h6>
          <select className='form-select form-select-sm w-auto bg-base border text-secondary-light'>
            <option>{t("last_month")}</option>
            <option>{t("last_week")}</option>
            <option>{t("last_year")}</option>
          </select>
        </div>
        <div className='card-body'>
          <div className='position-relative h-100 min-h-320-px'>
            <div className='md-position-absolute start-0 top-0 mt-20'>
              <h6 className='mb-1'>524,756</h6>
              <span className='text-secondary-light'>
                {t("total_platform_visitors")}
              </span>
            </div>
            <div className='row g-3 h-100'>
              <div className='col-3 d-flex flex-column justify-content-end'>
                <div
                  className='d-flex flex-column align-items-center p-24 pt-16 rounded-top-4 bg-tb-warning'
                  style={{ minHeight: "50%" }}
                >
                  <span className='w-40-px h-40-px d-flex flex-shrink-0 justify-content-center align-items-center bg-warning-600 rounded-circle mb-12'>
                    <img
                      src='/assets/images/home-nine/source-icon1.png'
                      alt=''
                    />
                  </span>
                  <span className='text-secondary-light'>{t("tiktok")}</span>
                  <h6 className='mb-0'>50%</h6>
                </div>
              </div>
              <div className='col-3 d-flex flex-column justify-content-end'>
                <div
                  className='d-flex flex-column align-items-center p-24 pt-16 rounded-top-4 bg-tb-lilac'
                  style={{ minHeight: "66%" }}
                >
                  <span className='w-40-px h-40-px d-flex flex-shrink-0 justify-content-center align-items-center bg-lilac-600 rounded-circle mb-12'>
                    <img
                      src='/assets/images/home-nine/source-icon2.png'
                      alt=''
                    />
                  </span>
                  <span className='text-secondary-light'>{t("instagram")}</span>
                  <h6 className='mb-0'>66%</h6>
                </div>
              </div>
              <div className='col-3 d-flex flex-column justify-content-end'>
                <div
                  className='d-flex flex-column align-items-center p-24 pt-16 rounded-top-4 bg-tb-primary'
                  style={{ minHeight: "82%" }}
                >
                  <span className='w-40-px h-40-px d-flex flex-shrink-0 justify-content-center align-items-center bg-primary-600 rounded-circle mb-12'>
                    <img
                      src='/assets/images/home-nine/source-icon3.png'
                      alt=''
                    />
                  </span>
                  <span className='text-secondary-light'>{t("facebook")}</span>
                  <h6 className='mb-0'>82%</h6>
                </div>
              </div>
              <div className='col-3 d-flex flex-column justify-content-end'>
                <div
                  className='d-flex flex-column align-items-center p-24 pt-16 rounded-top-4 bg-tb-success'
                  style={{ minHeight: "96%" }}
                >
                  <span className='w-40-px h-40-px d-flex flex-shrink-0 justify-content-center align-items-center bg-success-600 rounded-circle mb-12'>
                    <img
                      src='/assets/images/home-nine/source-icon4.png'
                      alt=''
                    />
                  </span>
                  <span className='text-secondary-light'>{t("website")}</span>
                  <h6 className='mb-0'>96%</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceVisitors;
