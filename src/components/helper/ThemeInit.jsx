"use client";
import { useEffect } from "react";

const ThemeInit = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedColor = localStorage.getItem("theme-color");
      if (storedColor) {
        document.documentElement.setAttribute("data-theme-color", storedColor);
      }
    }
  }, []);

  return null;
};

export default ThemeInit;
