import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TrendingUp, AlertCircle } from 'lucide-react';
import { AI_MODELS, KIE_PLANS } from '../../services/pricingService';
import { GatewayConfig } from './GatewayConfig';
import { handleCurrencyChange } from '../../utils/currency';

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
  organicSubMode,
  setOrganicSubMode,
  organicApi,
  setOrganicApi,
  orgImpressions,
  setOrgImpressions,
  orgClicks,
  setOrgClicks,
  orgSales,
  setOrgSales,
  orgFreq,
  setOrgFreq,
  orgCostVideo,
  setOrgCostVideo,
  useUploadPostFree,
  setUseUploadPostFree,
  selectedKiePlan,
  setSelectedKiePlan,
  currentCredits,
  setCurrentCredits,
  selectedAiModel,
  setSelectedAiModel,
  videoDuration,
  setVideoDuration,
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

               {/* Sub-seletor Manual vs Automatizado */}
               <div className="flex gap-2 mb-2">
                   <Button
                       size="sm"
                       variant={organicSubMode === 'manual' ? 'default' : 'outline'}
                       onClick={() => setOrganicSubMode('manual')}
                       className={`flex-1 text-xs ${organicSubMode === 'manual' ? 'bg-green-600' : ''}`}
                   >
                       Forma Manual (MindVideo + n8n)
                   </Button>
                   <Button
                       size="sm"
                       variant={organicSubMode === 'automated' ? 'default' : 'outline'}
                       onClick={() => setOrganicSubMode('automated')}
                       className={`flex-1 text-xs ${organicSubMode === 'automated' ? 'bg-blue-600' : ''}`}
                   >
                       Forma Automatizada (Kie.ai + n8n)
                   </Button>
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                       <Label className="text-xs text-gray-600 mb-1 block">API de Inteligência Artificial</Label>
                       <div className="flex gap-2">
                           <Button
                               size="sm"
                               variant={organicApi === 'gemini' ? 'default' : 'outline'}
                               onClick={() => setOrganicApi('gemini')}
                               className={`flex-1 text-xs ${organicApi === 'gemini' ? 'bg-indigo-600' : ''}`}
                           >
                               Gemini (Grátis)
                           </Button>
                           <Button
                               size="sm"
                               variant={organicApi === 'chatgpt' ? 'default' : 'outline'}
                               onClick={() => setOrganicApi('chatgpt')}
                               className={`flex-1 text-xs ${organicApi === 'chatgpt' ? 'bg-[#fe2c55] text-white hover:bg-[#d91c42]' : ''}`}
                           >
                               ChatGPT (Pago)
                           </Button>
                       </div>
                       {organicApi === 'chatgpt' && (
                           <p className="text-[10px] text-gray-500 mt-1">
                               Inclui: OpenAI <a href="https://openai.com/api/pricing/" target="_blank" className="text-blue-600 underline">Ver custos</a>
                           </p>
                       )}
                       {organicApi === 'gemini' && (
                           <p className="text-[10px] text-gray-500 mt-1">
                               Inclui: Gemini Pro, Gemini Flash, etc. <a href="https://ai.google.dev/pricing" target="_blank" className="text-blue-600 underline">Ver limitações</a>
                           </p>
                       )}
                   </div>

                   <div className="col-span-2 md:col-span-1">
                       <Label className="text-xs text-gray-600">Impressão</Label>
                       <div className="group relative inline-block ml-1">
                           <AlertCircle className="w-3 h-3 text-gray-400 inline cursor-help" />
                           <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-32 p-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                               Total de visualizações/impressões
                           </div>
                       </div>
                       <Input
                           type="text"
                           inputMode="decimal"
                           value={orgImpressions}
                           onChange={(e) => setOrgImpressions(e.target.value.replace(/\D/g, ''))} // Integer only usually
                           placeholder="0"
                           className="h-8 bg-white"
                       />
                   </div>
                   <div className="col-span-2 md:col-span-1">
                       <Label className="text-xs text-gray-600">Cliques</Label>
                       <div className="group relative inline-block ml-1">
                           <AlertCircle className="w-3 h-3 text-gray-400 inline cursor-help" />
                           <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-32 p-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                               Total de cliques no link
                           </div>
                       </div>
                       <Input
                           type="text"
                           inputMode="decimal"
                           value={orgClicks}
                           onChange={(e) => setOrgClicks(e.target.value.replace(/\D/g, ''))}
                           placeholder="0"
                           className="h-8 bg-white"
                       />
                   </div>

                   <div className="col-span-2 md:col-span-1">
                       <Label className="text-xs text-gray-600">CTR (Automático %)</Label>
                       <Input
                           value={orgImpressions && orgClicks && parseFloat(orgImpressions) > 0 ? ((parseFloat(orgClicks) / parseFloat(orgImpressions)) * 100).toFixed(2) : '0.00'}
                           readOnly
                           className="h-8 bg-gray-100 text-gray-600"
                       />
                   </div>
                   <div className="col-span-2 md:col-span-1">
                       <Label className="text-xs text-gray-600">Vendas (Total)</Label>
                       <Input
                           type="text"
                           inputMode="decimal"
                           value={orgSales}
                           onChange={(e) => setOrgSales(e.target.value.replace(/\D/g, ''))}
                           placeholder="0"
                           className="h-8 bg-white"
                       />
                   </div>
                   
                   <div className="col-span-2">
                       <Label className="text-xs text-gray-600">Frequência de postagem (vídeos/dia)</Label>
                       <Input
                           type="text"
                           inputMode="decimal"
                           value={orgFreq}
                           onChange={(e) => setOrgFreq(e.target.value.replace(/[^\d.]/g, ''))} // Maybe allow decimals for frequency? 1.5/day?
                           placeholder="1"
                           className="h-8 bg-white"
                       />
                   </div>

                   {organicSubMode === 'automated' && (
                       <>
                           <div className="col-span-2">
                               <Label className="text-xs text-gray-600">Plano Kie.ai</Label>
                               <Select value={selectedKiePlan} onValueChange={setSelectedKiePlan}>
                                   <SelectTrigger className="h-8 bg-white">
                                       <SelectValue placeholder="Selecione o plano" />
                                   </SelectTrigger>
                                   <SelectContent>
                                       {Object.entries(KIE_PLANS).map(([key, plan]) => (
                                           <SelectItem key={key} value={key}>{plan.name}</SelectItem>
                                       ))}
                                   </SelectContent>
                               </Select>
                           </div>
                           <div className="col-span-2 md:col-span-1">
                               <Label className="text-xs text-gray-600">Créditos Atuais</Label>
                               <Input
                                   type="number"
                                   value={currentCredits}
                                   onChange={(e) => setCurrentCredits(e.target.value)}
                                   className="h-8 bg-white"
                               />
                           </div>
                           <div className="col-span-2 md:col-span-1">
                               <Label className="text-xs text-gray-600">Duração Vídeo (s)</Label>
                               <Input
                                   type="number"
                                   value={videoDuration}
                                   onChange={(e) => setVideoDuration(e.target.value)}
                                   className="h-8 bg-white"
                               />
                           </div>
                           <div className="col-span-2">
                               <Label className="text-xs text-gray-600">Modelo IA</Label>
                               <Select value={selectedAiModel} onValueChange={setSelectedAiModel}>
                                   <SelectTrigger className="h-8 bg-white">
                                       <SelectValue placeholder="Selecione o modelo" />
                                   </SelectTrigger>
                                   <SelectContent>
                                       {Object.entries(AI_MODELS).map(([key, model]) => (
                                           <SelectItem key={key} value={key}>{model.name} (${model.costPerSec}/s)</SelectItem>
                                       ))}
                                   </SelectContent>
                               </Select>
                           </div>
                           <div className="col-span-2 flex items-center space-x-2">
                               <Checkbox 
                                   id="useUploadPostFree" 
                                   checked={useUploadPostFree}
                                   onCheckedChange={(checked) => setUseUploadPostFree(checked as boolean)}
                               />
                               <Label htmlFor="useUploadPostFree" className="text-xs text-gray-600">
                                   Usar Upload/Post Grátis?
                               </Label>
                           </div>
                       </>
                   )}

                   {organicSubMode === 'manual' && organicApi === 'chatgpt' && (
                       <div className="col-span-2">
                           <Label className="text-xs text-gray-600">Custo por vídeo (ChatGPT API)</Label>
                           <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-xs">
                                    $
                                </span>
                               <Input
                                   type="text"
                                   inputMode="decimal"
                                   value={orgCostVideo}
                                   onChange={(e) => handleCurrencyChange(e, setOrgCostVideo)}
                                   placeholder="0,00"
                                   className="h-8 bg-white pl-6"
                               />
                           </div>
                       </div>
                   )}
               </div>
           </div>
       )}
    </>
  );
};
