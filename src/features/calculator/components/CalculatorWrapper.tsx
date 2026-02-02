'use client';

import dynamic from 'next/dynamic';

const DropshippingCalculator = dynamic(
  () => import('./DropshippingCalculator'),
  { ssr: false }
);

export const CalculatorWrapper = () => {
  return (
    <div className="calculator-theme-wrapper">
      <DropshippingCalculator />
    </div>
  );
};
