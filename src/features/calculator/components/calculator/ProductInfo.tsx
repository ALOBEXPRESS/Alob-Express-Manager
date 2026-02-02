import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ProductInfoProps {
  productName: string;
  setProductName: (value: string) => void;
  productImage: string;
  setProductImage: (value: string) => void;
  productSku: string;
  setProductSku: (value: string) => void;
  stockQuantity: string;
  setStockQuantity: (value: string) => void;
  operationMode: string;
  handleOperationModeChange: (value: string) => void;
  returnRate: string;
  setReturnRate: (value: string) => void;
  handleFloatInput: (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  deliveryMode: string;
  marketplace: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  productName,
  setProductName,
  operationMode,
  handleOperationModeChange,
  returnRate,
  setReturnRate,
  handleFloatInput,
  deliveryMode,
  productImage,
  setProductImage,
  productSku,
  setProductSku,
  stockQuantity,
  setStockQuantity
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Nome do Produto */}
      <div className="grid w-full items-center gap-1.5 animate-fadeIn">
        <Label htmlFor="productName" className="text-sm font-semibold text-gray-800">
          Nome do Produto <span className="text-red-500">*</span>
        </Label>
        <Input
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Ex: Fone Bluetooth"
        />
      </div>

      <div className="grid w-full items-center gap-1.5 animate-fadeIn">
        <Label htmlFor="productSku" className="text-sm font-semibold text-gray-800">
          SKU do Produto <span className="text-red-500">*</span>
        </Label>
        <Input
          id="productSku"
          value={productSku}
          onChange={(e) => setProductSku(e.target.value)}
          placeholder="Ex: SKU-001"
        />
      </div>

      <div className="grid w-full items-center gap-1.5 animate-fadeIn">
        <Label htmlFor="stockQuantity" className="text-sm font-semibold text-gray-800">
          Quantidade em estoque <span className="text-red-500">*</span>
        </Label>
        <Input
          id="stockQuantity"
          type="number"
          inputMode="numeric"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          placeholder="0"
          min="0"
        />
      </div>

      {/* Imagem do Produto */}
      <div className="grid w-full items-center gap-1.5 animate-fadeIn">
        <Label htmlFor="productImage" className="text-sm font-semibold text-gray-800">
          Imagem do Produto (URL) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="productImage"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
        />
        <p className="text-xs text-gray-500">
          Cole a URL da imagem (ex: imgbb, imgur)
        </p>
      </div>

      {/* Modalidade */}
      <div className="grid w-full items-center gap-1.5 animate-fadeIn">
        <Label className="text-sm font-semibold text-gray-800">
          Modalidade
        </Label>
        <Select value={operationMode} onValueChange={handleOperationModeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dropshipping">Dropshipping</SelectItem>
            <SelectItem value="armazem_alob">Estoque Próprio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chance de Devolução */}
      <div className="grid w-full items-center gap-1.5 animate-fadeIn">
        <Label htmlFor="returnRate" className="text-sm font-semibold text-gray-800">
          Chance de devolução (%)
        </Label>
        <div className="relative">
          <Input
            id="returnRate"
            type="text"
            inputMode="decimal"
            value={returnRate}
            onChange={(e) => handleFloatInput(setReturnRate)(e)}
            className="pl-3"
            placeholder="33,33"
            step="0.01"
          />
        </div>
      </div>

      {/* Campos Condicionais da Modalidade */}
      {operationMode === 'armazem_alob' && (
        <div className="grid w-full items-center gap-1.5 animate-fadeIn">
          <Label className="text-sm font-semibold text-gray-800">
            Modalidade de entrega
          </Label>
          <Select 
            value={deliveryMode} 
            disabled={true}
          >
            <SelectTrigger className="bg-gray-100 text-gray-500 cursor-not-allowed">
              <SelectValue placeholder="Selecione a entrega" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tiktok">Tiktokshop</SelectItem>
              <SelectItem value="shopee_envios">Shopee Envios</SelectItem>
              <SelectItem value="mercado_envios">Mercado Envios</SelectItem>
              <SelectItem value="aliexpress">AliExpress Standard Ship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
