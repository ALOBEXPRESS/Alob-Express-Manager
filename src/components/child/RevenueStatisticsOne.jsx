"use client";
import { Icon } from "@iconify/react";
import useReactApexChart from "../../hook/useReactApexChart";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueStatisticsOne = () => {
  let { upDownBarChartSeries, upDownBarChartOptions } = useReactApexChart();
  const t = useTranslations("dashboard");

  const [series, setSeries] = useState(upDownBarChartSeries);
  const [options, setOptions] = useState(upDownBarChartOptions);
  const [selectedTimeframe, setSelectedTimeframe] = useState('Yearly');

  const chartData = {
    Yearly: {
      series: upDownBarChartSeries,
      categories: upDownBarChartOptions.xaxis.categories
    },
    Monthly: {
      series: [{
        name: 'Cash Flow',
        data: [10, 15, -5, 20, 25, -10, 15, 30, -20, 10, 5, 15, -10, 20, 25, 30, -5, -10, 15, 20, 25, -5, 10, 15, 20, -10, 5, 10, 15, 20]
      }],
      categories: Array.from({length: 30}, (_, i) => `Day ${i + 1}`)
    },
    Weekly: {
      series: [{
        name: 'Cash Flow',
        data: [20, 30, -10, 15, 40, -20, 25]
      }],
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    Today: {
      series: [{
        name: 'Cash Flow',
        data: [5, 10, 15, -5, -10, 20, 25, 30, 15, 10, 5, -5, -10, 15, 20, 25, 30, 35, 20, 15, 10, 5, -5, 10]
      }],
      categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
    }
  };

  const handleTimeframeChange = (e) => {
    const value = e.target.value;
    setSelectedTimeframe(value);
    
    const data = chartData[value];
    if (data) {
      setSeries(data.series);
      setOptions(prev => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: data.categories
        }
      }));
    }
  };

  return (
    <div className='col-xxl-8'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <div>
              <h6 className='mb-2 fw-bold text-lg'>{t("revenue_statistics")}</h6>
              <span className='text-sm fw-medium text-secondary-light'>
                {t(`${selectedTimeframe.toLowerCase()}_earning_overview`)}
              </span>
            </div>
            <div className=''>
              <select
                className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                value={selectedTimeframe}
                onChange={handleTimeframeChange}
              >
                <option value='Yearly'>{t("yearly")}</option>
                <option value='Monthly'>{t("monthly")}</option>
                <option value='Weekly'>{t("weekly")}</option>
                <option value='Today'>{t("today")}</option>
              </select>
            </div>
          </div>
          <div className='mt-24 mb-24 d-flex flex-wrap'>
            <div className='me-40'>
              <span className='text-secondary-light text-sm mb-1'>{t("income")}</span>
              <div className=''>
                <h6 className='fw-semibold d-inline-block mb-0'>$26,201</h6>
                <span className='text-success-main fw-bold d-inline-flex align-items-center gap-1'>
                  10% <Icon icon='iconamoon:arrow-up-2-fill' className='icon' />{" "}
                </span>
              </div>
            </div>
            <div>
              <span className='text-secondary-light text-sm mb-1'>
                {t("expenses")}
              </span>
              <div className=''>
                <h6 className='fw-semibold d-inline-block mb-0'>$18,120</h6>
                <span className='text-danger-main fw-bold d-inline-flex align-items-center gap-1'>
                  10%{" "}
                  <Icon icon='iconamoon:arrow-down-2-fill' className='icon' />{" "}
                </span>
              </div>
            </div>
          </div>
          <ReactApexChart
            options={options}
            series={series}
            type='bar'
            height={263}
            id='upDownBarchart'
          />
        </div>
      </div>
    </div>
  );
};

export default RevenueStatisticsOne;
