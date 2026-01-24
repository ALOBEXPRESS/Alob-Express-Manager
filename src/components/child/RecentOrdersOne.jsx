"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRecentOrders } from "@/features/ecommerce/hooks/useRecentOrders";

const RecentOrdersOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [showAll, setShowAll] = useState(false);
  const limit = showAll ? 18 : 6;
  const { orders } = useRecentOrders(limit);

  const statusClassMap = {
    pending: "bg-warning-focus text-warning-main",
    paid: "bg-success-focus text-success-main",
    cancelled: "bg-danger-focus text-danger-main",
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);

  const displayData = orders.map((order) => {
    const customerName = [order.customers?.first_name, order.customers?.last_name]
      .filter(Boolean)
      .join(" ");
    const itemsQty = (order.order_items || []).reduce(
      (acc, item) => acc + (item.quantity || 0),
      0
    );
    return {
      user: {
        name: customerName || tCommon("users"),
        image: "/assets/images/avatar/avatar1.png",
      },
      invoice: order.order_number,
      item: "items",
      qty: itemsQty,
      amount: formatCurrency(order.total_amount),
      status: order.status || "pending",
      statusClass: statusClassMap[order.status] || statusClassMap.pending,
    };
  });

  const handleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-9 col-lg-6'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t('recent_orders')}</h6>
            <button
              type='button'
              onClick={handleViewAll}
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {showAll ? tCommon('show_less') : tCommon('view_all')}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </button>
          </div>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0'>
              <thead>
                <tr>
                  <th scope='col'>{tCommon('users')}</th>
                  <th scope='col'>{t('invoice')}</th>
                  <th scope='col'>{t('items')}</th>
                  <th scope='col'>{t('qty')}</th>
                  <th scope='col'>{t('amount')}</th>
                  <th scope='col' className='text-center'>
                    {tCommon('status')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((order, index) => (
                  <tr key={order.invoice || index}>
                    <td>
                      <div className='d-flex align-items-center'>
                        <img
                          src={order.user.image}
                          alt=''
                          className='flex-shrink-0 me-12 radius-8'
                        />
                        <span className='text-lg text-secondary-light fw-semibold flex-grow-1'>
                          {order.user.name}
                        </span>
                      </div>
                    </td>
                    <td>{order.invoice}</td>
                    <td>{t(order.item)}</td>
                    <td>{order.qty}</td>
                    <td>{order.amount}</td>
                    <td className='text-center'>
                      {" "}
                      <span className={`px-24 py-4 rounded-pill fw-medium text-sm ${order.statusClass}`}>
                        {t(order.status)}
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

export default RecentOrdersOne;
