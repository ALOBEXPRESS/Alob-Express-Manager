"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useTopProducts } from "@/features/ecommerce/hooks/useTopProducts";

const TopSellingProductOne = () => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [showAll, setShowAll] = useState(false);
  const limit = showAll ? 12 : 6;
  const { products } = useTopProducts(limit);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);

  const displayData = products.map((entry) => ({
    id: entry.product?.id,
    img: "/assets/images/product/product-img1.png",
    name: entry.product?.name || t("items"),
    category: "products",
    price: formatCurrency(entry.product?.price),
    discount: "0%",
    sold: entry.sold || 0,
    totalOrders: entry.totalOrders || 0,
  }));

  const handleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-6'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("top_selling_product")}</h6>
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
                  <th scope='col'>{t("discount")} </th>
                  <th scope='col'>{t("sold")}</th>
                  <th scope='col' className='text-center'>
                    {t("total_orders")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((product, index) => (
                  <tr key={product.id || index}>
                    <td>
                      <div className='d-flex align-items-center'>
                        <img
                          src={product.img}
                          alt=''
                          className='flex-shrink-0 me-12 radius-8 me-12'
                        />
                        <div className='flex-grow-1'>
                          <h6 className='text-md mb-0 fw-normal'>{t(product.name)}</h6>
                          <span className='text-sm text-secondary-light fw-normal'>
                            {t(product.category)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{product.price}</td>
                    <td>{product.discount}</td>
                    <td>{product.sold}</td>
                    <td className='text-center'>
                      <span className='bg-success-focus text-success-main px-32 py-4 rounded-pill fw-medium text-sm'>
                        {product.totalOrders}
                      </span>
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

export default TopSellingProductOne;
