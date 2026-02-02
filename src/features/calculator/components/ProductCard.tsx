import React, { useState } from 'react';
import { Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "./ui/button";
import type { ProductItem } from '../types/calculator';

interface ProductCardProps {
  product: ProductItem;
  onDelete: (id: string) => void;
  onEdit: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onEdit }) => {
  const [currentVarIndex, setCurrentVarIndex] = useState(0);
  const variations = product.variations ?? [];
  const hasVariations = variations.length > 0;
  
  const currentData = hasVariations ? variations[currentVarIndex] : null;
  
  // Variation data fallback to product main data if missing (e.g. image)
  const displayImage = product.imageUrl;
  const displayName = hasVariations
    ? `${product.name} - ${currentData?.name ?? ''}`.trim()
    : product.name;
  
  // Metrics
  const sellingPrice = hasVariations
    ? currentData?.manualPrice ?? currentData?.suggestedPrice
    : product.sellingPrice;
  const costPrice = hasVariations ? currentData?.cost : product.costPrice;
  const netRevenue = hasVariations ? currentData?.netRevenue : product.netRevenue;
  // Margin for variations might be calculated or stored
  
  const handlePrevVar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentVarIndex((prev) => (prev - 1 + variations.length) % variations.length);
  };

  const handleNextVar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentVarIndex((prev) => (prev + 1) % variations.length);
  };

  const formatMoney = (val: string | number | undefined) => {
      const num = typeof val === 'string' ? parseFloat(val) : val ?? 0;
      if(Number.isNaN(num)) return 'R$ 0,00';
      return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getMarketplaceLabel = (value: string | undefined) => {
    if (!value) return '';
    switch(value) {
      case 'mercadolivre': return <span className="text-yellow-500">Mercado Livre</span>;
      case 'shopee': return <span className="text-orange-500">Shopee</span>;
      case 'tiktok': return 'TikTok';
      case 'wordpress': return 'Site Próprio';
      case 'enjoei': return 'Enjoei';
      case 'shein': return 'Shein';
      case 'amazon': return 'Amazon';
      default: return value.charAt(0).toUpperCase() + value.slice(1);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm relative group">
      {/* Edit Button */}
      <button 
        onClick={() => onEdit(product)}
        className="absolute top-2 right-2 p-1.5 bg-muted hover:bg-muted/80 rounded-full text-muted-foreground transition-colors z-10"
        title="Editar"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted relative group/image">
          <img src={displayImage} alt={displayName} className="h-full w-full object-cover" />
          
          {hasVariations && (
            <>
              <button 
                onClick={handlePrevVar}
                className="absolute left-0 top-0 bottom-0 bg-black/30 hover:bg-black/50 text-white px-0.5 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextVar}
                className="absolute right-0 top-0 bottom-0 bg-black/30 hover:bg-black/50 text-white px-0.5 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-white text-center py-0.5">
                {currentVarIndex + 1}/{variations.length}
              </div>
            </>
          )}
        </div>
        
        <div className="flex-1 min-w-0 pr-6">
          <p className="text-xs font-bold text-foreground line-clamp-2" title={displayName}>{displayName}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1" title={product.sku || '-'}>
            SKU: {product.sku || '-'}
          </p>
          <div className="mt-1 text-xs font-semibold">{getMarketplaceLabel(product.marketplace)}</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div>
          <p className="text-[10px] uppercase text-muted-foreground">Preço</p>
          <p className="font-semibold text-foreground">{formatMoney(sellingPrice)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-muted-foreground">Custo</p>
          <p className="font-semibold text-foreground">{formatMoney(costPrice)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-muted-foreground">Lucro</p>
          <p className="font-semibold" style={{ color: product.colorHex }}>
            {formatMoney(netRevenue)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-muted-foreground">Fornecedor</p>
          <p className="font-semibold text-foreground">{product.supplierName || '-'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-muted-foreground">Titular</p>
          <p className="font-semibold text-foreground">{product.accountHolder || '-'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-muted-foreground">Tipo de conta</p>
          <p className="font-semibold text-foreground">{product.accountType ? product.accountType.toUpperCase() : '-'}</p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-3 h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
        onClick={() => onDelete(product.id)}
      >
        <Trash2 className="w-3.5 h-3.5 mr-2" />
        Excluir
      </Button>
    </div>
  );
};
