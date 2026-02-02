import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Truck } from 'lucide-react';
import { mercadoLivreTaxes } from '../../services/pricingService';

interface MercadoLivreConfigProps {
  marketplace: string;
  hasReputation: boolean;
  setHasReputation: (checked: boolean) => void;
  reputationLevel: string;
  setReputationLevel: (value: string) => void;
  adType: string;
  setAdType: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  meliPlus: boolean;
  setMeliPlus: (checked: boolean) => void;
  mlShippingCost: string;
  setMlShippingCost: (value: string) => void;
  handleFloatInput: (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MercadoLivreConfig: React.FC<MercadoLivreConfigProps> = ({
  marketplace,
  hasReputation,
  setHasReputation,
  reputationLevel,
  setReputationLevel,
  adType,
  setAdType,
  category,
  setCategory,
  meliPlus,
  setMeliPlus,
  mlShippingCost,
  setMlShippingCost,
  handleFloatInput
}) => {
  if (marketplace !== 'mercadolivre') return null;

  return (
    <>
      <div className={`flex items-center space-x-2 p-3 rounded-lg border mb-4 ${
        reputationLevel === 'negative' ? 'bg-red-50 border-red-100' :
        reputationLevel === 'average' ? 'bg-yellow-50 border-yellow-100' :
        reputationLevel === 'positive' ? 'bg-green-50 border-green-100' :
        'bg-blue-50 border-blue-100'
      }`}>
        <Checkbox 
          id="hasReputation" 
          checked={hasReputation}
          onCheckedChange={(checked) => setHasReputation(checked as boolean)}
        />
        <div className="space-y-0.5 w-full">
            <Label htmlFor="hasReputation" className="font-bold text-gray-800 cursor-pointer">
            Tenho Reputação no Mercado Livre
            </Label>
            
            {hasReputation && (
              <div className="mt-2 animate-fadeIn">
                 <Select value={reputationLevel} onValueChange={setReputationLevel}>
                    <SelectTrigger className="h-8 text-xs">
                       <SelectValue placeholder="Nível de Reputação" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="negative" className="text-red-600 font-bold">Negativa / Sem Cor (Vermelha)</SelectItem>
                       <SelectItem value="average" className="text-yellow-600 font-bold">Média (Amarela)</SelectItem>
                       <SelectItem value="positive" className="text-green-600 font-bold">Positiva (Verde)</SelectItem>
                       <SelectItem value="excellent" className="text-blue-600 font-bold">Mercado Líder / Platinum (Azul)</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
            )}

            {hasReputation ? (
                <p className={`text-[10px] mt-1 ${
                    reputationLevel === 'negative' ? 'text-red-600' :
                    reputationLevel === 'average' ? 'text-yellow-600' :
                    reputationLevel === 'positive' ? 'text-green-600' :
                    'text-blue-600'
                }`}>
                    {reputationLevel === 'negative' && "⚠️ Cuidado: Baixa exposição e bloqueios possíveis."}
                    {reputationLevel === 'average' && "⚠️ Atenção: Exposição média, busque melhorar."}
                    {reputationLevel === 'positive' && "✅ Ótimo: Boa exposição e confiança."}
                    {reputationLevel === 'excellent' && "💎 Excelente: Máxima exposição e benefícios de envios."}
                </p>
            ) : (
                <p className="text-[10px] text-gray-500">Sem reputação: Menor exposição, frete mais caro para o vendedor, limitações de envios</p>
            )}
        </div>
      </div>

      <div className="flex items-center space-x-2 p-3 rounded-lg border mb-4 bg-gray-50 border-gray-200">
        <Checkbox 
          id="meliPlus" 
          checked={meliPlus}
          onCheckedChange={(checked) => setMeliPlus(checked as boolean)}
        />
        <div className="space-y-0.5 w-full">
            <Label htmlFor="meliPlus" className="font-bold text-gray-800 cursor-pointer">
              Meli+
            </Label>
            <p className="text-[10px] text-gray-500">
              Comissão menor e frete com desconto quando disponível
            </p>
        </div>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="text-sm font-semibold text-gray-800">
          Tipo de Anúncio
        </Label>
        <Select value={adType} onValueChange={setAdType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gratis">Grátis (0% - Sem visibilidade)</SelectItem>
            <SelectItem value="classico">Clássico (11.5% a 14.5% + taxa fixa)</SelectItem>
            <SelectItem value="premium">Premium (16.5% a 19.5% + taxa fixa)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] text-gray-500 mt-1">
            Modalidades: Clássico (Visibilidade média) | Premium (Máxima visibilidade + 12x sem juros)
        </p>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="text-sm font-semibold text-gray-800">
          Categoria do Produto
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(mercadoLivreTaxes[adType] || {}).map(([key, value]) => {
              const adjustedRate = value.rate === 0
                ? 0
                : meliPlus
                  ? Math.max(9, value.rate - 2)
                  : value.rate;
              return (
              <SelectItem key={key} value={key}>
                {value.name} ({adjustedRate}%)
              </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mt-2">
         <p className="text-xs text-yellow-800 font-semibold mb-2">Prazos de Recebimento:</p>
         <ul className="text-[10px] text-yellow-700 space-y-1 mb-3">
            <li>• <strong>Sem Reputação / Iniciante:</strong> 10 a 28 dias após a entrega</li>
            <li>• <strong>Líder / Gold / Platinum:</strong> 5 dias após a entrega (ou na hora com Mercado Pago)</li>
         </ul>

         {/* Campo de Frete Mercado Livre */}
         <div className="mb-3 animate-fadeIn">
            <Label htmlFor="mlShippingCost" className="text-xs font-semibold text-gray-800 flex items-center gap-1">
               <Truck className="w-3 h-3" /> Custo de Frete (Pago por você)
            </Label>
            <div className="relative mt-1">
               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">R$</span>
               <Input
                  id="mlShippingCost"
                  type="text"
                  inputMode="decimal"
                  value={mlShippingCost}
                  onChange={(e) => handleFloatInput(setMlShippingCost)(e)}
                  className="pl-8 h-8 text-sm bg-white"
                  placeholder="0,00"
               />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
               *Obrigatório para produtos &gt; R$ 79 (Frete Grátis)
            </p>
         </div>

         <p className="text-xs text-yellow-800 font-semibold mb-2">Regras de Custo Fixo (Atualizado):</p>
         <ul className="text-[10px] text-yellow-700 space-y-1">
            <li>• &lt; R$ 12,50: Metade do preço de venda</li>
            <li>• R$ 12,50 - R$ 79: R$ 6,00</li>
            <li>• &gt; R$ 79: Isento de taxa fixa</li>
         </ul>
      </div>
    </>
  );
};
