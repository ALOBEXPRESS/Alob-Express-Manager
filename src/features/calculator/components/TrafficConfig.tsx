import React from 'react';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { TrendingUp } from 'lucide-react';
import { GatewayConfig } from './GatewayConfig';
import { handleCurrencyChange } from '../utils/currency';

interface TrafficConfigProps {
  trafficMode: 'paid' | 'organic';
  handleTrafficModeChange: (value: 'paid' | 'organic') => void;
  paidTraffic: string;
  setPaidTraffic: (value: string) => void;
  paidTrafficType: 'percent' | 'fixed';
  setPaidTrafficType: (value: 'percent' | 'fixed') => void;
  organicSubMode: 'manual' | 'automated';
  setOrganicSubMode: (value: 'manual' | 'automated') => void;
  organicApi: 'gemini' | 'chatgpt';
  setOrganicApi: (value: 'gemini' | 'chatgpt') => void;
  orgImpressions: string;
  setOrgImpressions: (value: string) => void;
  orgClicks: string;
  setOrgClicks: (value: string) => void;
  orgSales: string;
  setOrgSales: (value: string) => void;
  orgFreq: string;
  setOrgFreq: (value: string) => void;
  orgCostVideo: string;
  setOrgCostVideo: (value: string) => void;
  useUploadPostFree: boolean;
  setUseUploadPostFree: (value: boolean) => void;
  selectedKiePlan: string;
  setSelectedKiePlan: (value: string) => void;
  currentCredits: string;
  setCurrentCredits: (value: string) => void;
  selectedAiModel: string;
  setSelectedAiModel: (value: string) => void;
  videoDuration: string;
  setVideoDuration: (value: string) => void;
  
  // Paid Traffic Gateway Props
  paidTrafficGatewayBank: string;
  handlePaidTrafficGatewayBankChange: (value: string) => void;
  paidTrafficGatewayMethod: string;
  handlePaidTrafficGatewayMethodChange: (value: string) => void;
  paidTrafficGatewayInstallments: string;
  handlePaidTrafficGatewayInstallmentsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  paidTrafficGatewayFee: string;
  setPaidTrafficGatewayFee: (value: string) => void;
  paidTrafficGatewayFeeType: 'percent' | 'fixed';
  setPaidTrafficGatewayFeeType: (value: 'percent' | 'fixed') => void;
  paidTrafficGatewayFixedFee: string;
}

export const TrafficConfig: React.FC<TrafficConfigProps> = ({
  trafficMode,
  handleTrafficModeChange,
  paidTraffic,
  setPaidTraffic,
  paidTrafficType,
  setPaidTrafficType,
  paidTrafficGatewayBank,
  handlePaidTrafficGatewayBankChange,
  paidTrafficGatewayMethod,
  handlePaidTrafficGatewayMethodChange,
  paidTrafficGatewayInstallments,
  handlePaidTrafficGatewayInstallmentsChange,
  paidTrafficGatewayFee,
  setPaidTrafficGatewayFee,
  paidTrafficGatewayFeeType,
  setPaidTrafficGatewayFeeType,
  paidTrafficGatewayFixedFee
}) => {
  return (
    <>
       {/* Seletor de Tráfego: Pago vs Orgânico */}
        <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-lg border border-purple-100 mb-4 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                  variant={trafficMode === 'paid' ? 'default' : 'outline'}
                  onClick={() => handleTrafficModeChange('paid')}
                  className={trafficMode === 'paid' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
              >
                  Tráfego Pago
              </Button>
              <Button
                  variant={trafficMode === 'organic' ? 'default' : 'outline'}
                  onClick={() => handleTrafficModeChange('organic')}
                  className={trafficMode === 'organic' ? 'bg-[#fe2c55] hover:bg-[#d91c42] text-white' : ''}
              >
                  Tráfego Orgânico
              </Button>
          </div>
        </div>

       {/* Tráfego Pago (Original) */}
      {trafficMode === 'paid' && (
      <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
        <div className="flex items-center justify-between">
            <Label htmlFor="paidTraffic" className="text-sm font-semibold text-gray-800">
            Investimento em Tráfego
            </Label>
            <div className="flex items-center space-x-2">
                <Button
                    size="sm"
                    variant={paidTrafficType === 'percent' ? 'default' : 'outline'}
                    onClick={() => setPaidTrafficType('percent')}
                    className={`h-6 text-xs ${paidTrafficType === 'percent' ? 'bg-blue-600' : ''}`}
                >
                    %
                </Button>
                <Button
                    size="sm"
                    variant={paidTrafficType === 'fixed' ? 'default' : 'outline'}
                    onClick={() => setPaidTrafficType('fixed')}
                    className={`h-6 text-xs ${paidTrafficType === 'fixed' ? 'bg-blue-600' : ''}`}
                >
                    R$
                </Button>
            </div>
        </div>
        <div className="relative">
            {paidTrafficType === 'fixed' && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    R$
                </span>
            )}
          <Input
            id="paidTraffic"
            type="text"
            inputMode="decimal"
            value={paidTraffic}
            onChange={(e) => handleCurrencyChange(e, setPaidTraffic)}
            placeholder="0,00"
            className={paidTrafficType === 'fixed' ? 'pl-8' : ''}
          />
          {paidTrafficType === 'percent' && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    %
                </span>
            )}
        </div>
        
        <div className="mt-4 border-t pt-4">
            <Label className="text-sm font-semibold text-gray-800 mb-2 block">
              Forma de Pagamento do Tráfego
            </Label>
            <GatewayConfig
              gatewayBank={paidTrafficGatewayBank}
              handleGatewayBankChange={handlePaidTrafficGatewayBankChange}
              gatewayMethod={paidTrafficGatewayMethod}
              handleGatewayMethodChange={handlePaidTrafficGatewayMethodChange}
              gatewayInstallments={paidTrafficGatewayInstallments}
              handleGatewayInstallmentsChange={handlePaidTrafficGatewayInstallmentsChange}
              gatewayFee={paidTrafficGatewayFee}
              setGatewayFee={setPaidTrafficGatewayFee}
              gatewayFeeType={paidTrafficGatewayFeeType}
              setGatewayFeeType={setPaidTrafficGatewayFeeType}
              gatewayFixedFee={paidTrafficGatewayFixedFee}
              idPrefix="paidTrafficGateway"
            />
        </div>
      </div>
      )}

       {/* Configuração de Tráfego Orgânico */}
       {trafficMode === 'organic' && (
           <div className="space-y-4 bg-green-50 p-4 rounded-xl border border-green-100 animate-fadeIn">
               <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                   <TrendingUp className="w-4 h-4 text-green-600" />
                   Configuração de Tráfego Orgânico
               </h3>
               <p className="text-xs text-gray-600">Funcionalidade em desenvolvimento.</p>
           </div>
       )}
    </>
  );
};
