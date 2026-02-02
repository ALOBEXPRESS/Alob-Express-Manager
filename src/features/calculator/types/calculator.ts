export interface TaxRate {
  rate: number;
  name: string;
}

export interface TaxCategory {
  [key: string]: TaxRate;
}

export interface MercadoLivreTaxes {
  [key: string]: TaxCategory;
}

export interface Variation {
  id: string;
  name: string;
  cost: string;
  markup: string;
  manualPrice?: string;
}

export interface ProductVariationRecord {
  id?: string;
  name?: string;
  cost?: string | number;
  markup?: string | number;
  manualPrice?: string | number;
  suggestedPrice?: string | number;
  netRevenue?: string | number;
  margin?: string | number;
}

export interface ProductItem {
  id: string;
  name: string;
  imageUrl: string;
  sku?: string;
  sellingPrice?: string | number;
  costPrice?: string | number;
  supplierName?: string;
  marketplace?: string;
  netRevenue?: string | number;
  colorHex: string;
  marginStatus?: string;
  accountHolder?: string;
  accountType?: string;
  stockQuantity?: number;
  amazonPlan?: string;
  amazonCategory?: string;
  variations?: ProductVariationRecord[];
}

export interface CalculationResult {
  cost: number;
  packagingCost: string;
  supplierFeeCost: string;
  supplierGatewayCost: string;
  emergencyReserve: string;
  totalCost: number;
  suggestedPrice: string;
  suggestedPriceRaw: number;
  marketplaceFee: string;
  marketplaceCost: string;
  fixedFee: string;
  gatewayCost: string;
  gatewayFee: number;
  paidTrafficCost: string;
  paidTrafficFee: number;
  paidTrafficType: 'percent' | 'fixed';
  paidTrafficGatewayCost: string;
  adsCostPerSale: string;
  totalCPA: string;
  totalFees: string;
  netRevenue: string;
  actualMargin: string;
  recommendedMargin: number;
  taxDescription: string;
  manualPrice: number;
  discountApplied: number;
  increaseApplied: number;
  discountPercent: number;
  recommendedValue: string;
  competitor: number;
  breakevenCPA: string;
  reverseCR: string;
  marginStatus: string;
  returnRate: number;
  lossPerReturn: string;
}

export interface ShopeeCategory {
    name: string;
    avgCPC: number;
    avgCR: number;
}

export interface AiModel {
    name: string;
    costPerSec: number;
}

export interface KiePlan {
    name: string;
    price: number;
    credits: number;
}
