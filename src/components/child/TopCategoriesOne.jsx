"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const TopCategoriesOne = () => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [showAll, setShowAll] = useState(false);

  const initialData = [
    { icon: '/assets/images/home-six/category-icon1.png', name: 'web_development', count: '40+', bg: 'bg-info-50' },
    { icon: '/assets/images/home-six/category-icon2.png', name: 'graphic_design', count: '40+', bg: 'bg-success-50' },
    { icon: '/assets/images/home-six/category-icon3.png', name: 'ui_ux_design', count: '40+', bg: 'bg-purple-50' },
    { icon: '/assets/images/home-six/category-icon4.png', name: 'digital_marketing', count: '40+', bg: 'bg-warning-50' },
    { icon: '/assets/images/home-six/category-icon5.png', name: '3d_illustration_art_design', count: '40+', bg: 'bg-danger-50' },
    { icon: '/assets/images/home-six/category-icon6.png', name: 'logo_design', count: '40+', bg: 'bg-primary-50' }
  ];

  const displayData = showAll 
    ? [...initialData, ...initialData] 
    : initialData;

  const handleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-4 col-md-6'>
      {/* Top Categories Card */}
      <div className='card'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("top_categories")}</h6>
            <button
              type='button'
              onClick={handleViewAll}
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {showAll ? tCommon("show_less") : tCommon("view_all")}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </button>
          </div>
        </div>
        <div className='card-body'>
          {displayData.map((item, index) => (
            <div key={index} className={`d-flex align-items-center justify-content-between gap-3 ${index !== displayData.length - 1 ? 'mb-24' : ''}`}>
              <div className='d-flex align-items-center gap-12'>
                <div className={`w-40-px h-40-px radius-8 flex-shrink-0 ${item.bg} d-flex justify-content-center align-items-center`}>
                  <img
                    src={item.icon}
                    alt=''
                    className=''
                  />
                </div>
                <div className='flex-grow-1'>
                  <h6 className='text-md mb-0 fw-normal'>{t(item.name)}</h6>
                  <span className='text-sm text-secondary-light fw-normal'>
                    {item.count} {t("courses")}
                  </span>
                </div>
              </div>
              <button
                type='button'
                className='w-24-px h-24-px bg-primary-50 text-primary-600 d-flex justify-content-center align-items-center text-lg bg-hover-primary-100 radius-4'
              >
                <i className='ri-arrow-right-s-line' />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCategoriesOne;
