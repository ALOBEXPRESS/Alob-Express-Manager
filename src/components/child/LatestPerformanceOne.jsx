"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const LatestPerformanceOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [showAll, setShowAll] = useState(false);

  const toDoData = [
    { name: 'hotel_management_system', id: '#5632', assigned: 'Kathryn Murphy', date: '27 Mar 2024', status: 'active', statusClass: 'bg-success-focus text-success-main' },
    { name: 'hotel_management_system', id: '#5633', assigned: 'Darlene Robertson', date: '27 Mar 2024', status: 'active', statusClass: 'bg-success-focus text-success-main' },
    { name: 'hotel_management_system', id: '#5634', assigned: 'Courtney Henry', date: '27 Mar 2024', status: 'active', statusClass: 'bg-success-focus text-success-main' },
    { name: 'hotel_management_system', id: '#5635', assigned: 'Jenny Wilson', date: '27 Mar 2024', status: 'active', statusClass: 'bg-success-focus text-success-main' },
    { name: 'hotel_management_system', id: '#5636', assigned: 'Leslie Alexander', date: '27 Mar 2024', status: 'active', statusClass: 'bg-success-focus text-success-main' }
  ];

  const recentLeadsData = [
    { name: 'hotel_management_system', id: '#5632', assigned: 'Kathryn Murphy', date: '27 Mar 2024', status: 'active', statusClass: 'bg-success-focus text-success-main' },
    { name: 'hotel_management_system', id: '#5633', assigned: 'Darlene Robertson', date: '27 Mar 2024', status: 'active', statusClass: 'bg-success-focus text-success-main' },
    { name: 'hotel_management_system', id: '#5634', assigned: 'Courtney Henry', date: '27 Mar 2024', status: 'active', statusClass: 'bg-success-focus text-success-main' },
    { name: 'hotel_management_system', id: '#5635', assigned: 'Jenny Wilson', date: '27 Mar 2024', status: 'active', statusClass: 'bg-success-focus text-success-main' },
    { name: 'hotel_management_system', id: '#5636', assigned: 'Leslie Alexander', date: '27 Mar 2024', status: 'active', statusClass: 'bg-success-focus text-success-main' }
  ];

  const displayToDo = showAll ? [...toDoData, ...toDoData] : toDoData;
  const displayRecent = showAll ? [...recentLeadsData, ...recentLeadsData] : recentLeadsData;

  const handleViewAll = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  const renderTableRows = (data) => (
    data.map((item, index) => (
      <tr key={index}>
        <td>
          <div>
            <span className='text-md d-block line-height-1 fw-medium text-primary-light text-w-200-px'>
              {t(item.name)}
            </span>
            <span className='text-sm d-block fw-normal text-secondary-light'>
              {item.id}
            </span>
          </div>
        </td>
        <td>{item.assigned}</td>
        <td>{item.date}</td>
        <td>
          <span className={`${item.statusClass} px-24 py-4 rounded-pill fw-medium text-sm`}>
            {t(item.status)}
          </span>
        </td>
        <td className='text-center text-neutral-700 text-xl'>
          <div className='dropdown'>
            <button
              type='button'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              <Icon
                icon='ph:dots-three-outline-vertical-fill'
                className='icon'
              />
            </button>
            <ul className='dropdown-menu p-12 border bg-base shadow'>
              <li>
                <Link
                  className='dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900'
                  href='#'
                >
                  Action
                </Link>
              </li>
              <li>
                <Link
                  className='dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900'
                  href='#'
                >
                  Another action
                </Link>
              </li>
              <li>
                <Link
                  className='dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900'
                  href='#'
                >
                  Something else here
                </Link>
              </li>
            </ul>
          </div>
        </td>
      </tr>
    ))
  );

  return (
    <div className='col-xxl-6'>
      <div className='card h-100'>
        <div className='card-header border-bottom bg-base ps-0 py-0 pe-24 d-flex align-items-center justify-content-between'>
          <ul
            className='nav bordered-tab nav-pills mb-0'
            id='pills-tab'
            role='tablist'
          >
            <li className='nav-item' role='presentation'>
              <button
                className='nav-link active'
                id='pills-to-do-list-tab'
                data-bs-toggle='pill'
                data-bs-target='#pills-to-do-list'
                type='button'
                role='tab'
                aria-controls='pills-to-do-list'
                aria-selected='true'
              >
                {t('all_item')}
              </button>
            </li>
            <li className='nav-item' role='presentation'>
              <button
                className='nav-link'
                id='pills-recent-leads-tab'
                data-bs-toggle='pill'
                data-bs-target='#pills-recent-leads'
                type='button'
                role='tab'
                aria-controls='pills-recent-leads'
                aria-selected='false'
                tabIndex={-1}
              >
                {t('best_match')}
              </button>
            </li>
          </ul>
          <Link
            href='#'
            onClick={handleViewAll}
            className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
          >
            {tCommon('view_all')}
            <Icon icon='solar:alt-arrow-right-linear' className='icon' />
          </Link>
        </div>
        <div className='card-body p-24'>
          <div className='tab-content' id='pills-tabContent'>
            <div
              className='tab-pane fade show active'
              id='pills-to-do-list'
              role='tabpanel'
              aria-labelledby='pills-to-do-list-tab'
              tabIndex={0}
            >
              <div className='table-responsive scroll-sm'>
                <table className='table bordered-table mb-0'>
                  <thead>
                    <tr>
                      <th scope='col'>{t('task_name')} </th>
                      <th scope='col'>{t('assigned_to')} </th>
                      <th scope='col'>{t('due_date')}</th>
                      <th scope='col'>{tCommon('status')}</th>
                      <th scope='col'>{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTableRows(displayToDo)}
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className='tab-pane fade'
              id='pills-recent-leads'
              role='tabpanel'
              aria-labelledby='pills-recent-leads-tab'
              tabIndex={0}
            >
              <div className='table-responsive scroll-sm'>
                <table className='table bordered-table mb-0'>
                  <thead>
                    <tr>
                      <th scope='col'>{t('task_name')} </th>
                      <th scope='col'>{t('assigned_to')} </th>
                      <th scope='col'>{t('due_date')}</th>
                      <th scope='col'>{tCommon('status')}</th>
                      <th scope='col'>{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTableRows(displayRecent)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestPerformanceOne;
