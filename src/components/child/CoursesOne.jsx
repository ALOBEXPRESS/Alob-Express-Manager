"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const CoursesOne = () => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [showAll, setShowAll] = useState(false);

  const initialData = [
    { date: '24 Jun 2024', instructor: 'Ronald Richards', name: '3d_illustration_art_design', lessons: 34, users: 257, price: '$29.00' },
    { date: '24 Jun 2024', instructor: 'Jerome Bell', name: 'Advanced JavaScript Development', lessons: 20, users: 375, price: '$29.00' },
    { date: '24 Jun 2024', instructor: 'Cody Fisher', name: 'Portrait Drawing Fundamentals', lessons: 16, users: 220, price: '$29.00' },
    { date: '24 Jun 2024', instructor: 'Floyd Miles', name: 'Advanced App Development', lessons: 25, users: 57, price: '$29.00' },
    { date: '24 Jun 2024', instructor: 'Ralph Edwards', name: 'HTML Fundamental Course', lessons: 17, users: 27, price: '$29.00' }
  ];

  const displayData = showAll 
    ? [...initialData, ...initialData] 
    : initialData;

  const handleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-8'>
      <div className='card h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("courses")}</h6>
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
        <div className='card-body p-24'>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0'>
              <thead>
                <tr>
                  <th scope='col'>{t("registered_on")}</th>
                  <th scope='col'>{t("instructors")} </th>
                  <th scope='col'>{t("users")}</th>
                  <th scope='col'>{t("enrolled")}</th>
                  <th scope='col'>{t("price")} </th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((course, index) => (
                  <tr key={index}>
                    <td>
                      <span className='text-secondary-light'>{course.date}</span>
                    </td>
                    <td>
                      <span className='text-secondary-light'>
                        {course.instructor}
                      </span>
                    </td>
                    <td>
                      <div className='text-secondary-light'>
                        <h6 className='text-md mb-0 fw-normal'>
                          {course.name.includes('_') ? t(course.name) : course.name}
                        </h6>
                        <span className='text-sm fw-normal'>{course.lessons} {t("lessons")}</span>
                      </div>
                    </td>
                    <td>
                      <span className='text-secondary-light'>{course.users}</span>
                    </td>
                    <td>
                      <span className='text-secondary-light'>{course.price}</span>
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

export default CoursesOne;
