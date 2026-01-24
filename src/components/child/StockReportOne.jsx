"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useStockReport } from "@/features/ecommerce/hooks/useStockReport";

const StockReportOne = () => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [showAll, setShowAll] = useState(false);
  const limit = showAll ? 12 : 6;
  const { items } = useStockReport(limit);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);

  const maxStock = Math.max(1, ...items.map((item) => item.stock_quantity || 0));
  const displayData = items.map((item) => {
    const percentage = Math.round(((item.stock_quantity || 0) / maxStock) * 100);
    const color =
      percentage <= 25
        ? "bg-danger-main"
        : percentage <= 60
        ? "bg-warning-main"
        : "bg-success-main";
    return {
      id: item.id,
      name: item.name,
      price: formatCurrency(item.price),
      stock: item.stock_quantity || 0,
      width: `${percentage}%`,
      color,
      status: (item.stock_quantity || 0) > 0 ? "in_stock" : "out_stock",
    };
  });

  const handleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-6'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("stock_report")}</h6>
            <button
              type='button'
              onClick={handleViewAll}
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {showAll ? tCommon("show_less") : tCommon("view_all")}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </button>
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
                  <tr key={item.id || index}>
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
