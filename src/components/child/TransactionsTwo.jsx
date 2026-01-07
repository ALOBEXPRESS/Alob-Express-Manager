import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

const TransactionsTwo = () => {
  const t = useTranslations("dashboard");
  return (
    <div className='col-xxl-4'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg'>{t("transactions")}</h6>
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
          <div className='mt-32'>
            <div className='d-flex align-items-center justify-content-between gap-3 mb-24'>
              <div className='d-flex align-items-center gap-3'>
                <div className='w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-success-200 flex-shrink-0'>
                  <img
                    src='/assets/images/home-nine/payment1.png'
                    alt=''
                    className=''
                  />
                </div>
                <div className='flex-grow-1'>
                  <h6 className='text-md mb-0 fw-normal'>{t("wallet")}</h6>
                  <span className='text-sm text-secondary-light fw-normal'>
                    {t("payment")}
                  </span>
                </div>
              </div>
              <span className='text-secondary-light text-md fw-medium'>
                +$6200
              </span>
            </div>
            <div className='d-flex align-items-center justify-content-between gap-3 mb-24'>
              <div className='d-flex align-items-center gap-3'>
                <div className='w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-info-200 flex-shrink-0'>
                  <img
                    src='/assets/images/home-nine/payment2.png'
                    alt=''
                    className=''
                  />
                </div>
                <div className='flex-grow-1'>
                  <h6 className='text-md mb-0 fw-normal'>PayPal</h6>
                  <span className='text-sm text-secondary-light fw-normal'>
                    {t("payment")}
                  </span>
                </div>
              </div>
              <span className='text-secondary-light text-md fw-medium'>
                +$6200
              </span>
            </div>
            <div className='d-flex align-items-center justify-content-between gap-3 mb-24'>
              <div className='d-flex align-items-center gap-3'>
                <div className='w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-warning-200 flex-shrink-0'>
                  <img
                    src='/assets/images/home-nine/payment3.png'
                    alt=''
                    className=''
                  />
                </div>
                <div className='flex-grow-1'>
                  <h6 className='text-md mb-0 fw-normal'>Credit Card </h6>
                  <span className='text-sm text-secondary-light fw-normal'>
                    {t("bill_payment")}
                  </span>
                </div>
              </div>
              <span className='text-secondary-light text-md fw-medium'>
                -$6200
              </span>
            </div>
            <div className='d-flex align-items-center justify-content-between gap-3 mb-0'>
              <div className='d-flex align-items-center gap-3'>
                <div className='w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-lilac-200 flex-shrink-0'>
                  <img
                    src='/assets/images/home-nine/payment4.png'
                    alt=''
                    className=''
                  />
                </div>
                <div className='flex-grow-1'>
                  <h6 className='text-md mb-0 fw-normal'>Bank</h6>
                  <span className='text-sm text-secondary-light fw-normal'>
                    {t("bill_payment")}
                  </span>
                </div>
              </div>
              <span className='text-secondary-light text-md fw-medium'>
                +$6200
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTwo;
