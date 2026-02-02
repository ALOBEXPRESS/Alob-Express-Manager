import React from 'react';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { handleCurrencyChange } from '../utils/currency';

interface TikTokConfigProps {
  marketplace: string;
  tiktokCommission: string;
  setTiktokCommission: (value: string) => void;
}

export const TikTokConfig: React.FC<TikTokConfigProps> = ({
  marketplace,
  tiktokCommission,
  setTiktokCommission
}) => {
  if (marketplace !== 'tiktok') return null;

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
       <Label htmlFor="tiktokCommission" className="text-sm font-semibold text-gray-800">
         Taxa de Comissão Tiktok (%)
       </Label>
       <div className="relative">
          <Input
           id="tiktokCommission"
           type="text"
           inputMode="decimal"
           value={tiktokCommission}
           onChange={(e) => handleCurrencyChange(e, setTiktokCommission)}
           placeholder="Ex: 6"
          />
       </div>
    </div>
  );
};
