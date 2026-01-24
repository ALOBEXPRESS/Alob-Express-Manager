"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const LatestRegisteredOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [showAll, setShowAll] = useState(false);

  const initialData = [];

  // If showAll is true, duplicate data to simulate more users
  const displayData = showAll 
    ? [...initialData, ...initialData, ...initialData] 
    : initialData;

  const handleViewAll = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-9 col-xl-12'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex flex-wrap align-items-center gap-1 justify-content-between mb-16'>
            <ul
              className='nav border-gradient-tab nav-pills mb-0'
              id='pills-tab'
              role='tablist'
            >
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link d-flex align-items-center active'
                  id='pills-to-do-list-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-to-do-list'
                  type='button'
                  role='tab'
                  aria-controls='pills-to-do-list'
                  aria-selected='true'
                >
                  {t('latest_registered')}
                  <span className='text-sm fw-semibold py-6 px-12 bg-neutral-500 rounded-pill text-white line-height-1 ms-12 notification-alert'>
                    {displayData.length}
                  </span>
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link d-flex align-items-center'
                  id='pills-recent-leads-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-recent-leads'
                  type='button'
                  role='tab'
                  aria-controls='pills-recent-leads'
                  aria-selected='false'
                  tabIndex={-1}
                >
                  {t('latest_subscribe')}
                  <span className='text-sm fw-semibold py-6 px-12 bg-neutral-500 rounded-pill text-white line-height-1 ms-12 notification-alert'>
                    0
                  </span>
                </button>
              </li>
            </ul>
            <button
              type='button'
              onClick={handleViewAll}
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {showAll ? tCommon('show_less') : tCommon('view_all')}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </button>
          </div>
          <div className='tab-content' id='pills-tabContent'>
            <div
              className='tab-pane fade show active'
              id='pills-to-do-list'
              role='tabpanel'
              aria-labelledby='pills-to-do-list-tab'
              tabIndex={0}
            >
              <div className='table-responsive scroll-sm'>
                <table className='table bordered-table sm-table mb-0'>
                  <thead>
                    <tr>
                      <th scope='col'>{tCommon('users')} </th>
                      <th scope='col'>{t('registered_on')}</th>
                      <th scope='col'>{t('plan')}</th>
                      <th scope='col' className='text-center'>
                        {tCommon('status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((user, index) => (
                      <tr key={index}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <img
                              src={user.image}
                              alt=''
                              className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                            />
                            <div className='flex-grow-1'>
                              <h6 className='text-md mb-0 fw-medium'>
                                {user.name}
                              </h6>
                              <span className='text-sm text-secondary-light fw-medium'>
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>{user.date}</td>
                        <td>{t(user.plan)}</td>
                        <td className='text-center'>
                          <span className='bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm'>
                            {t(user.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Placeholder for Recent Leads tab content if needed */}
             <div
              className='tab-pane fade'
              id='pills-recent-leads'
              role='tabpanel'
              aria-labelledby='pills-recent-leads-tab'
              tabIndex={0}
            >
               <div className="p-3 text-center">
                  Content for Latest Subscribe
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestRegisteredOne;
