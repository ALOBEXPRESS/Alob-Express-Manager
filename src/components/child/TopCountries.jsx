"use client";
import React, { useEffect } from "react";
import { useTranslations } from 'next-intl';

const TopCountries = () => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');

  useEffect(() => {
    // Dynamically import jsVectorMap and the world map
    import("jsvectormap")
      .then((jsVectorMapModule) => {
        const jsVectorMap = jsVectorMapModule.default;
        // Ensure jsVectorMap is attached to window if the library expects it
        window.jsVectorMap = jsVectorMap;
        return import("jsvectormap/dist/maps/world.js").then(() => jsVectorMap);
      })
      .then((jsVectorMap) => {
        // Initialize the map
        const map = new jsVectorMap({
          selector: "#map-top-countries",
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
          markers: [],
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

        // Cleanup the map instance when the component unmounts
        return () => {
          map && map.destroy();
        };
      })
      .catch((error) => {
        console.error("Failed to initialize jsVectorMap:", error);
      });
  }, []);
  return (
    <div className='col-xxl-6 col-xl-12'>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t('top_countries')}</h6>
            <select
              className='form-select form-select-sm w-auto bg-base border text-secondary-light'
              defaultValue='Today'
            >
              <option value='Today'>{t('today')}</option>
              <option value='Weekly'>{t('weekly')}</option>
              <option value='Monthly'>{t('monthly')}</option>
              <option value='Yearly'>{t('yearly')}</option>
            </select>
          </div>
          <div className='row gy-4'>
            <div className='col-lg-6'>
              {/* world-map */}
              <div id='map-top-countries' className='h-100 border radius-8'></div>
            </div>
            <div className='col-lg-6'>
              <div className='h-100 border p-16 pe-0 radius-8'>
                <div className='max-h-266-px overflow-y-auto scroll-sm pe-16'>
                    <p className='text-center mt-4 text-secondary-light'>No Data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCountries;
