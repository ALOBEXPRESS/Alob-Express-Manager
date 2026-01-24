"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const StudentProgressOne = () => {
  const t = useTranslations("dashboard");
  const [showAll, setShowAll] = useState(false);

  const initialData = [
    { img: '/assets/images/home-six/student-img1.png', name: 'Theresa Webb', course: 'ui_ux_design_course', progress: 33, dashOffset: 39.58 },
    { img: '/assets/images/home-six/student-img2.png', name: 'Robert Fox', course: 'graphic_design_course', progress: 70, dashOffset: 39.58 },
    { img: '/assets/images/home-six/student-img3.png', name: 'Guy Hawkins', course: 'web_developer_course', progress: 80, dashOffset: 39.58 },
    { img: '/assets/images/home-six/student-img4.png', name: 'Cody Fisher', course: 'ui_ux_design_course', progress: 20, dashOffset: 39.58 },
    { img: '/assets/images/home-six/student-img5.png', name: 'Jacob Jones', course: 'ui_ux_design_course', progress: 40, dashOffset: 39.58 },
    { img: '/assets/images/home-six/student-img6.png', name: 'Darlene Robertson', course: 'ui_ux_design_course', progress: 24, dashOffset: 39.58 }
  ];

  const displayData = showAll 
    ? [...initialData, ...initialData] 
    : initialData;

  const handleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-4 col-md-6'>
      <div className='card'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("student_progress")}</h6>
            <button
              type='button'
              onClick={handleViewAll}
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {showAll ? t("show_less") : t("view_all")}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </button>
          </div>
        </div>
        <div className='card-body'>
          {displayData.map((student, index) => (
            <div key={index} className={`d-flex align-items-center justify-content-between gap-3 ${index !== displayData.length - 1 ? 'mb-24' : ''}`}>
              <div className='d-flex align-items-center'>
                <img
                  src={student.img}
                  alt=''
                  className='w-40-px h-40-px radius-8 flex-shrink-0 me-12 overflow-hidden'
                />
                <div className='flex-grow-1'>
                  <h6 className='text-md mb-0 fw-medium'>{student.name}</h6>
                  <span className='text-sm text-secondary-light fw-medium'>
                    {t(student.course)}
                  </span>
                </div>
              </div>
              <div className=''>
                <span className='text-primary-light text-sm d-block text-end'>
                  <svg
                    className='radial-progress'
                    data-percentage={student.progress}
                    viewBox='0 0 80 80'
                  >
                    <circle className='incomplete' cx={40} cy={40} r={35} />
                    <circle
                      className='complete'
                      cx={40}
                      cy={40}
                      r={35}
                      style={{ strokeDashoffset: "39.58406743523136" }} // In a real app calculate this based on percentage
                    ></circle>
                    <text
                      className='percentage'
                      x='50%'
                      y='57%'
                      transform='matrix(0, 1, -1, 0, 80, 0)'
                    >
                      {student.progress}
                    </text>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgressOne;
