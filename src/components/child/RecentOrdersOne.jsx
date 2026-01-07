"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const RecentOrdersOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [showAll, setShowAll] = useState(false);

  const initialData = [
    {
      user: {
        name: 'Dianne Russell',
        image: '/assets/images/users/user1.png'
      },
      invoice: '#6352148',
      item: 'iphone_14_max',
      qty: 2,
      amount: '$5,000.00',
      status: 'paid',
      statusClass: 'bg-success-focus text-success-main'
    },
    {
      user: {
        name: 'Wade Warren',
        image: '/assets/images/users/user2.png'
      },
      invoice: '#6352148',
      item: 'laptop_hph',
      qty: 3,
      amount: '$1,000.00',
      status: 'pending',
      statusClass: 'bg-warning-focus text-warning-main'
    },
    {
      user: {
        name: 'Albert Flores',
        image: '/assets/images/users/user3.png'
      },
      invoice: '#6352148',
      item: 'smart_watch',
      qty: 7,
      amount: '$1,000.00',
      status: 'shipped',
      statusClass: 'bg-info-focus text-info-main'
    },
    {
      user: {
        name: 'Bessie Cooper',
        image: '/assets/images/users/user4.png'
      },
      invoice: '#6352148',
      item: 'nike_air_shoe',
      qty: 1,
      amount: '$3,000.00',
      status: 'canceled',
      statusClass: 'bg-danger-focus text-danger-main'
    },
    {
      user: {
        name: 'Arlene McCoy',
        image: '/assets/images/users/user5.png'
      },
      invoice: '#6352148',
      item: 'new_headphone',
      qty: 5,
      amount: '$4,000.00',
      status: 'canceled',
      statusClass: 'bg-danger-focus text-danger-main'
    }
  ];

  const displayData = showAll 
    ? [...initialData, ...initialData, ...initialData] 
    : initialData;

  const handleViewAll = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-9 col-lg-6'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t('recent_orders')}</h6>
            <Link
              href='#'
              onClick={handleViewAll}
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {showAll ? tCommon('show_less') : tCommon('view_all')}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </Link>
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
                  <tr key={index}>
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
