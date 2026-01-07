import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

const LatestAppointmentsOne = () => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  return (
    <div className='col-xxl-8'>
      <div className='card h-100'>
        <div className='card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between'>
          <h6 className='text-lg fw-semibold mb-0'>{t("latest_appointments")}</h6>
          <Link
            href='#'
            className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
          >
            {tCommon("view_all")}
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
                    {tCommon("name")}
                  </th>
                  <th scope='col' className='bg-transparent rounded-0'>
                    ID
                  </th>
                  <th scope='col' className='bg-transparent rounded-0'>
                    {tCommon("date")}
                  </th>
                  <th scope='col' className='bg-transparent rounded-0'>
                    {tCommon("status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("general_checkup")}</td>
                  <td>#63254</td>
                  <td>27 Mar 2024</td>
                  <td>
                    {" "}
                    <span className='bg-success-focus text-success-main px-10 py-4 radius-8 fw-medium text-sm'>
                      {t("completed")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>{t("blood_test_results")} </td>
                  <td>3.053 ETH</td>
                  <td>2h 5m 40s</td>
                  <td>
                    {" "}
                    <span className='bg-danger-focus text-danger-main px-10 py-4 radius-8 fw-medium text-sm'>
                      {t("canceled")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>{t("heart_checkup")}</td>
                  <td>3.053 ETH</td>
                  <td>2h 5m 40s</td>
                  <td>
                    {" "}
                    <span className='bg-success-focus text-success-main px-10 py-4 radius-8 fw-medium text-sm'>
                      {t("completed")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>{t("vaccination")}</td>
                  <td>3.053 ETH</td>
                  <td>2h 5m 40s</td>
                  <td>
                    {" "}
                    <span className='bg-danger-focus text-danger-main px-10 py-4 radius-8 fw-medium text-sm'>
                      {t("canceled")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>{t("dental_cleanup")}</td>
                  <td>3.053 ETH</td>
                  <td>2h 5m 40s</td>
                  <td>
                    {" "}
                    <span className='bg-success-focus text-success-main px-10 py-4 radius-8 fw-medium text-sm'>
                      {t("completed")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>{t("follow_up_appointment")} </td>
                  <td>3.053 ETH</td>
                  <td>2h 5m 40s</td>
                  <td>
                    {" "}
                    <span className='bg-danger-focus text-danger-main px-10 py-4 radius-8 fw-medium text-sm'>
                      {t("canceled")}
                    </span>
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

export default LatestAppointmentsOne;
