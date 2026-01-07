import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

const RecentActivityOne = () => {
  const t = useTranslations("dashboard");
  return (
    <div className='col-xxl-8'>
      <div className='card h-100'>
        <div className='card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between'>
          <h6 className='text-lg fw-semibold mb-0'>{t("recent_activity")}</h6>
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
        <div className='card-body p-0'>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0 rounded-0 border-0'>
              <thead>
                <tr>
                  <th scope='col' className='bg-transparent rounded-0'>
                    {t("customer")}
                  </th>
                  <th scope='col' className='bg-transparent rounded-0'>
                    ID
                  </th>
                  <th scope='col' className='bg-transparent rounded-0'>
                    {t("retained")}
                  </th>
                  <th scope='col' className='bg-transparent rounded-0'>
                    {t("amount")}
                  </th>
                  <th scope='col' className='bg-transparent rounded-0'>
                    {t("status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src='/assets/images/user-grid/user-grid-img1.png'
                        alt=''
                        className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                      />
                      <div className='flex-grow-1'>
                        <h6 className='text-md mb-0'>Kristin Watson</h6>
                        <span className='text-sm text-secondary-light fw-medium'>
                          ulfaha@mail.ru
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>#63254</td>
                  <td>{t("min_ago", { count: 5 })}</td>
                  <td>$12,408.12</td>
                  <td>
                    {" "}
                    <span className='bg-success-focus text-success-main px-10 py-4 radius-8 fw-medium text-sm'>
                      {t("member")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src='/assets/images/user-grid/user-grid-img2.png'
                        alt=''
                        className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                      />
                      <div className='flex-grow-1'>
                        <h6 className='text-md mb-0'>Theresa Webb</h6>
                        <span className='text-sm text-secondary-light fw-medium'>
                          joie@gmail.com
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>#63254</td>
                  <td>{t("min_ago", { count: 12 })}</td>
                  <td>$12,408.12</td>
                  <td>
                    {" "}
                    <span className='bg-lilac-100 text-lilac-600 px-10 py-4 radius-8 fw-medium text-sm'>
                      {t("new_customer")}
                    </span>{" "}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src='/assets/images/user-grid/user-grid-img3.png'
                        alt=''
                        className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                      />
                      <div className='flex-grow-1'>
                        <h6 className='text-md mb-0'>Brooklyn Simmons</h6>
                        <span className='text-sm text-secondary-light fw-medium'>
                          warn@mail.ru
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>#63254</td>
                  <td>{t("min_ago", { count: 15 })}</td>
                  <td>$12,408.12</td>
                  <td>
                    {" "}
                    <span className='bg-warning-focus text-warning-main px-10 py-4 radius-8 fw-medium text-sm'>
                      {t("signed_up")}{" "}
                    </span>{" "}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src='/assets/images/user-grid/user-grid-img4.png'
                        alt=''
                        className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                      />
                      <div className='flex-grow-1'>
                        <h6 className='text-md mb-0'>Robert Fox</h6>
                        <span className='text-sm text-secondary-light fw-medium'>
                          fellora@mail.ru
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>#63254</td>
                  <td>{t("min_ago", { count: 17 })}</td>
                  <td>$12,408.12</td>
                  <td>
                    {" "}
                    <span className='bg-success-focus text-success-main px-10 py-4 radius-8 fw-medium text-sm'>
                      {t("member")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src='/assets/images/user-grid/user-grid-img5.png'
                        alt=''
                        className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                      />
                      <div className='flex-grow-1'>
                        <h6 className='text-md mb-0'>Jane Cooper</h6>
                        <span className='text-sm text-secondary-light fw-medium'>
                          zitka@mail.ru
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>#63254</td>
                  <td>{t("min_ago", { count: 25 })}</td>
                  <td>$12,408.12</td>
                  <td>
                    {" "}
                    <span className='bg-warning-focus text-warning-main px-10 py-4 radius-8 fw-medium text-sm'>
                      {t("signed_up")}{" "}
                    </span>{" "}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityOne;
