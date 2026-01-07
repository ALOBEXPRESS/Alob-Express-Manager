import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const LatestInvestmentsOne = () => {
  const t = useTranslations("dashboard");
  return (
    <div className='col-xxl-6'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("latest_investments")}</h6>
            <Link
              href='#'
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {t("view_all")}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </Link>
          </div>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table sm-table mb-0'>
              <thead>
                <tr>
                  <th scope='col'>{t("asset")}</th>
                  <th scope='col'>{t("quantity")}</th>
                  <th scope='col'>{t("price")} </th>
                  <th scope='col'>{t("date")}</th>
                  <th scope='col' className='text-center'>
                    {t("total_orders")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src='/assets/images/asset/asset-img1.png'
                        alt=''
                        className='flex-shrink-0 me-12 w-40-px h-40-px radius-8 me-12'
                      />
                      <div className='flex-grow-1'>
                        <h6 className='text-md mb-0 fw-normal'>{t("gold")}</h6>
                        <span className='text-sm text-secondary-light fw-normal'>
                          {t("main_asset")}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <h6 className='text-md mb-0 fw-normal'>7500</h6>
                    <span className='text-sm text-secondary-light fw-normal'>
                      {t("ounces")}
                    </span>
                  </td>
                  <td>$7,500.00</td>
                  <td>25 May 2024</td>
                  <td className='text-center'>
                    <span className='bg-success-focus text-success-main px-16 py-4 radius-8 fw-medium text-sm'>
                      {t("completed")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src='/assets/images/asset/asset-img2.png'
                        alt=''
                        className='flex-shrink-0 me-12 w-40-px h-40-px radius-8 me-12'
                      />
                      <div className='flex-grow-1'>
                        <h6 className='text-md mb-0 fw-normal'>{t("dollars")}</h6>
                        <span className='text-sm text-secondary-light fw-normal'>
                          {t("currency")}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <h6 className='text-md mb-0 fw-normal'>5,40,000</h6>
                    <span className='text-sm text-secondary-light fw-normal'>
                      {t("dollars")}
                    </span>
                  </td>
                  <td>$5,40,000.00</td>
                  <td>25 May 2024</td>
                  <td className='text-center'>
                    <span className='bg-warning-focus text-warning-main px-16 py-4 radius-8 fw-medium text-sm'>
                      {t("in_progress")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src='/assets/images/asset/asset-img3.png'
                        alt=''
                        className='flex-shrink-0 me-12 w-40-px h-40-px radius-8 me-12'
                      />
                      <div className='flex-grow-1'>
                        <h6 className='text-md mb-0 fw-normal'>{t("stock_market")}</h6>
                        <span className='text-sm text-secondary-light fw-normal'>
                          {t("product")}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <h6 className='text-md mb-0 fw-normal'>1500</h6>
                    <span className='text-sm text-secondary-light fw-normal'>
                      {t("products")}
                    </span>
                  </td>
                  <td>$50,000.00</td>
                  <td>25 May 2024</td>
                  <td className='text-center'>
                    <span className='bg-success-focus text-success-main px-16 py-4 radius-8 fw-medium text-sm'>
                      {t("completed")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src='/assets/images/asset/asset-img4.png'
                        alt=''
                        className='flex-shrink-0 me-12 w-40-px h-40-px radius-8 me-12'
                      />
                      <div className='flex-grow-1'>
                        <h6 className='text-md mb-0 fw-normal'>{t("diamond")}</h6>
                        <span className='text-sm text-secondary-light fw-normal'>
                          {t("asset")}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <h6 className='text-md mb-0 fw-normal'>350</h6>
                    <span className='text-sm text-secondary-light fw-normal'>
                      {t("ounces")}
                    </span>
                  </td>
                  <td>$30,000.00</td>
                  <td>25 May 2024</td>
                  <td className='text-center'>
                    <span className='bg-warning-focus text-warning-main px-16 py-4 radius-8 fw-medium text-sm'>
                      {t("in_progress")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src='/assets/images/asset/asset-img5.png'
                        alt=''
                        className='flex-shrink-0 me-12 w-40-px h-40-px radius-8 me-12'
                      />
                      <div className='flex-grow-1'>
                        <h6 className='text-md mb-0 fw-normal'>{t("sp500")}</h6>
                        <span className='text-sm text-secondary-light fw-normal'>
                          {t("index")}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <h6 className='text-md mb-0 fw-normal'>24,000</h6>
                    <span className='text-sm text-secondary-light fw-normal'>
                      {t("shares")}
                    </span>
                  </td>
                  <td>$63,000.00</td>
                  <td>25 May 2024</td>
                  <td className='text-center'>
                    <span className='bg-success-focus text-success-main px-16 py-4 radius-8 fw-medium text-sm'>
                      {t("completed")}
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

export default LatestInvestmentsOne;
