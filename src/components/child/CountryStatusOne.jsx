"use client";

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';

const countryRowsByTimeframe = {
  Yearly: [
    { flagSrc: "/assets/images/flags/flag1.png", countryKey: "usa", users: 15000, percent: 80, progressClass: "bg-primary-600" },
    { flagSrc: "/assets/images/flags/flag2.png", countryKey: "japan", users: 12000, percent: 60, progressClass: "bg-orange" },
    { flagSrc: "/assets/images/flags/flag3.png", countryKey: "france", users: 10000, percent: 50, progressClass: "bg-yellow" },
    { flagSrc: "/assets/images/flags/flag4.png", countryKey: "germany", users: 8000, percent: 40, progressClass: "bg-success-main" }
  ],
  Monthly: [
    { flagSrc: "/assets/images/flags/flag1.png", countryKey: "usa", users: 1200, percent: 75, progressClass: "bg-primary-600" },
    { flagSrc: "/assets/images/flags/flag2.png", countryKey: "japan", users: 900, percent: 55, progressClass: "bg-orange" },
    { flagSrc: "/assets/images/flags/flag3.png", countryKey: "france", users: 800, percent: 45, progressClass: "bg-yellow" },
    { flagSrc: "/assets/images/flags/flag4.png", countryKey: "germany", users: 600, percent: 35, progressClass: "bg-success-main" }
  ],
  Weekly: [
    { flagSrc: "/assets/images/flags/flag1.png", countryKey: "usa", users: 300, percent: 70, progressClass: "bg-primary-600" },
    { flagSrc: "/assets/images/flags/flag2.png", countryKey: "japan", users: 200, percent: 50, progressClass: "bg-orange" },
    { flagSrc: "/assets/images/flags/flag3.png", countryKey: "france", users: 180, percent: 40, progressClass: "bg-yellow" },
    { flagSrc: "/assets/images/flags/flag4.png", countryKey: "germany", users: 150, percent: 30, progressClass: "bg-success-main" }
  ],
  Today: [
    { flagSrc: "/assets/images/flags/flag1.png", countryKey: "usa", users: 50, percent: 65, progressClass: "bg-primary-600" },
    { flagSrc: "/assets/images/flags/flag2.png", countryKey: "japan", users: 30, percent: 45, progressClass: "bg-orange" },
    { flagSrc: "/assets/images/flags/flag3.png", countryKey: "france", users: 25, percent: 35, progressClass: "bg-yellow" },
    { flagSrc: "/assets/images/flags/flag4.png", countryKey: "germany", users: 20, percent: 25, progressClass: "bg-success-main" }
  ]
};

const markerValuesByTimeframe = {
  Yearly: { china: "10,000", australia: "8,000", usa: "80%", uk: "5,000", uae: "2,000" },
  Monthly: { china: "800", australia: "600", usa: "75%", uk: "400", uae: "150" },
  Weekly: { china: "200", australia: "150", usa: "70%", uk: "100", uae: "40" },
  Today: { china: "30", australia: "20", usa: "65%", uk: "15", uae: "5" }
};

const CountryStatusOne = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [selectedTimeframe, setSelectedTimeframe] = useState("Yearly");

  useEffect(() => {
    let mapInstance;
    let cancelled = false;

    const init = async () => {
      const jsVectorMapModule = await import("jsvectormap");
      const jsVectorMap = jsVectorMapModule.default;
      window.jsVectorMap = jsVectorMap;
      await import("jsvectormap/dist/maps/world.js");

      if (cancelled) return;

      const markerValues = markerValuesByTimeframe[selectedTimeframe] ?? markerValuesByTimeframe.Yearly;

      const mapElement = document.getElementById('map-country-status-one');
      if (mapElement) {
        mapElement.innerHTML = '';
      }

      mapInstance = new jsVectorMap({
        selector: "#map-country-status-one",
        map: "world",
        backgroundColor: "transparent",
        borderColor: "#fff",
        borderOpacity: 0.25,
        borderWidth: 0,
        color: "#000000",
        regionStyle: {
          initial: {
            fill: "#D1D5DB",
          },
        },
        markerStyle: {
          initial: {
            r: 5,
            fill: "#fff",
            "fill-opacity": 1,
            stroke: "#000",
            "stroke-width": 1,
            "stroke-opacity": 0.4,
          },
        },
        markers: [
          { coords: [35.8617, 104.1954], name: `${t("china")} : ${markerValues.china}` },
          { coords: [25.2744, 133.7751], name: `${t("australia")} : ${markerValues.australia}` },
          { coords: [36.77, -119.41], name: `${t("usa")} : ${markerValues.usa}` },
          { coords: [55.37, -3.41], name: `${t("uk")} : ${markerValues.uk}` },
          { coords: [25.2, 55.27], name: `${t("uae")} : ${markerValues.uae}` },
        ],
        series: {
          regions: [
            {
              attribute: "fill",
              scale: {
                US: "#487FFF",
                SA: "#487FFF",
                AU: "#487FFF",
                CN: "#487FFF",
                GB: "#487FFF",
              },
              values: {
                US: "US",
                SA: "SA",
                AU: "AU",
                CN: "CN",
                GB: "GB",
              },
            },
          ],
        },
        hoverOpacity: null,
        normalizeFunction: "linear",
        zoomOnScroll: false,
        scaleColors: ["#000000", "#000000"],
        selectedColor: "#000000",
        selectedRegions: [],
        enableZoom: false,
        hoverColor: "#fff",
      });
    };

    init().catch((error) => {
      console.error("Failed to initialize jsVectorMap:", error);
    });

    return () => {
      cancelled = true;
      if (mapInstance) mapInstance.destroy();
    };
  }, [selectedTimeframe, t]);

  const countryRows = countryRowsByTimeframe[selectedTimeframe] ?? countryRowsByTimeframe.Yearly;
  return (
    <div className='col-xxl-4 col-sm-6'>
      <div className='card radius-8 border-0'>
        <div className='card-body'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg'>{t('countries_status')}</h6>
            <div className=''>
              <select
                className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              >
                <option value='Yearly'>{t('yearly')}</option>
                <option value='Monthly'>{t('monthly')}</option>
                <option value='Weekly'>{t('weekly')}</option>
                <option value='Today'>{t('today')}</option>
              </select>
            </div>
          </div>
        </div>
        {/* world-map */}
        <div id='world-map-country-status'>
          <div id='map-country-status-one' />
        </div>

        <div className='card-body p-24 max-h-266-px scroll-sm overflow-y-auto'>
          <div className=''>
            {countryRows.map((row) => (
              <div
                key={`${row.countryKey}-${selectedTimeframe}`}
                className='d-flex align-items-center justify-content-between gap-3 mb-3 pb-2'
              >
                <div className='d-flex align-items-center w-100'>
                  <img
                    src={row.flagSrc}
                    alt=''
                    className='w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden'
                  />
                  <div className='flex-grow-1'>
                    <h6 className='text-sm mb-0'>{t(row.countryKey)}</h6>
                    <span className='text-xs text-secondary-light fw-medium'>
                      {row.users.toLocaleString()} {tCommon('users')}
                    </span>
                  </div>
                </div>
                <div className='d-flex align-items-center gap-2 w-100'>
                  <div className='w-100 max-w-66 ms-auto'>
                    <div
                      className='progress progress-sm rounded-pill'
                      role='progressbar'
                      aria-label='Success example'
                      aria-valuenow={row.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className={`progress-bar ${row.progressClass} rounded-pill`}
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                  </div>
                  <span className='text-secondary-light font-xs fw-semibold'>
                    {row.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryStatusOne;
