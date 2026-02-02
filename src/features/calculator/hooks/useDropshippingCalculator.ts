import { useState, useMemo } from 'react';
import type { Variation } from '../types/calculator';
import { calculateMetrics, shopeeCategories } from '../services/pricingService';
import { handleCurrencyChange, parseCurrency } from '../utils/currency';

export const useDropshippingCalculator = () => {
  const [productName, setProductName] = useState('');
  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [variationName, setVariationName] = useState('');
  const [variationCost, setVariationCost] = useState('');
  const [variationMarkup, setVariationMarkup] = useState('1,5');

  const [supplierName, setSupplierName] = useState('');
  const [supplierFixedFee, setSupplierFixedFee] = useState('0');
  const [costPrice, setCostPrice] = useState('');
  const [manualSellingPrice, setManualSellingPrice] = useState('');
  const [packagingCost, setPackagingCost] = useState('0');
  const [supplierFeePercent, setSupplierFeePercent] = useState('0');
  const [supplierFeeType, setSupplierFeeType] = useState<'percent' | 'fixed'>('percent');
  const [supplierGatewayFee, setSupplierGatewayFee] = useState('0');
  const [supplierGatewayFixedFee, setSupplierGatewayFixedFee] = useState('0');
  const [supplierGatewayFeeType, setSupplierGatewayFeeType] = useState<'percent' | 'fixed'>('fixed');
  const [gatewayFee, setGatewayFee] = useState('0');
  const [gatewayFixedFee, setGatewayFixedFee] = useState('0');
  const [gatewayFeeType, setGatewayFeeType] = useState<'percent' | 'fixed'>('fixed');
  const [markupMultiplier, setMarkupMultiplier] = useState('1,5');
  const [extraCommission, setExtraCommission] = useState('');
  
  const [marketplace, setMarketplace] = useState('mercadolivre');
  const [tiktokCommission, setTiktokCommission] = useState('6');
  const [wordpressShipping, setWordpressShipping] = useState('0');
  const [amazonPlan, setAmazonPlan] = useState<'individual' | 'profissional'>('individual');
  const [amazonCategory, setAmazonCategory] = useState('eletronicos');
  const [competitorPrice, setCompetitorPrice] = useState('');
  const [competitorMarkup, setCompetitorMarkup] = useState('1,10');
  
  const [category, setCategory] = useState('eletronicos');
  const [shippingOption, setShippingOption] = useState('with'); // Para Shopee
  const [shopeeSellerType, setShopeeSellerType] = useState<'cpf' | 'cnpj'>('cnpj');
  const [accountType, setAccountType] = useState<'cpf' | 'cnpj'>('cnpj'); // Generic account type for all marketplaces
  const [accountHolder, setAccountHolder] = useState('');
  const [adType, setAdType] = useState('classico'); // Para Mercado Livre
  const [enjoeiAdType, setEnjoeiAdType] = useState('classico'); // Para Enjoei
  const [enjoeiInactivityMonths, setEnjoeiInactivityMonths] = useState('0'); // Para Enjoei
  const [mlShippingCost, setMlShippingCost] = useState('0'); // Custo de Frete (Pago pelo vendedor)
  const [hasReputation, setHasReputation] = useState(false);
  const [reputationLevel, setReputationLevel] = useState('positive'); // 'negative' | 'average' | 'positive' | 'excellent'
  const [meliPlus, setMeliPlus] = useState(false);

  const [trafficMode, setTrafficMode] = useState<'paid' | 'organic'>('organic');
  const [organicSubMode, setOrganicSubMode] = useState<'manual' | 'automated'>('manual');
  
  // Organic Inputs
  const [orgFreq, setOrgFreq] = useState('');
  const [orgImpressions, setOrgImpressions] = useState('');
  const [orgClicks, setOrgClicks] = useState('');
  const [orgSales, setOrgSales] = useState('');
  
  const [orgCostVideo, setOrgCostVideo] = useState(''); // Only used if ChatGPT
  const [orgKieCost, setOrgKieCost] = useState(''); // Deprecated
  const [orgKieCredits, setOrgKieCredits] = useState(''); // Deprecated
  
  // New AI and Plan States
  const [selectedAiModel, setSelectedAiModel] = useState('sora_2'); 
  const [selectedKiePlan, setSelectedKiePlan] = useState('5');
  const [currentCredits, setCurrentCredits] = useState('1000');
  const [videoDuration, setVideoDuration] = useState('10');
  
  // Organic Options
  const [organicApi, setOrganicApi] = useState<'gemini' | 'chatgpt'>('gemini');
  const [useUploadPostFree, setUseUploadPostFree] = useState(true);

  const [competitorDiscount, setCompetitorDiscount] = useState('1,00');

  const [productImage, setProductImage] = useState('');
  const [productSku, setProductSku] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  // New States for Mode and Logic
  const [operationMode, setOperationMode] = useState('dropshipping'); // Default 'dropshipping'
  const [deliveryMode, setDeliveryMode] = useState('mercado_envios'); // 'tiktok' | 'shopee_envios' | 'mercado_envios' | 'aliexpress'
  const [emergencyReserve, setEmergencyReserve] = useState('3.000,00');
  const [workingCapital, setWorkingCapital] = useState('500,00');
  const [returnRate, setReturnRate] = useState('33,33'); // Default 33,33%
  const [paidTraffic, setPaidTraffic] = useState('0'); // New Paid Traffic State
  const [paidTrafficType, setPaidTrafficType] = useState<'percent' | 'fixed'>('percent');

  // Payment Gateway Configuration
  const [gatewayBank, setGatewayBank] = useState('picpay'); // Default to PicPay
  const [gatewayMethod, setGatewayMethod] = useState('pix');
  const [gatewayInstallments, setGatewayInstallments] = useState('1');

  // Paid Traffic Gateway Configuration
  const [paidTrafficGatewayBank, setPaidTrafficGatewayBank] = useState('picpay');
  const [paidTrafficGatewayMethod, setPaidTrafficGatewayMethod] = useState('credit');
  const [paidTrafficGatewayInstallments, setPaidTrafficGatewayInstallments] = useState('1');
  const [paidTrafficGatewayFee, setPaidTrafficGatewayFee] = useState('0');
  const [paidTrafficGatewayFixedFee, setPaidTrafficGatewayFixedFee] = useState('0');
  const [paidTrafficGatewayFeeType, setPaidTrafficGatewayFeeType] = useState<'percent' | 'fixed'>('fixed');


  const [useShopeeAds, setUseShopeeAds] = useState(false);
  const [adsCPC, setAdsCPC] = useState('');
  const [dailyBudget, setDailyBudget] = useState('10');
  const [salesQuantity, setSalesQuantity] = useState('');

  // Helper for mobile float inputs (comma/dot)
  const handleFloatInput = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleCurrencyChange(e, setter);
  };

  const getDeliveryModeForMarketplace = (mkt: string) => {
    switch (mkt) {
      case 'mercadolivre': return 'mercado_envios';
      case 'shopee': return 'shopee_envios';
      case 'wordpress': return 'aliexpress';
      case 'tiktok': return 'tiktok';
      default: return 'shopee_envios';
    }
  };

  const calculateGatewayFee = (bank: string, method: string, installmentsStr: string, isPaidTraffic: boolean = false) => {
    let fee = 0;
    let fixed = 0;
    const installments = parseInt(installmentsStr) || 1;

    // Paid Traffic Specific Rules
    if (isPaidTraffic) {
        if (method === 'pix') return { fee: 0, fixed: 0 };
    }

    if (['picpay', 'nubank', 'bradesco'].includes(bank)) {
        // Default values
        fee = 0;
        fixed = 0;

        if (bank === 'picpay') {
            if (method === 'credit' || method === 'credit_sight' || method === 'credit_parc') {
                fee = 0.99;
                fixed = 0;
            } else if (method === 'pix') {
                fee = 0;
                fixed = 0;
            } else if (method === 'debit') {
                fee = 1.99;
                fixed = 0;
            }
        } else if (bank === 'nubank') {
             // Nubank: Pix com crédito (8.99% a.m.) -> Changed to min 3.99% a.m.
             if (method === 'credit' || method === 'credit_sight' || method === 'credit_parc') {
                 const effectiveInstallments = method === 'credit_sight' ? 1 : installments;
                 fee = 3.99 * effectiveInstallments; // Simple multiplication for now
             } else if (method === 'pix') {
                 fee = 0;
             } else if (method === 'debit') {
                 fee = 0.89;
             }
        } else if (bank === 'bradesco') {
             // Bradesco: Cartão de Crédito (Standard)
             if (method === 'credit' || method === 'credit_sight' || method === 'credit_parc') {
                 const effectiveInstallments = method === 'credit_sight' ? 1 : installments;
                 fee = 3.99 * effectiveInstallments;
             } else if (method === 'pix') {
                 fee = 0;
             } else if (method === 'debit') {
                 fee = 1.99;
             }
        }
    } else if (bank === 'mercadopago') {
      switch (method) {
        case 'pix': fee = 0.49; break;
        case 'credit': fee = 4.99; break;
        case 'debit': fee = 1.99; break;
        default: fee = 4.99;
      }
    } else if (bank === 'paypal') {
        // Nacional: 4.79% + R$ 0.60
        fee = 4.79; 
        fixed = 0.60;
        if (installments > 1) {
            fee += (installments * 1.92);
        }
    } else if (bank === 'stripe') {
        // 3.99% + R$ 0.39
        fee = 3.99;
        fixed = 0.39;
    }
    return { fee, fixed };
  };

  const updateGatewayFees = (bank: string, method: string, installments: string) => {
    const { fee, fixed } = calculateGatewayFee(bank, method, installments, false);
    if (bank === 'picpay' && method === 'credit') {
      setGatewayFeeType('fixed');
      setGatewayFee('1,00');
      setGatewayFixedFee('0');
      return;
    }
    if (bank === 'picpay' && method === 'pix') {
      setGatewayFeeType('percent');
      setGatewayFee('0');
      setGatewayFixedFee('0');
      return;
    }
    setGatewayFee(fee.toString());
    setGatewayFixedFee(fixed.toString());
  };

  const handleGatewayBankChange = (bank: string) => {
    setGatewayBank(bank);
    // If switching to PicPay/Nubank/Bradesco, default to Credit
    const defaultMethod = bank === 'picpay'
      ? 'pix'
      : ['nubank', 'bradesco', 'paypal', 'stripe'].includes(bank)
        ? 'credit'
        : 'pix';
    setGatewayMethod(defaultMethod);
    updateGatewayFees(bank, defaultMethod, gatewayInstallments);
  };

  const handleGatewayMethodChange = (method: string) => {
    setGatewayMethod(method);
    // If switching to Credit, default to 1 installment if not set (already '1' in state)
    updateGatewayFees(gatewayBank, method, gatewayInstallments);
  };

  const handleGatewayInstallmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGatewayInstallments(val);
    updateGatewayFees(gatewayBank, gatewayMethod, val);
  };

  const updatePaidTrafficGatewayFees = (bank: string, method: string, installments: string) => {
    const { fee, fixed } = calculateGatewayFee(bank, method, installments, true);
    if (bank === 'picpay' && method === 'credit') {
      setPaidTrafficGatewayFeeType('fixed');
      setPaidTrafficGatewayFee('1,00');
      setPaidTrafficGatewayFixedFee('0');
      return;
    }
    if (bank === 'picpay' && method === 'pix') {
      setPaidTrafficGatewayFeeType('percent');
      setPaidTrafficGatewayFee('0');
      setPaidTrafficGatewayFixedFee('0');
      return;
    }
    setPaidTrafficGatewayFee(fee.toString());
    setPaidTrafficGatewayFixedFee(fixed.toString());
  };

  const handlePaidTrafficGatewayBankChange = (bank: string) => {
    setPaidTrafficGatewayBank(bank);
    // Default to Credit for Paid Traffic banks usually
    const defaultMethod = ['nubank', 'bradesco', 'paypal', 'stripe'].includes(bank) ? 'credit' : 'pix';
    setPaidTrafficGatewayMethod(defaultMethod);
    updatePaidTrafficGatewayFees(bank, defaultMethod, paidTrafficGatewayInstallments);
  };

  const handlePaidTrafficGatewayMethodChange = (method: string) => {
    setPaidTrafficGatewayMethod(method);
    updatePaidTrafficGatewayFees(paidTrafficGatewayBank, method, paidTrafficGatewayInstallments);
  };

  const handlePaidTrafficGatewayInstallmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPaidTrafficGatewayInstallments(val);
    updatePaidTrafficGatewayFees(paidTrafficGatewayBank, paidTrafficGatewayMethod, val);
  };

  const handleSupplierChange = (name: string) => {
    setSupplierName(name);
    if (name === 'Dogama') {
      setSupplierFeePercent('6');
      setSupplierFixedFee('1,00');
    } else if (name === 'Yeizidrop' || name === 'Dsers') {
      setSupplierFeePercent('0');
      setSupplierFixedFee('0');
    } else {
      setSupplierFeePercent('0');
      setSupplierFixedFee('0');
    }
  };

  const handleOperationModeChange = (mode: string) => {
    setOperationMode(mode);
    if (mode === 'armazem_alob') {
      setDeliveryMode(getDeliveryModeForMarketplace(marketplace));
      
      // Auto-select PicPay and Pix for "Estoque Próprio"
      setGatewayBank('picpay');
      setGatewayMethod('pix');
      updateGatewayFees('picpay', 'pix', gatewayInstallments);
      setPackagingCost('2,00');
    }
    if (mode === 'dropshipping') {
      setPackagingCost('0');
    }
  };

  const handleMarketplaceChange = (mkt: string) => {
    setMarketplace(mkt);
    if (operationMode === 'armazem_alob') {
      setDeliveryMode(getDeliveryModeForMarketplace(mkt));
    }
  };

  const handleTrafficModeChange = (mode: 'paid' | 'organic') => {
      setTrafficMode(mode);
      if (mode === 'paid') {
          // Defaults for Paid Traffic: PicPay, Credit, 1 Installment
          const defaultBank = 'picpay';
          const defaultMethod = 'credit';
          const defaultInstallments = '1';
          
          setPaidTrafficGatewayBank(defaultBank);
          setPaidTrafficGatewayMethod(defaultMethod);
          setPaidTrafficGatewayInstallments(defaultInstallments);
          
          updatePaidTrafficGatewayFees(defaultBank, defaultMethod, defaultInstallments);
      }
  };

  const handleShopeeAdsChange = (checked: boolean) => {
      setUseShopeeAds(checked);
      if (checked) {
          if (!adsCPC) setAdsCPC('0.40');
          if (!salesQuantity) setSalesQuantity('10');
      }
  };

  const handleShopeeCategoryChange = (cat: string) => {
    setCategory(cat);
    const catData = shopeeCategories[cat];
    if (catData) {
       setAdsCPC(catData.avgCPC.toString());
    }
  };

  const addVariation = () => {
    const effectiveMarkup = variationMarkup || markupMultiplier;
    
    if (variationName && variationCost && effectiveMarkup) {
      setVariations([...variations, {
        id: Date.now().toString(),
        name: variationName,
        cost: variationCost,
        markup: effectiveMarkup
      }]);
      setVariationName('');
      setVariationCost('');
      setVariationMarkup('');
    }
  };

  const removeVariation = (id: string) => {
    setVariations(variations.filter(v => v.id !== id));
  };

  const updateVariation = (id: string, updates: Partial<Variation>) => {
    setVariations(variations.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const calculations = useMemo(() => {
    const cost = parseCurrency(costPrice) || 0;
    const sFixed = parseCurrency(supplierFixedFee) || 0;
    const pkg = operationMode === 'dropshipping' ? 0 : (parseCurrency(packagingCost) || 0);
    const supplierFee = supplierFeeType === 'fixed' ? sFixed : (parseCurrency(supplierFeePercent) || 0);
    if (cost === 0 && !hasVariations) return null;

    const markupMult = parseCurrency(markupMultiplier);
    const extra = parseCurrency(extraCommission) || 0;
    const cpc = parseCurrency(adsCPC) || 0;
    const budget = parseCurrency(dailyBudget) || 10;
    const sales = parseCurrency(salesQuantity) || 0;
    const gatewayFeeValue = parseCurrency(gatewayFee) || 0;
    const manual = parseCurrency(manualSellingPrice) || 0;
    const competitor = parseCurrency(competitorPrice) || 0;
    const compMarkup = parseCurrency(competitorMarkup) || 1.1;
    const tiktokComm = parseCurrency(tiktokCommission) || 6;
    const wpShipping = parseCurrency(wordpressShipping) || 0;
    const emergency = operationMode === 'dropshipping' ? (parseCurrency(emergencyReserve) || 0) : 0;
    const rRate = parseCurrency(returnRate) || 33.33;
    // Only include paid traffic cost if Traffic Mode is 'paid'
    const pTraffic = trafficMode === 'paid' ? (parseCurrency(paidTraffic) || 0) : 0;
    const mlShipping = parseCurrency(mlShippingCost) || 0;
    const gatewayFixedBase = parseCurrency(gatewayFixedFee) || 0;
    const gatewayPercent = gatewayFeeType === 'percent' ? gatewayFeeValue : 0;
    const gatewayFixed = (gatewayFeeType === 'fixed' ? gatewayFeeValue : 0) + gatewayFixedBase;
    const gatewayOverride = gatewayBank === 'picpay' && gatewayMethod === 'pix';
    const gatewayPercentFinal = gatewayOverride ? 0 : gatewayPercent;
    const gatewayFixedFinal = gatewayOverride ? 0 : gatewayFixed;
    const ptGatewayFeeValue = trafficMode === 'paid' ? (parseCurrency(paidTrafficGatewayFee) || 0) : 0;
    const ptGatewayFixedBase = trafficMode === 'paid' ? (parseCurrency(paidTrafficGatewayFixedFee) || 0) : 0;
    const ptGatewayPercent = paidTrafficGatewayFeeType === 'percent' ? ptGatewayFeeValue : 0;
    const ptGatewayFixed = (paidTrafficGatewayFeeType === 'fixed' ? ptGatewayFeeValue : 0) + ptGatewayFixedBase;
    const ptGatewayOverride = paidTrafficGatewayBank === 'picpay' && paidTrafficGatewayMethod === 'pix';
    const ptGatewayPercentFinal = ptGatewayOverride ? 0 : ptGatewayPercent;
    const ptGatewayFixedFinal = ptGatewayOverride ? 0 : ptGatewayFixed;
    const enjoeiType = enjoeiAdType;
    const enjoeiInactivity = parseCurrency(enjoeiInactivityMonths) || 0;
    const supplierGatewayFeeValue = parseCurrency(supplierGatewayFee) || 0;
    const supplierGatewayFixedBase = parseCurrency(supplierGatewayFixedFee) || 0;
    const supplierGatewayPercent = supplierGatewayFeeType === 'percent' ? supplierGatewayFeeValue : 0;
    const supplierGatewayFixed = supplierGatewayFeeType === 'fixed' ? supplierGatewayFixedBase : 0;

    return calculateMetrics(
        cost, pkg, supplierFee, markupMult, marketplace, category, adType, shippingOption, shopeeSellerType, extra, useShopeeAds, cpc, budget, sales, gatewayPercentFinal, manual, competitor, compMarkup, tiktokComm, wpShipping, emergency, rRate, pTraffic, mlShipping, paidTrafficType, gatewayFixedFinal, ptGatewayPercentFinal, ptGatewayFixedFinal, enjoeiType, enjoeiInactivity, gatewayBank, gatewayMethod, paidTrafficGatewayBank, paidTrafficGatewayMethod, meliPlus, supplierFeeType, supplierGatewayPercent, supplierGatewayFixed, supplierGatewayFeeType
    );
  }, [costPrice, packagingCost, supplierFixedFee, supplierFeePercent, markupMultiplier, extraCommission, adsCPC, dailyBudget, salesQuantity, gatewayFee, gatewayFixedFee, gatewayFeeType, manualSellingPrice, competitorPrice, competitorMarkup, tiktokCommission, wordpressShipping, operationMode, emergencyReserve, returnRate, paidTraffic, mlShippingCost, hasVariations, marketplace, category, adType, shippingOption, shopeeSellerType, useShopeeAds, paidTrafficType, paidTrafficGatewayFee, paidTrafficGatewayFixedFee, paidTrafficGatewayFeeType, enjoeiAdType, enjoeiInactivityMonths, trafficMode, gatewayBank, gatewayMethod, paidTrafficGatewayBank, paidTrafficGatewayMethod, meliPlus, supplierGatewayFee, supplierGatewayFixedFee, supplierGatewayFeeType, supplierFeeType]);

  const variationCalculations = useMemo(() => {
      const sFixed = parseCurrency(supplierFixedFee) || 0;
      const pkg = operationMode === 'dropshipping' ? sFixed : (parseCurrency(packagingCost) || 0);
      const supplierFee = supplierFeeType === 'fixed' ? sFixed : (parseCurrency(supplierFeePercent) || 0);
      const extra = parseCurrency(extraCommission) || 0;
      const cpc = parseCurrency(adsCPC) || 0;
      const budget = parseCurrency(dailyBudget) || 10;
      const sales = parseCurrency(salesQuantity) || 0;
      const gatewayFeeValue = parseCurrency(gatewayFee) || 0;
      const competitor = parseCurrency(competitorPrice) || 0;
      const compMarkup = parseCurrency(competitorMarkup) || 1.1;
      const tiktokComm = parseCurrency(tiktokCommission) || 6;
      const wpShipping = parseCurrency(wordpressShipping) || 0;
      const emergency = operationMode === 'dropshipping' ? (parseCurrency(emergencyReserve) || 0) : 0;
      const rRate = parseCurrency(returnRate) || 33.33;
      // Only include paid traffic cost if Traffic Mode is 'paid'
      const pTraffic = trafficMode === 'paid' ? (parseCurrency(paidTraffic) || 0) : 0;
      const mlShipping = parseCurrency(mlShippingCost) || 0;
      const gatewayFixedBase = parseCurrency(gatewayFixedFee) || 0;
      const gatewayPercent = gatewayFeeType === 'percent' ? gatewayFeeValue : 0;
      const gatewayFixed = (gatewayFeeType === 'fixed' ? gatewayFeeValue : 0) + gatewayFixedBase;
      const gatewayOverride = gatewayBank === 'picpay' && gatewayMethod === 'pix';
      const gatewayPercentFinal = gatewayOverride ? 0 : gatewayPercent;
      const gatewayFixedFinal = gatewayOverride ? 0 : gatewayFixed;
      const ptGatewayFeeValue = trafficMode === 'paid' ? (parseCurrency(paidTrafficGatewayFee) || 0) : 0;
      const ptGatewayFixedBase = trafficMode === 'paid' ? (parseCurrency(paidTrafficGatewayFixedFee) || 0) : 0;
      const ptGatewayPercent = paidTrafficGatewayFeeType === 'percent' ? ptGatewayFeeValue : 0;
      const ptGatewayFixed = (paidTrafficGatewayFeeType === 'fixed' ? ptGatewayFeeValue : 0) + ptGatewayFixedBase;
      const ptGatewayOverride = paidTrafficGatewayBank === 'picpay' && paidTrafficGatewayMethod === 'pix';
      const ptGatewayPercentFinal = ptGatewayOverride ? 0 : ptGatewayPercent;
      const ptGatewayFixedFinal = ptGatewayOverride ? 0 : ptGatewayFixed;
      const enjoeiType = enjoeiAdType;
      const enjoeiInactivity = parseCurrency(enjoeiInactivityMonths) || 0;
      const supplierGatewayFeeValue = parseCurrency(supplierGatewayFee) || 0;
      const supplierGatewayFixedBase = parseCurrency(supplierGatewayFixedFee) || 0;
      const supplierGatewayPercent = supplierGatewayFeeType === 'percent' ? supplierGatewayFeeValue : 0;
      const supplierGatewayFixed = supplierGatewayFeeType === 'fixed' ? supplierGatewayFixedBase : 0;

      return variations.map(v => {
          const vCost = parseCurrency(v.cost) || 0;
          const vMarkup = parseCurrency(v.markup) || 1.5; 
          const vManualPrice = v.manualPrice ? (parseCurrency(v.manualPrice) || 0) : 0;
          
          return {
              ...v,
              metrics: calculateMetrics(
                  vCost, pkg, supplierFee, vMarkup, marketplace, category, adType, shippingOption, shopeeSellerType, extra, useShopeeAds, cpc, budget, sales, gatewayPercentFinal, vManualPrice, competitor, compMarkup, tiktokComm, wpShipping, emergency, rRate, pTraffic, mlShipping, paidTrafficType, gatewayFixedFinal, ptGatewayPercentFinal, ptGatewayFixedFinal, enjoeiType, enjoeiInactivity, gatewayBank, gatewayMethod, paidTrafficGatewayBank, paidTrafficGatewayMethod, meliPlus, supplierFeeType, supplierGatewayPercent, supplierGatewayFixed, supplierGatewayFeeType
              )
          };
      });
  }, [variations, packagingCost, supplierFixedFee, supplierFeePercent, marketplace, category, shippingOption, shopeeSellerType, adType, extraCommission, useShopeeAds, adsCPC, dailyBudget, salesQuantity, gatewayFee, gatewayFixedFee, gatewayFeeType, competitorPrice, competitorMarkup, tiktokCommission, wordpressShipping, operationMode, emergencyReserve, returnRate, paidTraffic, mlShippingCost, paidTrafficType, paidTrafficGatewayFee, paidTrafficGatewayFixedFee, paidTrafficGatewayFeeType, enjoeiAdType, enjoeiInactivityMonths, trafficMode, gatewayBank, gatewayMethod, paidTrafficGatewayBank, paidTrafficGatewayMethod, meliPlus, supplierGatewayFee, supplierGatewayFixedFee, supplierGatewayFeeType, supplierFeeType]);

  return {
    productName, setProductName,
    hasVariations, setHasVariations,
    variations, setVariations,
    variationName, setVariationName,
    variationCost, setVariationCost,
    variationMarkup, setVariationMarkup,
    supplierName, setSupplierName,
    handleSupplierChange,
    supplierFixedFee, setSupplierFixedFee,
    costPrice, setCostPrice,
    manualSellingPrice, setManualSellingPrice,
    packagingCost, setPackagingCost,
    supplierFeePercent, setSupplierFeePercent,
    supplierFeeType, setSupplierFeeType,
    supplierGatewayFee, setSupplierGatewayFee,
    supplierGatewayFixedFee, setSupplierGatewayFixedFee,
    supplierGatewayFeeType, setSupplierGatewayFeeType,
    gatewayFee, setGatewayFee,
    gatewayFixedFee, setGatewayFixedFee,
    gatewayFeeType, setGatewayFeeType,
    markupMultiplier, setMarkupMultiplier,
    extraCommission, setExtraCommission,
    marketplace, setMarketplace,
    tiktokCommission, setTiktokCommission,
    wordpressShipping, setWordpressShipping,
    amazonPlan, setAmazonPlan,
    amazonCategory, setAmazonCategory,
    competitorPrice, setCompetitorPrice,
    competitorMarkup, setCompetitorMarkup,
    category, setCategory,
    shippingOption, setShippingOption,
    shopeeSellerType, setShopeeSellerType,
    accountType, setAccountType,
    accountHolder, setAccountHolder,
    adType, setAdType,
    mlShippingCost, setMlShippingCost,
    hasReputation, setHasReputation,
    reputationLevel, setReputationLevel,
    meliPlus, setMeliPlus,
    trafficMode, setTrafficMode,
    organicSubMode, setOrganicSubMode,
    orgFreq, setOrgFreq,
    orgImpressions, setOrgImpressions,
    orgClicks, setOrgClicks,
    orgSales, setOrgSales,
    orgCostVideo, setOrgCostVideo,
    orgKieCost, setOrgKieCost,
    orgKieCredits, setOrgKieCredits,
    selectedAiModel, setSelectedAiModel,
    selectedKiePlan, setSelectedKiePlan,
    currentCredits, setCurrentCredits,
    videoDuration, setVideoDuration,
    organicApi, setOrganicApi,
    useUploadPostFree, setUseUploadPostFree,
    competitorDiscount, setCompetitorDiscount,
    operationMode, setOperationMode,
    deliveryMode, setDeliveryMode,
    emergencyReserve, setEmergencyReserve,
    workingCapital, setWorkingCapital,
    returnRate, setReturnRate,
    paidTraffic, setPaidTraffic,
    paidTrafficType, setPaidTrafficType,
    gatewayBank, setGatewayBank,
    gatewayMethod, setGatewayMethod,
    gatewayInstallments, setGatewayInstallments,
    useShopeeAds, setUseShopeeAds,
    adsCPC, setAdsCPC,
    dailyBudget, setDailyBudget,
    salesQuantity, setSalesQuantity,
    handleFloatInput,
    handleOperationModeChange,
    handleMarketplaceChange,
    handleGatewayBankChange,
    handleGatewayMethodChange,
    handleGatewayInstallmentsChange,
    handlePaidTrafficGatewayBankChange,
    handlePaidTrafficGatewayMethodChange,
    handlePaidTrafficGatewayInstallmentsChange,
    handleTrafficModeChange, // Added this
    paidTrafficGatewayBank,
    paidTrafficGatewayMethod,
    paidTrafficGatewayInstallments,
    paidTrafficGatewayFee,
    setPaidTrafficGatewayFee,
    paidTrafficGatewayFixedFee,
    paidTrafficGatewayFeeType, setPaidTrafficGatewayFeeType,
    handleShopeeAdsChange,
    handleShopeeCategoryChange,
    enjoeiAdType, setEnjoeiAdType,
    enjoeiInactivityMonths, setEnjoeiInactivityMonths,
    addVariation,
    removeVariation,
    updateVariation,
    calculations,
    variationCalculations,
    productImage,
    setProductImage,
    productSku,
    setProductSku,
    stockQuantity,
    setStockQuantity
  };
};
