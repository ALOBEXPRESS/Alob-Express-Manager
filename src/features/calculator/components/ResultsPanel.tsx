import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp } from 'lucide-react';
import type { CalculationResult } from '../types/calculator';
import { formatCurrency } from '../utils/currency';

interface ResultsPanelProps {
  calculations: CalculationResult | null;
  marketplace: string;
  productName: string;
  competitorDiscount: string;
  setCompetitorDiscount: (value: string) => void;
  children?: React.ReactNode;
  onClose?: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  calculations,
  marketplace,
  productName,
  onClose
}) => {
  if (!calculations) return null;

  const getMarketplaceName = (slug: string) => {
    switch(slug) {
        case 'mercadolivre': return 'Mercado Livre';
        case 'shopee': return 'Shopee';
        case 'tiktok': return 'TikTok';
        case 'wordpress': return 'Site Próprio';
        default: return slug.charAt(0).toUpperCase() + slug.slice(1);
    }
  };

  const marketplaceName = getMarketplaceName(marketplace);

  // Determine background color based on logic
  const getBackgroundColor = () => {
    if (!calculations) return '#16A34A'; // Default/Initial -> Green
    
    // Rule: Based on margin status and price
    const { marginStatus, manualPrice, suggestedPrice } = calculations;
    
    // Negative -> Red
    if (marginStatus === 'negative') return '#DC2928';

    // If no manual price, use margin status of suggested price
    if (manualPrice <= 0) {
        if (marginStatus === 'low') return '#FFA500'; // Orange for low margin
        return '#16A34A'; // Green for good margin
    }

    // Check Manual Price vs Suggested Price
    if (manualPrice >= Number(suggestedPrice)) {
        // If margin is low (below recommended) but price is good -> Green
        if (marginStatus === 'low') return '#16A34A';
        // If margin is good/excellent -> Cyan (Recommended)
        return '#25f4ee';
    }

    // Positive but Low Price (< Suggested) -> Orange
    return '#FFA500';
  };

  const bgColor = getBackgroundColor();
  const formatMoney = (value: string | number) => formatCurrency(value);
  const formatPercent = (value: string | number, digits: number = 1) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(num)) return '0';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  };

  // Determine styles based on margin status for text contrast
  const getStatusStyles = () => {
    const defaultLight = {
      text: 'text-black',
      subText: 'text-black/80',
      accent: 'text-black',
      inputBorder: 'border-black/20 text-black placeholder-black/50',
      border: 'border-black/10'
    };

    const defaultDark = {
        bg: '', 
        border: 'border-white/20', // Generic light border
        text: 'text-white',
        subText: 'text-white/90',
        accent: 'text-white', 
        inputBorder: 'border-white/30 text-white placeholder-white/50'
    };

    if (!calculations) return defaultDark; // Green needs white text

    const bg = getBackgroundColor();

    // Green (#16A34A) or Red (#DC2928) -> Dark Background -> White Text
    if (bg === '#16A34A' || bg === '#DC2928') {
        return defaultDark;
    }

    // Cyan (#25f4ee) or Orange (#FFA500) -> Light Background -> Black Text
    return defaultLight;
  };

  const styles = getStatusStyles();

  return (
    <Card className="bg-transparent border-none shadow-xl relative overflow-hidden animate-on-scroll">
        <div className="absolute inset-0 z-0">
            <img src="/images/calculator/contactbg.jpg" alt="Background" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="relative z-10">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
          <div className="flex flex-row items-center gap-2">
            <TrendingUp className="w-6 h-6 text-white" />
            <CardTitle className="text-2xl font-bold text-white font-iceland">
              Resultado da Precificação - {marketplaceName}
            </CardTitle>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white text-lg font-bold leading-none"
            >
              ✕
            </button>
          ) : null}
        </CardHeader>
        <CardContent className="p-0">
        {calculations ? (
          <div 
            className={`w-full p-6 rounded-b-xl result-card-content ${styles.text}`}
            style={{ 
              backgroundColor: bgColor,
              transition: 'background-color 0.5s ease-in-out'
            }}
          >
           <div className="space-y-4 result-card-animate">
            {/* Preço de Venda Sugerido */}
            <div>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <p className={`text-lg mb-1 font-iceland font-bold ${styles.text}`}>Preço de Venda Sugerido</p>
                        
                        {productName && (
                            <p className={`text-lg font-semibold mb-1 ${styles.text}`}>{productName}</p>
                        )}
                        
                        <p className={`text-5xl font-bold ${styles.text}`}>R$ {formatMoney(calculations.suggestedPrice)}</p>
                        
                        <p className={`text-xs mt-2 font-medium ${styles.subText}`}>{calculations.taxDescription}</p>
                        
                        {Number(calculations.paidTrafficCost) > 0 && (
                            <div className="flex justify-between items-center mt-2 border-t border-black/10 pt-1 gap-2">
                                <span className={`text-xs font-bold ${styles.subText}`}>Investimento Tráfego:</span>
                                <span className={`text-xs font-bold ${styles.text}`}>R$ {formatMoney(calculations.paidTrafficCost)}</span>
                            </div>
                        )}
                        
                        {Number(calculations.paidTrafficGatewayCost) > 0 && (
                            <div className="flex justify-between items-center mt-1 gap-2">
                                <span className={`text-xs font-bold ${styles.subText}`}>Taxa Gateway (Tráfego Pago):</span>
                                <span className={`text-xs font-bold ${styles.text}`}>R$ {formatMoney(calculations.paidTrafficGatewayCost)}</span>
                            </div>
                        )}
                    </div>
                    {calculations.manualPrice > 0 && (
                         <div className="text-left md:text-right">
                            <p className={`text-sm mb-1 font-bold ${styles.text}`}>Seu Preço</p>
                            <p className={`text-3xl font-bold ${styles.accent}`}>R$ {formatMoney(calculations.manualPrice)}</p>
                         </div>
                    )}
                </div>

                {/* Profit & Margin Display */}
                <div className={`mt-4 pt-4 border-t ${
                    calculations.marginStatus === 'negative' ? 'border-white/20' : 'border-black/10'
                } grid grid-cols-2 gap-4`}>
                    <div>
                        <p className={`text-sm font-bold ${styles.subText}`}>Lucro Líquido</p>
                        <p className={`text-2xl font-bold ${styles.accent}`}>
                            R$ {formatMoney(calculations.netRevenue)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className={`text-sm font-bold ${styles.subText}`}>Margem</p>
                        <p className={`text-2xl font-bold ${styles.accent}`}>
                            {formatPercent(calculations.actualMargin)}%
                        </p>
                    </div>
                </div>
                
              </div>
           </div>
          </div>
        ) : null}
        </CardContent>
        </div>
    </Card>
  );
};
