import Link from "next/link";
import { useTranslations } from "next-intl";

const PaymentHistoryOne = () => {
  const t = useTranslations("dashboard");
  return (
    <div className='card radius-16 mt-24'>
      <div className='card-header'>
        <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
          <h6 className='mb-2 fw-bold text-lg mb-0'>{t("payment_history")}</h6>
          <Link
            href='/invoice-list'
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
        <div className='table-responsive scroll-sm'>
          <table className='table bordered-table sm-table mb-0'>
            <thead>
              <tr>
                <th scope='col'>{t("users")} </th>
                <th scope='col' className='text-center'>
                  {t("email")}
                </th>
                <th scope='col' className='text-center'>
                  {t("transaction_id")}
                </th>
                <th scope='col' className='text-center'>
                  {t("amount")}
                </th>
                <th scope='col' className='text-center'>
                  {t("payment_method")}
                </th>
                <th scope='col' className='text-center'>
                  {t("date")}
                </th>
                <th scope='col' className='text-center'>
                  {t("status")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className=''>
                  <div className='d-flex align-items-center'>
                    <img
                      src='/assets/images/users/user1.png'
                      alt=''
                      className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                    />
                    <div className='flex-grow-1'>
                      <h6 className='text-md mb-0 fw-medium'>Dianne Russell</h6>
                    </div>
                  </div>
                </td>
                <td className='text-center'>osgoodwy@gmail.com</td>
                <td className='text-center'>9562415412263</td>
                <td className='text-center'>$29.00</td>
                <td className='text-center'>{t("bank")}</td>
                <td className='text-center'>24 Jun 2024</td>
                <td className='text-center'>
                  <span className='bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm'>
                    {t("active")}
                  </span>
                </td>
              </tr>
              <tr>
                <td className=''>
                  <div className='d-flex align-items-center'>
                    <img
                      src='/assets/images/users/user2.png'
                      alt=''
                      className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                    />
                    <div className='flex-grow-1'>
                      <h6 className='text-md mb-0 fw-medium'>Wade Warren</h6>
                    </div>
                  </div>
                </td>
                <td className='text-center'>redaniel@gmail.com</td>
                <td className='text-center'>9562415412263</td>
                <td className='text-center'>$29.00</td>
                <td className='text-center'>{t("bank")}</td>
                <td className='text-center'>24 Jun 2024</td>
                <td className='text-center'>
                  <span className='bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm'>
                    {t("active")}
                  </span>
                </td>
              </tr>
              <tr>
                <td className=''>
                  <div className='d-flex align-items-center'>
                    <img
                      src='/assets/images/users/user3.png'
                      alt=''
                      className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                    />
                    <div className='flex-grow-1'>
                      <h6 className='text-md mb-0 fw-medium'>Albert Flores</h6>
                    </div>
                  </div>
                </td>
                <td className='text-center'>seema@gmail.com</td>
                <td className='text-center'>9562415412263</td>
                <td className='text-center'>$29.00</td>
                <td className='text-center'>Bank</td>
                <td className='text-center'>24 Jun 2024</td>
                <td className='text-center'>
                  <span className='bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm'>
                    {t("active")}
                  </span>
                </td>
              </tr>
              <tr>
                <td className=''>
                  <div className='d-flex align-items-center'>
                    <img
                      src='/assets/images/users/user4.png'
                      alt=''
                      className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                    />
                    <div className='flex-grow-1'>
                      <h6 className='text-md mb-0 fw-medium'>Bessie Cooper </h6>
                    </div>
                  </div>
                </td>
                <td className='text-center'>hamli@gmail.com</td>
                <td className='text-center'>9562415412263</td>
                <td className='text-center'>$29.00</td>
                <td className='text-center'>Bank</td>
                <td className='text-center'>24 Jun 2024</td>
                <td className='text-center'>
                  <span className='bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm'>
                    {t("active")}
                  </span>
                </td>
              </tr>
              <tr>
                <td className=''>
                  <div className='d-flex align-items-center'>
                    <img
                      src='/assets/images/users/user5.png'
                      alt=''
                      className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                    />
                    <div className='flex-grow-1'>
                      <h6 className='text-md mb-0 fw-medium'>Arlene McCoy</h6>
                    </div>
                  </div>
                </td>
                <td className='text-center'>zitka@mail.ru</td>
                <td className='text-center'>9562415412263</td>
                <td className='text-center'>$29.00</td>
                <td className='text-center'>Bank</td>
                <td className='text-center'>24 Jun 2024</td>
                <td className='text-center'>
                  <span className='bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm'>
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryOne;
