import { useTranslations } from "next-intl";

const ProjectStatusOne = () => {
  const t = useTranslations("dashboard");
  return (
    <div className='col-xxl-4'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg'>{t("project_status")}</h6>
            <div className=''>
              <select
                className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                defaultValue='Yearly'
              >
                <option value='Yearly'>{t("yearly")}</option>
                <option value='Monthly'>{t("monthly")}</option>
                <option value='Weekly'>{t("weekly")}</option>
                <option value='Today'>{t("today")}</option>
              </select>
            </div>
          </div>
          <div className='table-responsive scroll-sm'>
            <table className='table sm-table bordered-table mb-0'>
              <thead>
                <tr>
                  <th scope='col'>{t("name")}</th>
                  <th scope='col'>{t("duration")}</th>
                  <th scope='col'>
                    <div className='max-w-112 mx-auto'>
                      <span>{t("stock")}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("gold")}</td>
                  <td>2 {t("months")}</td>
                  <td>
                    <div className='max-w-112 mx-auto'>
                      <div className='w-100'>
                        <div
                          className='progress progress-sm rounded-pill'
                          role='progressbar'
                          aria-label='Success example'
                          aria-valuenow={25}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className='progress-bar bg-red rounded-pill'
                            style={{ width: "0%" }}
                          />
                        </div>
                      </div>
                      <span className='mt-8 text-secondary-light text-sm fw-medium'>
                        0%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>{t("dollars")}</td>
                  <td>3 {t("months")}</td>
                  <td>
                    <div className='max-w-112 mx-auto'>
                      <div className='w-100'>
                        <div
                          className='progress progress-sm rounded-pill'
                          role='progressbar'
                          aria-label='Success example'
                          aria-valuenow={0}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className='progress-bar bg-warning-main rounded-pill'
                            style={{ width: "0%" }}
                          />
                        </div>
                      </div>
                      <span className='mt-8 text-secondary-light text-sm fw-medium'>
                        0%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>{t("stock_market")}</td>
                  <td>1 {t("months")}</td>
                  <td>
                    <div className='max-w-112 mx-auto'>
                      <div className='w-100'>
                        <div
                          className='progress progress-sm rounded-pill'
                          role='progressbar'
                          aria-label='Success example'
                          aria-valuenow={0}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className='progress-bar bg-info-main rounded-pill'
                            style={{ width: "0%" }}
                          />
                        </div>
                      </div>
                      <span className='mt-8 text-secondary-light text-sm fw-medium'>
                        0%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>{t("diamond")}</td>
                  <td>5 {t("months")}</td>
                  <td>
                    <div className='max-w-112 mx-auto'>
                      <div className='w-100'>
                        <div
                          className='progress progress-sm rounded-pill'
                          role='progressbar'
                          aria-label='Success example'
                          aria-valuenow={0}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className='progress-bar bg-success-main rounded-pill'
                            style={{ width: "0%" }}
                          />
                        </div>
                      </div>
                      <span className='mt-8 text-secondary-light text-sm fw-medium'>
                        0%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>{t("sp500")}</td>
                  <td>4 {t("months")}</td>
                  <td>
                    <div className='max-w-112 mx-auto'>
                      <div className='w-100'>
                        <div
                          className='progress progress-sm rounded-pill'
                          role='progressbar'
                          aria-label='Success example'
                          aria-valuenow={0}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className='progress-bar bg-red rounded-pill'
                            style={{ width: "0%" }}
                          />
                        </div>
                      </div>
                      <span className='mt-8 text-secondary-light text-sm fw-medium'>
                        0%
                      </span>
                    </div>
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

export default ProjectStatusOne;
