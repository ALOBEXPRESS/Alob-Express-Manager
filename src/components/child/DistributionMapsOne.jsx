"use client";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
const DistributionMapsOne = () => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");

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
        const map = new jsVectorMap({
          selector: "#map-distribution-maps-one",
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
  }, [t]);
  return (
    <div className='col-xxl-4 col-lg-6'>
      <div className='card radius-8 border-0'>
        <div className='card-body'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg'>{t("distribution_maps")}</h6>
            <div className=''>
              <select
                className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                defaultValue=''
              >
                <option value='' disabled>
                  {t("select_frequency")}
                </option>
                <option value='Yearly'>{t("yearly")}</option>
                <option value='Monthly'>{t("monthly")}</option>
                <option value='Weekly'>{t("weekly")}</option>
                <option value='Today'>{t("today")}</option>
              </select>
            </div>
          </div>
        </div>
        <div id='world-map-distribution'>
          <div id='map-distribution-maps-one' />
        </div>
        <div className='card-body p-24 max-h-266-px scroll-sm overflow-y-auto'>
          <p className='text-center text-secondary-light mt-4'>No Data</p>
        </div>
      </div>
    </div>
  );
};

export default DistributionMapsOne;
