import React from 'react';
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface MarketplaceConfigProps {
  marketplace: string;
  handleMarketplaceChange: (value: string) => void;
}

export const MarketplaceConfig: React.FC<MarketplaceConfigProps> = ({
  marketplace,
  handleMarketplaceChange
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label className="text-sm font-semibold text-gray-800">
        Marketplace
      </Label>
      <Select value={marketplace} onValueChange={handleMarketplaceChange}>
        <SelectTrigger data-testid="marketplace-select-trigger">
          <SelectValue placeholder="Selecione o marketplace" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
          <SelectItem value="shopee">Shopee</SelectItem>
          <SelectItem value="tiktok">Tiktok Shop</SelectItem>
          <SelectItem value="wordpress">Wordpress (Site)</SelectItem>
          <SelectItem value="enjoei">Enjoei</SelectItem>
          <SelectItem value="amazon">Amazon</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
