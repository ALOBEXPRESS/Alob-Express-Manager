"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

const TopInstructorsOne = () => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [showAll, setShowAll] = useState(false);

  const initialData = [
    { img: '/assets/images/users/user1.png', name: 'Dianne Russell', reviews: 25 },
    { img: '/assets/images/users/user2.png', name: 'Wade Warren', reviews: 25 },
    { img: '/assets/images/users/user3.png', name: 'Albert Flores', reviews: 25 },
    { img: '/assets/images/users/user4.png', name: 'Bessie Cooper', reviews: 25 },
    { img: '/assets/images/users/user5.png', name: 'Arlene McCoy', reviews: 25 }
  ];

  const displayData = showAll 
    ? [...initialData, ...initialData] 
    : initialData;

  const handleViewAll = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-4 col-md-6'>
      <div className='card'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("top_instructors")}</h6>
            <Link
              href='#'
              onClick={handleViewAll}
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {showAll ? tCommon("show_less") : tCommon("view_all")}
              <iconify-icon icon='solar:alt-arrow-right-linear' className='icon' />
            </Link>
          </div>
        </div>
        <div className='card-body'>
          {displayData.map((user, index) => (
            <div key={index} className={`d-flex align-items-center justify-content-between gap-3 ${index !== displayData.length - 1 ? 'mb-24' : ''}`}>
              <div className='d-flex align-items-center'>
                <img
                  src={user.img}
                  alt=''
                  className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                />
                <div className='flex-grow-1'>
                  <h6 className='text-md mb-0 fw-medium'>{user.name}</h6>
                  <span className='text-sm text-secondary-light fw-medium'>
                    {t("agent_id")}: 36254
                  </span>
                </div>
              </div>
              <div className=''>
                <div className='d-flex align-items-center gap-6 mb-1'>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className='text-lg text-warning-600 d-flex line-height-1'>
                      <i className='ri-star-fill' />
                    </span>
                  ))}
                </div>
                <span className='text-primary-light text-sm d-block text-end'>
                  {user.reviews} {t("reviews")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopInstructorsOne;
