import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const NoticeBoardOne = () => {
  const t = useTranslations("dashboard");
  return (
    <div className='col-xxl-4'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("notice_board")}</h6>
            <Link
              href='#'
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              {t("view_all")}
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </Link>
          </div>
          <div className='d-flex align-items-start gap-2 mb-20'>
            <img
              src='/assets/images/notice/board-img1.png'
              alt=''
              className='flex-shrink-0 w-40-px h-40-px me-12 radius-8 me-12'
            />
            <div className='flex-grow-1'>
              <h6 className='text-md mb-1 fw-semibold'>{t("admin")}</h6>
              <p className='text-sm text-secondary-light fw-medium mb-1'>
                {t("lorem_ipsum")}
              </p>
              <span className='text-sm text-secondary-light fw-normal'>
                25 Jan 2024
              </span>
            </div>
          </div>
          <div className='d-flex align-items-start gap-2 mb-20'>
            <img
              src='/assets/images/notice/board-img2.png'
              alt=''
              className='flex-shrink-0 w-40-px h-40-px me-12 radius-8 me-12'
            />
            <div className='flex-grow-1'>
              <h6 className='text-md mb-1 fw-semibold'>Kathryn Murphy</h6>
              <p className='text-sm text-secondary-light fw-medium mb-1'>
                {t("lorem_ipsum")}
              </p>
              <span className='text-sm text-secondary-light fw-normal'>
                25 Jan 2024
              </span>
            </div>
          </div>
          <div className='d-flex align-items-start gap-2'>
            <img
              src='/assets/images/notice/board-img3.png'
              alt=''
              className='flex-shrink-0 w-40-px h-40-px me-12 radius-8 me-12'
            />
            <div className='flex-grow-1'>
              <h6 className='text-md mb-1 fw-semibold'>Cameron Williamson</h6>
              <p className='text-sm text-secondary-light fw-medium mb-1'>
                {t("lorem_ipsum")}
              </p>
              <span className='text-sm text-secondary-light fw-normal'>
                25 Jan 2024
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoardOne;
