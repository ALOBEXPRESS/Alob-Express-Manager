"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

const SalesByCountries = () => {
  const t = useTranslations("dashboard");
  const t_common = useTranslations("common");

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
          selector: "#map-sales-countries",
          map: "world", // Use the map name you installed
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
            { coords: [35.8617, 104.1954], name: `${t("china")} : 250` },
            { coords: [25.2744, 133.7751], name: `${t("australia")} : 250` },
            { coords: [36.77, -119.41], name: `${t("usa")} : 82%` },
            { coords: [55.37, -3.41], name: `${t("uk")} : 250` },
            { coords: [25.2, 55.27], name: `${t("uae")} : 250` },
          ],
          series: {
            regions: [
              {
                attribute: "fill",

                scale: {
                  US: "#487FFF ",
                  SA: "#487FFF",
                  AU: "#487FFF",
                  CN: "#487FFF",
                  GB: "#487FFF",
                },
                values: {
                  // But when dealing with regions's series you should specify the region key.
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
    <div className='col-xxl-6'>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>{t("sales_by_countries")}</h6>
            <select className='form-select form-select-sm w-auto bg-base border text-secondary-light'>
              <option>{t("this_month")}</option>
              <option>{t("this_week")}</option>
              <option>{t("this_year")}</option>
            </select>
          </div>
          <div
            id='map-sales-countries'
            className='h-100 border-0 shadow-none'
          />
        </div>
      </div>
    </div>
  );
};

export default SalesByCountries;
