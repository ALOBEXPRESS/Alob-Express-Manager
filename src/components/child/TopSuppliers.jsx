import Link from "next/link";
import { useTranslations } from "next-intl";

const TopSuppliers = () => {
  const t = useTranslations("dashboard");
  return (
    <div className='col-xxl-4 col-md-6'>
      <div className='card h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("top_suppliers")}</h6>
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
        <div className='card-body p-24'>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0'>
              <thead>
                <tr>
                  <th scope='col'>{t("sl")}</th>
                  <th scope='col'>{t("name")} </th>
                  <th scope='col'>{t("amount")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className='text-secondary-light'>1</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Esther Howard</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$30,00.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>2</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Wade Warren</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$40,00.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>3</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Jenny Wilson</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$50,00.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>4</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Kristin Watson</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$60,00.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>5</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Eleanor Pena</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$70,00.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>6</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>
                      Darlene Robertson
                    </span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$80,00.00</span>
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

export default TopSuppliers;
