"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

const StockReportOne = () => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [showAll, setShowAll] = useState(false);

  const initialData = [
    { name: 'Nike Air Shoes', price: '$500.00', stock: 25, status: 'out_of_stock', color: 'bg-primary-600', width: '0%', textClass: 'text-secondary-light' },
    { name: 'Nike Air Shoes', price: '$300.00', stock: 18, status: 'low_stock', color: 'bg-danger-main', width: '40%', textClass: 'text-secondary-light' },
    { name: 'Nike Air Shoes', price: '$500.00', stock: 80, status: 'high_stock', color: 'bg-success-main', width: '80%', textClass: 'text-secondary-light' },
    { name: 'Nike Air Shoes', price: '$300.00', stock: 50, status: 'high_stock', color: 'bg-success-main', width: '50%', textClass: 'text-secondary-light' },
    { name: 'Nike Air Shoes', price: '$150.00', stock: 70, status: 'high_stock', color: 'bg-success-main', width: '70%', textClass: 'text-secondary-light' }
  ];

  const displayData = showAll 
    ? [...initialData, ...initialData] 
    : initialData;

  const handleViewAll = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-6'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("stock_report")}</h6>
            <Link
              href='#'
              onClick={handleViewAll}
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {showAll ? tCommon("show_less") : tCommon("view_all")}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </Link>
          </div>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0'>
              <thead>
                <tr>
                  <th scope='col'>{t("items")}</th>
                  <th scope='col'>{t("price")}</th>
                  <th scope='col'>
                    <div className='max-w-112 mx-auto'>
                      <span>{t("stock")}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
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
                              className={`progress-bar ${item.color} rounded-pill`}
                              style={{ width: item.width }}
                            />
                          </div>
                        </div>
                        <span className={`mt-12 text-secondary-light text-sm fw-medium`}>
                          {item.stock > 0 ? `${item.stock} ` : ''}{t(item.status)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReportOne;
