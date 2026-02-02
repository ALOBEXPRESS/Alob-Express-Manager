import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { amazonCategories } from '../../services/amazonCategories';
import type { AmazonPlanType } from '../../services/amazonCategories';

interface AmazonConfigProps {
  marketplace: string;
  amazonPlan: AmazonPlanType;
  setAmazonPlan: (plan: AmazonPlanType) => void;
  amazonCategory: string;
  setAmazonCategory: (category: string) => void;
}

export const AmazonConfig: React.FC<AmazonConfigProps> = ({
  marketplace,
  amazonPlan,
  setAmazonPlan,
  amazonCategory,
  setAmazonCategory
}) => {
  if (marketplace !== 'amazon') return null;

  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
        <Label className="text-sm font-semibold text-gray-800">
          Plano Amazon
        </Label>
        <Select value={amazonPlan} onValueChange={setAmazonPlan}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual (R$ 2,00/item)</SelectItem>
            <SelectItem value="profissional">Profissional (R$ 19,00/mês)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
        <Label className="text-sm font-semibold text-gray-800">
          Categoria Amazon
        </Label>
        <Select value={amazonCategory} onValueChange={setAmazonCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(amazonCategories).map(([key, cat]) => (
              <SelectItem key={key} value={key}>
                {cat.name} ({cat.commission}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
