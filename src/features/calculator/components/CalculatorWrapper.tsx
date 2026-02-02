'use client';

import dynamic from "next/dynamic";

const CalculatorPage = dynamic(() => import("../CalculatorPage"), {
  ssr: false,
});

export const CalculatorWrapper = () => {
  return (
    <CalculatorPage />
  );
};
