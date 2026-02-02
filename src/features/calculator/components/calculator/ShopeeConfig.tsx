import React from 'react';
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { DollarSign } from 'lucide-react';
import { shopeeCategories } from '../../services/pricingService';
import { handleCurrencyChange } from '../../utils/currency';

interface ShopeeConfigProps {
  marketplace: string;
  category: string;
  handleShopeeCategoryChange: (value: string) => void;
  extraCommission: string;
  setExtraCommission: (value: string) => void;
  shippingOption: string;
  setShippingOption: (value: string) => void;
  shopeeSellerType: 'cpf' | 'cnpj';
  setShopeeSellerType: (value: 'cpf' | 'cnpj') => void;
  useShopeeAds: boolean;
  handleShopeeAdsChange: (checked: boolean) => void;
  adsCPC: string;
  setAdsCPC: (value: string) => void;
  dailyBudget: string;
  setDailyBudget: (value: string) => void;
  salesQuantity: string;
  setSalesQuantity: (value: string) => void;
}

export const ShopeeConfig: React.FC<ShopeeConfigProps> = ({
  marketplace,
  category,
  handleShopeeCategoryChange,
  extraCommission,
  setExtraCommission,
  shippingOption,
  setShippingOption,
  shopeeSellerType,
  setShopeeSellerType,
  useShopeeAds,
  handleShopeeAdsChange,
  adsCPC,
  setAdsCPC,
  dailyBudget,
  setDailyBudget,
  salesQuantity,
  setSalesQuantity
}) => {
  if (marketplace !== 'shopee') return null;

  const fixedFeeLabel = shopeeSellerType === 'cpf' ? 'R$ 5,00 (Tarifa Fixa)' : 'R$ 4,00 (Tarifa Fixa)';

  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="text-sm font-semibold text-gray-800">
          Categoria (Estimativa de CPC)
        </Label>
        <Select value={category} onValueChange={handleShopeeCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(shopeeCategories).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="text-sm font-semibold text-gray-800">
          Tipo de Cadastro
        </Label>
        <Select value={shopeeSellerType} onValueChange={(value) => setShopeeSellerType(value as 'cpf' | 'cnpj')}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cpf">CPF</SelectItem>
            <SelectItem value="cnpj">CNPJ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-orange-500" />
          Taxas Shopee
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">Taxa de Transação</Label>
            <div className="relative">
              <Input 
                value="2%" 
                disabled 
                className="bg-gray-100 text-gray-600 h-9 font-medium" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">Taxa Fixa (por item)</Label>
            <div className="relative">
              <Input 
                value={fixedFeeLabel} 
                disabled 
                className="bg-gray-100 text-gray-600 h-9 font-medium" 
              />
            </div>
          </div>
          
          <div className="col-span-2 space-y-1.5">
             <Label className="text-xs text-gray-600">Comissões Extras (%)</Label>
             <Input 
                type="text"
                inputMode="decimal"
                value={extraCommission}
                onChange={(e) => handleCurrencyChange(e, setExtraCommission)}
                placeholder="0"
                className="h-9 font-medium" 
              />
          </div>
        </div>
        <p className="text-[10px] text-gray-500 -mt-2">*com exceções para alguns vendedores</p>

        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
          <div className="space-y-0.5">
            <Label htmlFor="free-shipping" className="text-sm font-medium text-gray-800">
              Programa de Frete Grátis
            </Label>
            <p className="text-xs text-gray-500">Adicional de 6%</p>
          </div>
          <Checkbox 
            id="free-shipping"
            checked={shippingOption === 'with'}
            onCheckedChange={(checked) => setShippingOption(checked ? 'with' : 'without')}
          />
        </div>
      </div>

      <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 mt-2">
        <div className="flex items-center space-x-2 mb-3">
          <Checkbox 
            id="useShopeeAds" 
            checked={useShopeeAds}
            onCheckedChange={(checked) => handleShopeeAdsChange(checked as boolean)}
          />
          <Label htmlFor="useShopeeAds" className="font-bold text-gray-800 cursor-pointer">
            Calcular Shopee Ads
          </Label>
        </div>

        {useShopeeAds && (
          <div className="grid grid-cols-2 gap-4 animate-fadeIn">
            <div>
              <Label htmlFor="adsCPC" className="text-xs font-semibold text-gray-700 mb-1">
                CPC Médio (R$)
              </Label>
              <Input
                id="adsCPC"
                type="text"
                inputMode="decimal"
                value={adsCPC}
                onChange={(e) => handleCurrencyChange(e, setAdsCPC)}
                className="h-8 text-sm"
                placeholder="0,40"
              />
            </div>
            <div>
              <Label htmlFor="dailyBudget" className="text-xs font-semibold text-gray-700 mb-1">
                Orçamento Diário (R$)
              </Label>
              <Input
                id="dailyBudget"
                type="text"
                inputMode="decimal"
                value={dailyBudget}
                onChange={(e) => handleCurrencyChange(e, setDailyBudget)}
                className={`h-8 text-sm ${parseFloat(dailyBudget.replace(',','.')) < 10 ? 'border-red-500' : ''}`}
                placeholder="10,00"
              />
            </div>
            {parseFloat(dailyBudget.replace(',','.')) < 10 && (
                <div className="col-span-2 text-xs text-red-500 font-bold">
                    * Mínimo de R$ 10,00
                </div>
            )}
            <div className="col-span-2">
               <Label htmlFor="salesQuantity" className="text-xs font-semibold text-gray-700 mb-1">
                Quantidade de Vendas (Para Cálculo de CR)
              </Label>
               <Input
                id="salesQuantity"
                type="text"
                inputMode="decimal"
                value={salesQuantity}
                onChange={(e) => setSalesQuantity(e.target.value.replace(/\D/g, ''))}
                className="h-8 text-sm"
                placeholder="0"
              />
            </div>
            <div className="col-span-2 text-[10px] text-gray-500 space-y-2 border-t pt-2 mt-2">
               <p><strong>ROI (Retorno sobre Investimento):</strong></p>
               <ul className="list-disc pl-4 space-y-1">
                    <li>1 - 3: Baixo/Arriscado</li>
                    <li>4 - 6: Bom</li>
                    <li>7+: Excelente</li>
               </ul>
               <p><strong>ACOS (Custo de Venda):</strong></p>
               <ul className="list-disc pl-4 space-y-1">
                    <li>15% - 30%: Excelente</li>
                    <li>30% - 50%: Moderado</li>
                    <li>50%+: Alto</li>
               </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
