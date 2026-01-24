"use client";
import useReactApexChart from "../../hook/useReactApexChart";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const CourseActivityOne = () => {
  let { paymentStatusChartSeriesOne, paymentStatusChartOptionsOne } =
    useReactApexChart();
  const t = useTranslations("dashboard");
  const [showAll, setShowAll] = useState(false);

  const activityList = [
    { name: 'Introduction to React', type: 'Paid', users: 120, revenue: '$1200' },
    { name: 'Python Basics', type: 'Free', users: 300, revenue: '$0' },
    { name: 'UI/UX Masterclass', type: 'Paid', users: 80, revenue: '$2400' },
    { name: 'Data Science Bootcamp', type: 'Paid', users: 50, revenue: '$5000' },
    { name: 'Graphic Design', type: 'Free', users: 150, revenue: '$0' },
    { name: 'Web Development', type: 'Paid', users: 200, revenue: '$2000' },
    { name: 'Digital Marketing', type: 'Free', users: 100, revenue: '$0' },
  ];

  const handleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className='col-xxl-4'>
      <div className='card h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("course_activity")}</h6>
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
        <div className='card-body p-24'>
          {!showAll ? (
            <>
              <ul className='d-flex flex-wrap align-items-center justify-content-center my-3 gap-3'>
                <li className='d-flex align-items-center gap-2'>
                  <span className='w-12-px h-12-px rounded-circle bg-warning-600' />
                  <span className='text-secondary-light text-sm fw-semibold'>
                    {t("paid_course")}:
                    <span className='text-primary-light fw-bold'>500</span>
                  </span>
                </li>
                <li className='d-flex align-items-center gap-2'>
                  <span className='w-12-px h-12-px rounded-circle bg-success-main' />
                  <span className='text-secondary-light text-sm fw-semibold'>
                    {t("free_course")}:
                    <span className='text-primary-light fw-bold'>300</span>
                  </span>
                </li>
              </ul>
              <div
                id='paymentStatusChart'
                className='margin-16-minus y-value-left'
              />
              <ReactApexChart
                options={paymentStatusChartOptionsOne}
                series={paymentStatusChartSeriesOne}
                type='bar'
                height={420}
                id='paymentStatusChart'
                className='margin-16-minus y-value-left'
              />
            </>
          ) : (
            <div className='table-responsive'>
              <table className='table bordered-table mb-0'>
                <thead>
                  <tr>
                    <th scope='col'>{t("course_name")}</th>
                    <th scope='col'>{t("type")}</th>
                    <th scope='col'>{t("users")}</th>
                  </tr>
                </thead>
                <tbody>
                  {activityList.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <span className='text-primary-light fw-medium'>
                          {item.name}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`px-8 py-4 rounded-pill fw-medium text-xs ${
                            item.type === 'Paid'
                              ? 'bg-warning-focus text-warning-main'
                              : 'bg-success-focus text-success-main'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td>
                        <span className='text-secondary-light'>
                          {item.users}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseActivityOne;
