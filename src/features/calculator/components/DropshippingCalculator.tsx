'use client';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Calculator, TrendingUp, Package, DollarSign, AlertCircle, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
// import logo from '../imgs/Logonome-alobexpress.png';
// import videoBackground from '../video/dollar-animate-real.mp4';
const logo = '/calculator/imgs/Logonome-alobexpress.png';
const videoBackground = '/calculator/video/dollar-animate-real.mp4';

import { CollapsibleSection } from './ui/CollapsibleSection';
import { TrafficConfig } from './calculator/TrafficConfig';
import { GatewayConfig } from './calculator/GatewayConfig';
import { ResultsPanel } from './calculator/ResultsPanel';
import { ShopeeConfig } from './calculator/ShopeeConfig';
import { MercadoLivreConfig } from './calculator/MercadoLivreConfig';
import { TikTokConfig } from './calculator/TikTokConfig';
import { EnjoeiConfig } from './calculator/EnjoeiConfig';
import { AmazonConfig } from './calculator/AmazonConfig';
import { ProductInfo } from './calculator/ProductInfo';
import { ProductCard } from './calculator/ProductCard';
import { EditProductDialog } from './calculator/EditProductDialog';
import { useDropshippingCalculator } from '../hooks/useDropshippingCalculator';
import type { CalculationResult, ProductItem } from '../types/calculator';
import { formatCurrency, handleCurrencyChange, parseCurrency } from '../utils/currency';

gsap.registerPlugin(useGSAP);

const DropshippingCalculator = ({ accessToken }: { accessToken?: string | null }) => {
  const container = useRef<HTMLDivElement>(null);
  const prevCalculations = useRef<CalculationResult | null>(null);
  
  const {
    productName, setProductName,
    hasVariations, setHasVariations,
    variations,
    variationName, setVariationName,
    variationCost, setVariationCost,
    variationMarkup, setVariationMarkup,
    supplierName,
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
    gatewayFeeType, setGatewayFeeType,
    markupMultiplier, setMarkupMultiplier,
    extraCommission, setExtraCommission,
    marketplace,
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
    trafficMode,
    organicSubMode, setOrganicSubMode,
    orgImpressions, setOrgImpressions,
    orgClicks, setOrgClicks,
    orgSales, setOrgSales,
    orgFreq, setOrgFreq,
    orgCostVideo, setOrgCostVideo,
    orgKieCredits,
    selectedAiModel, setSelectedAiModel,
    selectedKiePlan, setSelectedKiePlan,
    currentCredits, setCurrentCredits,
    videoDuration, setVideoDuration,
    organicApi, setOrganicApi,
    useUploadPostFree, setUseUploadPostFree,
    competitorDiscount, setCompetitorDiscount,
    operationMode,
    deliveryMode,
    emergencyReserve, setEmergencyReserve,
    workingCapital, setWorkingCapital,
    returnRate, setReturnRate,
    paidTraffic, setPaidTraffic,
    paidTrafficType, setPaidTrafficType,
    gatewayBank,
    gatewayMethod,
    gatewayInstallments,
    useShopeeAds,
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
    paidTrafficGatewayBank,
    paidTrafficGatewayMethod,
    paidTrafficGatewayInstallments,
    handleTrafficModeChange,
    paidTrafficGatewayFee,
    setPaidTrafficGatewayFee,
    paidTrafficGatewayFeeType, setPaidTrafficGatewayFeeType,
    paidTrafficGatewayFixedFee,
    handleShopeeAdsChange,
    handleShopeeCategoryChange,
    enjoeiAdType, setEnjoeiAdType,
    enjoeiInactivityMonths, setEnjoeiInactivityMonths,
    addVariation,
    removeVariation,
    updateVariation,
    calculations,
    variationCalculations,
    gatewayFixedFee,
    productImage, setProductImage,
    productSku, setProductSku,
    stockQuantity, setStockQuantity,
    handleSupplierChange
  } = useDropshippingCalculator();

  // Products state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showProductsList, setShowProductsList] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [projectionSearch, setProjectionSearch] = useState('');
  const [productFilters, setProductFilters] = useState({
    marketplace: 'all',
    supplier: '',
    cnpj: '',
    holder: '',
    accountType: 'all'
  });

  const pageSize = 6;
  const prevProductIds = useRef<Set<string>>(new Set());

  // Edit State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const callCalculatorApi = useCallback(async (action: string, payload?: Record<string, unknown>) => {
    if (!accessToken) {
      return { ok: false, status: 401, data: null };
    }

    let response: Response;
    try {
      response = await fetch("/api/calculator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ action, payload }),
      });
    } catch (error) {
      return { ok: false, status: 0, data: { error: String(error instanceof Error ? error.message : error) } };
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return { ok: response.ok, status: response.status, data };
  }, [accessToken]);

  const handleProductsResponse = (list: ProductItem[]) => {
    setProducts(list);
    setCurrentPage(1);
    setIsProductsLoading(false);
    setSelectedProductIndex((prev) => {
      if (list.length === 0) return 0;
      return Math.min(prev, list.length - 1);
    });
  };

  const loadProducts = useCallback(async () => {
    setIsProductsLoading(true);
    const result = await callCalculatorApi("PRODUCTS_LIST");
    if (!result.ok) {
      setIsProductsLoading(false);
      setErrorMessage(result.data?.error || "Não foi possível carregar os produtos.");
      return;
    }
    handleProductsResponse(result.data?.products || []);
  }, [callCalculatorApi]);

  const loadSettings = useCallback(async () => {
    const result = await callCalculatorApi("SETTINGS_GET");
    if (!result.ok) return;
    const emergencyValue = result.data?.emergencyReserve ?? 0;
    const capitalValue = result.data?.workingCapital ?? 0;
    setEmergencyReserve(String(emergencyValue));
    setWorkingCapital(String(capitalValue));
  }, [callCalculatorApi, setEmergencyReserve, setWorkingCapital]);

  const handleEditProductClick = (product: ProductItem) => {
      setEditingProduct(product);
      setIsEditModalOpen(true);
  };

  const handleSaveEditProduct = (updatedProduct: ProductItem) => {
    void handleUpsertProduct(updatedProduct);
  };

  // New state for Profit Pricing Overlay
  const showProfitOverlay = Boolean(costPrice && parseFloat(costPrice) > 0);

  useGSAP(() => {
    // Animate Profit Pricing Overlay
    if (showProfitOverlay) {
        gsap.fromTo(".profit-overlay-animate", 
            { opacity: 0, scale: 0.95, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
  }, { scope: container, dependencies: [showProfitOverlay] });

  const handleUpsertProduct = async (payload: ProductItem | Record<string, unknown>) => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsProductsLoading(true);

    const result = await callCalculatorApi("PRODUCT_UPSERT", { product: payload });
    if (!result.ok) {
      setIsProductsLoading(false);
      setErrorMessage(result.data?.error || "Não foi possível salvar o produto.");
      return;
    }

    handleProductsResponse(result.data?.products || []);
    setShowProductsList(true);
    setSuccessMessage('Produto adicionado com sucesso.');
  };

  const handleSaveProduct = () => {
    const missingFields: string[] = [];
    const normalizedSku = productSku.trim();
    if (!productName) missingFields.push('Nome do Produto');
    if (!normalizedSku) missingFields.push('SKU do Produto');
    if (!productImage) missingFields.push('Imagem do Produto');
    if (!supplierName) missingFields.push('Fornecedor');
    if (!costPrice || parseCurrency(costPrice) <= 0) missingFields.push('Preço de Custo do Fornecedor');
    if (!manualSellingPrice || parseCurrency(manualSellingPrice) <= 0) missingFields.push('Preço de Venda');
    if (stockQuantity === '' || Number.isNaN(Number(stockQuantity)) || Number(stockQuantity) < 0) {
      missingFields.push('Quantidade em estoque');
    }

    if (missingFields.length > 0) {
      setSuccessMessage('');
      setErrorMessage(`Preencha os campos obrigatórios: ${missingFields.join(', ')}.`);
      return;
    }
    if (!calculations) {
      setSuccessMessage('');
      setErrorMessage('Preencha o preço de custo para calcular antes de salvar.');
      return;
    }
    
    const getColorHex = () => {
      if (calculations.marginStatus === 'negative') return '#DC2928';
      if (calculations.marginStatus === 'low') return '#FACC15';
      return '#16A34A';
    };

    const payload = {
      name: productName,
      sku: normalizedSku,
      imageUrl: productImage,
      stockQuantity: Number(stockQuantity),
      sellingPrice: manualSellingPrice,
      costPrice: parseCurrency(costPrice),
      supplierName,
      marketplace,
      amazonPlan: marketplace === 'amazon' ? amazonPlan : undefined,
      amazonCategory: marketplace === 'amazon' ? amazonCategory : undefined,
      netRevenue: parseCurrency(calculations.netRevenue),
      colorHex: getColorHex(),
      marginStatus: calculations.marginStatus,
      accountHolder,
      accountType,
      variations: variations.map(v => ({
        name: v.name,
        cost: v.cost,
        markup: v.markup,
        suggestedPrice: variationCalculations.find(vc => vc.id === v.id)?.metrics.suggestedPrice || '0',
        manualPrice: v.manualPrice,
        netRevenue: variationCalculations.find(vc => vc.id === v.id)?.metrics.netRevenue || '0',
        margin: variationCalculations.find(vc => vc.id === v.id)?.metrics.actualMargin || '0',
      }))
    };

    void handleUpsertProduct(payload);
  };

  const formatMoney = (value: string | number) => formatCurrency(value);
  const formatPercent = (value: string | number, digits: number = 1) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(num)) return '0';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  };
  const getMarketplaceName = (value: string | undefined) => {
    if (!value) return 'Outros';
    switch (value) {
      case 'mercadolivre': return 'Mercado Livre';
      case 'shopee': return 'Shopee';
      case 'tiktok': return 'TikTok';
      case 'wordpress': return 'Site Próprio';
      case 'enjoei': return 'Enjoei';
      default: return value.charAt(0).toUpperCase() + value.slice(1);
    }
  };
  const formatMarketplaceDisplayLabel = (label: string) => {
    if (label === 'Mercado Livre' || label.toLowerCase().includes('mercado')) return 'ML';
    return label;
  };

  const formatProfitValue = (value: number): string => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}K`;
    }
    return `R$ ${formatMoney(value)}`;
  };

  const normalizeText = (value: string) => value.trim().toLowerCase();
  const handleProductFilterChange = (field: keyof typeof productFilters, value: string) => {
    setProductFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };
  const effectiveProducts = useMemo(() => (accessToken ? products : []), [accessToken, products]);
  const isProductsLoadingState = accessToken ? isProductsLoading : false;
  const filteredProducts = effectiveProducts.filter((product) => {
    const marketplaceValue = product.marketplace ?? '';
    const supplierValue = product.supplierName ?? '';
    const holderValue = product.accountHolder ?? '';
    const accountTypeValue = (product.accountType ?? '').toLowerCase();
    const matchesMarketplace = productFilters.marketplace === 'all' || marketplaceValue === productFilters.marketplace;
    const matchesSupplier = !productFilters.supplier || normalizeText(supplierValue).includes(normalizeText(productFilters.supplier));
    const matchesHolder = !productFilters.holder || normalizeText(holderValue).includes(normalizeText(productFilters.holder));
    const matchesAccountType = productFilters.accountType === 'all' || accountTypeValue === productFilters.accountType;
    const matchesCnpj = !productFilters.cnpj || (accountTypeValue === 'cnpj' && normalizeText(holderValue).includes(normalizeText(productFilters.cnpj)));
    return matchesMarketplace && matchesSupplier && matchesHolder && matchesAccountType && matchesCnpj;
  });
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pagedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const marketplaceTotals = effectiveProducts.reduce<Record<string, number>>((acc, product) => {
    const label = getMarketplaceName(product.marketplace);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  const marketplaceMaxProducts = effectiveProducts.reduce<Record<string, { price: number; cost: number; imageUrl: string; name: string; accountHolder?: string; accountType?: string }>>((acc, product) => {
    const label = getMarketplaceName(product.marketplace);
    const productPrice = parseCurrency(String(product.sellingPrice ?? 0));
    const productCost = parseCurrency(String(product.costPrice ?? 0));
    if (!acc[label] || productPrice >= acc[label].price) {
      acc[label] = {
        price: productPrice,
        cost: productCost,
        imageUrl: product.imageUrl || '',
        name: product.name || '',
        accountHolder: product.accountHolder,
        accountType: product.accountType
      };
    }
    return acc;
  }, {});
  const projectionUnits = [50, 100, 200, 300, 400, 500];
  const filteredProjectionProducts = effectiveProducts.filter((product) => {
    if (!projectionSearch) return true;
    return normalizeText(product.name || '').includes(normalizeText(projectionSearch));
  });
  const safeSelectedProductIndex = filteredProjectionProducts.length === 0
    ? 0
    : Math.min(selectedProductIndex, filteredProjectionProducts.length - 1);
  const selectedProduct = filteredProjectionProducts[safeSelectedProductIndex];
  const selectedProductUnitValue = parseCurrency(String(selectedProduct?.sellingPrice ?? selectedProduct?.netRevenue ?? 0));

  const handleDeleteProduct = async (productId: string) => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsProductsLoading(true);

    const result = await callCalculatorApi("PRODUCT_DELETE", { id: productId });
    if (!result.ok) {
      setIsProductsLoading(false);
      setErrorMessage(result.data?.error || "Não foi possível excluir o produto.");
      return;
    }

    handleProductsResponse(result.data?.products || []);
    setSuccessMessage('Produto excluído com sucesso.');
  };

  const handleDeleteProductAnimated = (productId: string) => {
    const target = `[data-product-id="${productId}"]`;
    if (!container.current || !container.current.querySelector(target)) {
      handleDeleteProduct(productId);
      return;
    }
    gsap.to(target, {
      opacity: 0,
      y: 12,
      scale: 0.98,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => handleDeleteProduct(productId)
    });
  };

  useEffect(() => {
    if (!accessToken) return;
    const timeoutId = window.setTimeout(() => {
      void loadProducts();
      void loadSettings();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [accessToken, loadProducts, loadSettings]);

  useEffect(() => {
    const previousIds = prevProductIds.current;
    const currentIds = new Set(effectiveProducts.map((product) => product.id));
    const newIds = effectiveProducts
      .filter((product) => !previousIds.has(product.id))
      .map((product) => `[data-product-id="${product.id}"]`);

    if (newIds.length > 0) {
      gsap.fromTo(newIds, {
        opacity: 0,
        y: 16,
        scale: 0.97
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.7)",
        clearProps: "all"
      });
    }

    prevProductIds.current = currentIds;
  }, [effectiveProducts]);

  useGSAP(() => {
    // Animate Result Cards on Calculation Update
    if (calculations) {
      if (!prevCalculations.current) {
        // First time appearance (Entrance) - Right to Left
        gsap.from(".result-card-animate", {
          x: 100,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "all"
        });
      } else {
        // Update - Subtle scale
        gsap.from(".result-card-animate", {
          scale: 0.98,
          duration: 0.2,
          ease: "power2.out",
          clearProps: "all"
        });
      }
    }
    prevCalculations.current = calculations;
  }, { scope: container, dependencies: [calculations] });

  useGSAP(() => {
    // Animate Header
    gsap.from(".header-animate", {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    // Animate Main Cards and Sections
    gsap.from(".animate-on-scroll", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.2,
      clearProps: "all"
    });

    // Animate Form Elements with Fade In
    gsap.from(".animate-fadeIn", {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5,
        clearProps: "all"
    });
  }, { scope: container });

  return (
    <div className="w-full h-full min-h-[600px] bg-black relative overflow-hidden font-sans isolate" ref={container}>
      {/* Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
         <video 
            autoPlay 
            loop 
            muted 
             playsInline
             className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          >
             <source src={videoBackground} type="video/mp4" />
          </video>
       </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
        <div className="grid md:grid-cols-2 gap-4 items-center mb-8 header-animate">
          <div className="flex justify-center md:justify-start">
             <img 
                src={logo} 
                alt="Alob Express" 
                className="h-12 object-contain glitch-hover cursor-pointer"
                style={{ height: '48px', width: 'auto' }}
                onClick={() => window.location.reload()} 
             />
          </div>
          <div className="text-center md:text-right">
             <p className="text-gray-300 text-xl font-medium font-iceland">Calculadora de Precificação Dropshipping Nacional <span className="text-sm text-gray-500 font-normal">v1.0.0</span></p>
             <p className="text-sm text-gray-400 mt-1">Taxas reais atualizadas de Marketplaces 2025</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Painel de Entrada */}
          <Card className="shadow-xl border-gray-100 animate-on-scroll !bg-white">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <div className="flex flex-row items-center gap-2">
                 <Calculator className="w-6 h-6 text-blue-600" />
                 <CardTitle className="text-2xl font-bold text-gray-800 font-iceland">Dados do Produto</CardTitle>
              </div>
              <Button 
                onClick={handleSaveProduct}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              {successMessage ? (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-3 py-2">
                  {successMessage}
                </div>
              ) : null}
              {errorMessage ? (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
                  {errorMessage}
                </div>
              ) : null}
              <ProductInfo 
                productName={productName}
                setProductName={setProductName}
                productImage={productImage}
                setProductImage={setProductImage}
                productSku={productSku}
                setProductSku={setProductSku}
                stockQuantity={stockQuantity}
                setStockQuantity={setStockQuantity}
                operationMode={operationMode}
                handleOperationModeChange={handleOperationModeChange}
                returnRate={returnRate}
                setReturnRate={setReturnRate}
                handleFloatInput={handleFloatInput}
                deliveryMode={deliveryMode}
                marketplace={marketplace}
              />



              <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                <Label htmlFor="costPrice" className="text-base font-bold text-[#fe2c55]">
                  Preço de Custo do Fornecedor
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    R$
                  </span>
                  <Input
                    id="costPrice"
                    type="text"
                    inputMode="decimal"
                    value={costPrice}
                    onChange={(event) => {
                      handleFloatInput(setCostPrice)(event);
                    }}
                    className="pl-10 text-xl font-bold border-[#fe2c55] focus:border-[#fe2c55]"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Preço de Venda Manual */}
              <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                <Label htmlFor="manualSellingPrice" className="text-base font-bold text-blue-700">
                  Preço de venda
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    R$
                  </span>
                  <Input
                    id="manualSellingPrice"
                    type="text"
                    inputMode="decimal"
                    value={manualSellingPrice}
                    onChange={handleFloatInput(setManualSellingPrice)}
                    className="pl-10 text-xl border-blue-400 focus:border-blue-600 font-bold"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Markup */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-sm font-semibold text-gray-800">
                  Markup
                </Label>
                <Select value={markupMultiplier} onValueChange={setMarkupMultiplier}>
                  <SelectTrigger id="markupMultiplier">
                    <SelectValue placeholder="Selecione o markup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-3,0">-3.00x (Markup Negativo)</SelectItem>
                    <SelectItem value="-2,0">-2.00x (Markup Negativo)</SelectItem>
                    <SelectItem value="-1,5">-1.50x (Markup Negativo)</SelectItem>
                    <SelectItem value="-1,25">-1.25x (Markup Negativo)</SelectItem>
                    <SelectItem value="0">0 (Automático / Margem Recomendada)</SelectItem>
                    <SelectItem value="1">1.0x</SelectItem>
                    <SelectItem value="1,25">1.25x</SelectItem>
                    <SelectItem value="1,5">1.5x</SelectItem>
                    <SelectItem value="1,75">1.75x</SelectItem>
                    <SelectItem value="2">2.0x</SelectItem>
                    <SelectItem value="3">3.0x</SelectItem>
                    <SelectItem value="4">4.0x</SelectItem>
                    <SelectItem value="5">5.0x</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-gray-500">Define o preço sugerido multiplicando o custo.</p>
              </div>

              {/* Variações Checkbox */}
              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Checkbox 
                  id="hasVariations" 
                  checked={hasVariations}
                  onCheckedChange={(checked) => setHasVariations(checked as boolean)}
                />
                <Label htmlFor="hasVariations" className="font-bold text-gray-800 cursor-pointer">
                  É produto com variação?
                </Label>
              </div>

              {/* Área de Variações */}
              {hasVariations && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-3 gap-2">
                    <Input 
                      placeholder="Variação (ex: P)" 
                      value={variationName}
                      onChange={(e) => setVariationName(e.target.value)}
                      className="text-xs"
                    />
                    <Input 
                      type="text"
                      inputMode="decimal" 
                      placeholder="Custo (R$)" 
                      value={variationCost}
                      onChange={(e) => handleCurrencyChange(e, setVariationCost)}
                      className="text-xs"
                    />
                    <Input 
                      type="text"
                      inputMode="decimal" 
                      placeholder="Markup" 
                      value={variationMarkup}
                      onChange={(e) => handleCurrencyChange(e, setVariationMarkup)}
                      className="text-xs"
                    />
                  </div>
                  <Button onClick={addVariation} size="sm" className="w-full bg-[#d91c42] hover:bg-[#b91536]">
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Variação
                  </Button>

                  {variations.length > 0 && (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="h-8 text-xs">Variação</TableHead>
                            <TableHead className="h-8 text-xs">Custo</TableHead>
                            <TableHead className="h-8 text-xs">Preço Venda (Opcional)</TableHead>
                            <TableHead className="h-8 text-xs">Markup</TableHead>
                            <TableHead className="h-8 text-xs w-8"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {variations.map((v) => (
                            <TableRow key={v.id}>
                              <TableCell className="py-2 text-xs font-medium">{v.name}</TableCell>
                              <TableCell className="py-2 text-xs">R$ {v.cost}</TableCell>
                              <TableCell className="py-2">
                                <Input 
                                    className="h-7 w-24 text-xs bg-background" 
                                    placeholder="0,00"
                                    value={v.manualPrice || ''}
                                    onChange={(e) => handleCurrencyChange(e, (val) => updateVariation(v.id, { manualPrice: val }))}
                                />
                              </TableCell>
                              <TableCell className="py-2 text-xs">{v.markup}</TableCell>
                              <TableCell className="py-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-red-500 hover:text-red-700"
                                  onClick={() => removeVariation(v.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}

              {/* Marketplace */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-sm font-semibold text-gray-800">
                  Marketplace
                </Label>
                <Select value={marketplace} onValueChange={handleMarketplaceChange}>
                  <SelectTrigger data-testid="marketplace-select-trigger">
                    <SelectValue placeholder="Selecione o marketplace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
                    <SelectItem value="shopee">Shopee</SelectItem>
                    <SelectItem value="enjoei">Enjoei</SelectItem>
                    <SelectItem value="tiktok">Tiktok Shop</SelectItem>
                    <SelectItem value="shein">Shein</SelectItem>
                    <SelectItem value="amazon">Amazon</SelectItem>
                    <SelectItem value="wordpress">Wordpress (Site)</SelectItem>
                  </SelectContent>
                </Select>
              </div>



              {/* Titular da Conta */}
              <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                <Label htmlFor="accountHolder" className="text-sm font-semibold text-gray-800">
                  Titular da conta
                </Label>
                <Input
                  id="accountHolder"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Nome do Titular"
                />
              </div>

              {/* Tipo de Conta */}
              <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                <Label className="text-sm font-semibold text-gray-800">
                  Tipo de Conta
                </Label>
                <Select value={accountType} onValueChange={(val: 'cpf' | 'cnpj') => setAccountType(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="cnpj">CNPJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preço Mínimo Concorrente */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="competitorPrice" className="text-sm font-semibold text-gray-800">
                  Preço Mínimo Concorrente ({
                    marketplace === 'shopee' ? 'Shopee' : 
                    marketplace === 'mercadolivre' ? 'Mercado Livre' : 
                    marketplace === 'enjoei' ? 'Enjoei' : 
                    marketplace === 'tiktok' ? 'Tiktok Shop' : 'Marketplaces'
                  })
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    R$
                  </span>
                  <Input
                    id="competitorPrice"
                    type="text"
                    inputMode="decimal"
                    value={competitorPrice}
                    onChange={handleFloatInput(setCompetitorPrice)}
                    className="pl-10 text-lg border-orange-200"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Competitor Markup */}
              {competitorPrice && (
                  <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn mt-1">
                    <Label className="text-sm font-semibold text-gray-800">
                      Markup sobre Concorrente
                    </Label>
                    <Select value={competitorMarkup} onValueChange={setCompetitorMarkup}>
                      <SelectTrigger className="bg-orange-50 border-orange-200">
                        <SelectValue placeholder="Selecione o markup" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 (Automático)</SelectItem>
                        <SelectItem value="-1.5">-1.50x (Mais barato)</SelectItem>
                        <SelectItem value="-1.25">-1.25x (Mais barato)</SelectItem>
                        <SelectItem value="-1.10">-1.10x (Mais barato)</SelectItem>
                        <SelectItem value="-1.05">-1.05x (Mais barato)</SelectItem>
                        <SelectItem value="1">Igual (1.0x)</SelectItem>
                        <SelectItem value="1.05">1.05x (Mais caro)</SelectItem>
                        <SelectItem value="1.10">1.10x (Mais caro)</SelectItem>
                        <SelectItem value="1.25">1.25x (Mais caro)</SelectItem>
                        <SelectItem value="1.5">1.50x (Mais caro)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              )}

              {/* Configuração de Gateway de Pagamento */}
              <GatewayConfig
                gatewayBank={gatewayBank}
                handleGatewayBankChange={handleGatewayBankChange}
                gatewayMethod={gatewayMethod}
                handleGatewayMethodChange={handleGatewayMethodChange}
                gatewayInstallments={gatewayInstallments}
                handleGatewayInstallmentsChange={handleGatewayInstallmentsChange}
                gatewayFee={gatewayFee}
                setGatewayFee={setGatewayFee}
                gatewayFeeType={gatewayFeeType}
                setGatewayFeeType={setGatewayFeeType}
                gatewayFixedFee={gatewayFixedFee}
                idPrefix="mainGateway"
              />

              {/* Seletor de Tráfego: Pago vs Orgânico */}
              <TrafficConfig
                trafficMode={trafficMode}
                handleTrafficModeChange={handleTrafficModeChange}
              paidTraffic={paidTraffic}
              setPaidTraffic={setPaidTraffic}
              paidTrafficType={paidTrafficType}
              setPaidTrafficType={setPaidTrafficType}
              organicSubMode={organicSubMode}
              setOrganicSubMode={setOrganicSubMode}
                organicApi={organicApi}
                setOrganicApi={setOrganicApi}
                orgImpressions={orgImpressions}
                setOrgImpressions={setOrgImpressions}
                orgClicks={orgClicks}
                setOrgClicks={setOrgClicks}
                orgSales={orgSales}
                setOrgSales={setOrgSales}
                orgFreq={orgFreq}
                setOrgFreq={setOrgFreq}
                orgCostVideo={orgCostVideo}
                setOrgCostVideo={setOrgCostVideo}
                useUploadPostFree={useUploadPostFree}
                setUseUploadPostFree={setUseUploadPostFree}
                selectedKiePlan={selectedKiePlan}
                setSelectedKiePlan={setSelectedKiePlan}
                currentCredits={currentCredits}
                setCurrentCredits={setCurrentCredits}
                selectedAiModel={selectedAiModel}
                setSelectedAiModel={setSelectedAiModel}
                videoDuration={videoDuration}
                setVideoDuration={setVideoDuration}
                // Paid Traffic Gateway Props
                paidTrafficGatewayBank={paidTrafficGatewayBank}
                handlePaidTrafficGatewayBankChange={handlePaidTrafficGatewayBankChange}
                paidTrafficGatewayMethod={paidTrafficGatewayMethod}
                handlePaidTrafficGatewayMethodChange={handlePaidTrafficGatewayMethodChange}
                paidTrafficGatewayInstallments={paidTrafficGatewayInstallments}
                handlePaidTrafficGatewayInstallmentsChange={handlePaidTrafficGatewayInstallmentsChange}
                paidTrafficGatewayFee={paidTrafficGatewayFee}
                setPaidTrafficGatewayFee={setPaidTrafficGatewayFee}
                paidTrafficGatewayFeeType={paidTrafficGatewayFeeType}
                setPaidTrafficGatewayFeeType={setPaidTrafficGatewayFeeType}
                paidTrafficGatewayFixedFee={paidTrafficGatewayFixedFee}
              />




              {/* Taxa de Gateway do Fornecedor */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="supplierGatewayFeeValue" className="text-sm font-semibold text-gray-800">
                    Taxa de Gateway do Fornecedor
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={supplierGatewayFeeType === 'percent' ? 'default' : 'outline'}
                      onClick={() => setSupplierGatewayFeeType('percent')}
                      className={`h-6 text-xs ${supplierGatewayFeeType === 'percent' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                    >
                      %
                    </Button>
                    <Button
                      size="sm"
                      variant={supplierGatewayFeeType === 'fixed' ? 'default' : 'outline'}
                      onClick={() => setSupplierGatewayFeeType('fixed')}
                      className={`h-6 text-xs ${supplierGatewayFeeType === 'fixed' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                    >
                      R$
                    </Button>
                  </div>
                </div>
                <div className="relative">
                   {supplierGatewayFeeType === 'fixed' && (
                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                       R$
                     </span>
                   )}
                   <Input
                    id="supplierGatewayFeeValue"
                    type="text"
                    inputMode="decimal"
                    value={supplierGatewayFeeType === 'percent' ? supplierGatewayFee : supplierGatewayFixedFee}
                    onChange={(e) => handleCurrencyChange(e, supplierGatewayFeeType === 'percent' ? setSupplierGatewayFee : setSupplierGatewayFixedFee)}
                    placeholder="0,00"
                    className={supplierGatewayFeeType === 'fixed' ? 'pl-8' : ''}
                   />
                   {supplierGatewayFeeType === 'percent' && (
                     <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                       %
                     </span>
                   )}
                </div>
              </div>

              {/* Custos Extras - Only show in non-dropshipping mode */}
              {operationMode !== 'dropshipping' && (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="packagingCost" className="text-sm font-semibold text-gray-800">
                  Custos embalagem + impressão + Transporte
                </Label>
                <div className="relative">
                   <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                   <Input
                    id="packagingCost"
                    type="text"
                    inputMode="decimal"
                    className="pl-8"
                    value={packagingCost}
                    onChange={(e) => handleCurrencyChange(e, setPackagingCost)}
                    placeholder="0,00"
                   />
                </div>
              </div>
              )}

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-sm font-semibold text-gray-800">
                  Nome do fornecedor
                </Label>
                <Select value={supplierName} onValueChange={handleSupplierChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dogama">Dogama (6% + R$1.00)</SelectItem>
                    <SelectItem value="Yeizidrop">Yeizidrop (TYR) (0%)</SelectItem>
                    <SelectItem value="Dsers">Dsers (0%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="supplierFeeValue" className="text-sm font-semibold text-gray-800">
                    Taxa do fornecedor
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={supplierFeeType === 'percent' ? 'default' : 'outline'}
                      onClick={() => setSupplierFeeType('percent')}
                      className={`h-6 text-xs ${supplierFeeType === 'percent' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                    >
                      %
                    </Button>
                    <Button
                      size="sm"
                      variant={supplierFeeType === 'fixed' ? 'default' : 'outline'}
                      onClick={() => setSupplierFeeType('fixed')}
                      className={`h-6 text-xs ${supplierFeeType === 'fixed' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                    >
                      R$
                    </Button>
                  </div>
                </div>
                <div className="relative">
                   {supplierFeeType === 'fixed' && (
                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                       R$
                     </span>
                   )}
                   <Input
                    id="supplierFeeValue"
                    type="text"
                    inputMode="decimal"
                    value={supplierFeeType === 'percent' ? supplierFeePercent : supplierFixedFee}
                    onChange={(e) => handleCurrencyChange(e, supplierFeeType === 'percent' ? setSupplierFeePercent : setSupplierFixedFee)}
                    placeholder="0,00"
                    className={supplierFeeType === 'fixed' ? 'pl-8' : ''}
                   />
                   {supplierFeeType === 'percent' && (
                     <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                       %
                     </span>
                   )}
                </div>
              </div>




              {/* Opções específicas por marketplace */}
              <ShopeeConfig
                marketplace={marketplace}
                category={category}
                handleShopeeCategoryChange={handleShopeeCategoryChange}
                extraCommission={extraCommission}
                setExtraCommission={setExtraCommission}
                shippingOption={shippingOption}
                setShippingOption={setShippingOption}
                shopeeSellerType={shopeeSellerType}
                setShopeeSellerType={setShopeeSellerType}
                useShopeeAds={useShopeeAds}
                handleShopeeAdsChange={handleShopeeAdsChange}
                adsCPC={adsCPC}
                setAdsCPC={setAdsCPC}
                dailyBudget={dailyBudget}
                setDailyBudget={setDailyBudget}
                salesQuantity={salesQuantity}
                setSalesQuantity={setSalesQuantity}
              />

              <MercadoLivreConfig
                marketplace={marketplace}
                hasReputation={hasReputation}
                setHasReputation={setHasReputation}
                reputationLevel={reputationLevel}
                setReputationLevel={setReputationLevel}
                adType={adType}
                setAdType={setAdType}
                category={category}
                setCategory={setCategory}
                meliPlus={meliPlus}
                setMeliPlus={setMeliPlus}
                mlShippingCost={mlShippingCost}
                setMlShippingCost={setMlShippingCost}
                handleFloatInput={handleFloatInput}
              />

              <TikTokConfig
                marketplace={marketplace}
                tiktokCommission={tiktokCommission}
                setTiktokCommission={setTiktokCommission}
              />

              <EnjoeiConfig
                marketplace={marketplace}
                enjoeiAdType={enjoeiAdType}
                setEnjoeiAdType={setEnjoeiAdType}
                enjoeiInactivityMonths={enjoeiInactivityMonths}
                setEnjoeiInactivityMonths={setEnjoeiInactivityMonths}
              />

              <AmazonConfig
                marketplace={marketplace}
                amazonPlan={amazonPlan}
                setAmazonPlan={setAmazonPlan}
                amazonCategory={amazonCategory}
                setAmazonCategory={setAmazonCategory}
              />

              {marketplace === 'wordpress' && (
                <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                   <Label htmlFor="wordpressShipping" className="text-sm font-semibold text-gray-800">
                     Frete (R$)
                   </Label>
                   <div className="relative">
                      <Input
                       id="wordpressShipping"
                       type="number"
                       value={wordpressShipping}
                       onChange={(e) => setWordpressShipping(e.target.value)}
                       placeholder="Ex: 0"
                      />
                   </div>
                </div>
              )}

            </CardContent>
          </Card>

          {showProfitOverlay ? (
            <div className="relative h-full profit-overlay-animate">
              <ResultsPanel
                calculations={calculations}
                marketplace={marketplace}
                productName={productName}
                competitorDiscount={competitorDiscount}
                setCompetitorDiscount={setCompetitorDiscount}
                onClose={() => {
                    setCostPrice(''); // Reset cost price to hide overlay
                    setShowProductsList(true);
                }}
                >
                {/* ... (Existing ResultsPanel Children) ... */}




                {/* Métricas de Tráfego Orgânico (Card Destacado) */}
                {trafficMode === 'organic' && calculations && (
                    <div className="bg-[#DCFCE7] rounded-xl p-4 border border-white shadow-md animate-fadeIn mt-4 text-black">
                        <div className="flex items-center gap-2 mb-3 border-b border-white pb-2">
                            <TrendingUp className="w-5 h-5 text-black" />
                            <h3 className="font-bold text-lg text-black">MÉTRICAS DE TRÁFEGO ORGÂNICO</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                            {organicSubMode !== 'manual' && (
                                <>
                                    <div className="col-span-2 md:col-span-1">
                                        <span className="text-gray-700">🪙 Créditos iniciais:</span> 
                                        <span className="font-bold ml-1" >{orgKieCredits || '1000'}</span>
                                    </div>
                                    <div className="col-span-2 md:col-span-1 flex items-center gap-1">
                                        <span className="text-gray-700">🪙 Créditos atuais:</span> 
                                        <Input 
                                            value={currentCredits}
                                            onChange={(e) => setCurrentCredits(e.target.value)}
                                            className="h-6 w-20 text-xs inline-block bg-gray-100 border-gray-300 text-black"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1 flex items-center gap-1">
                                        <span className="text-gray-700">⏱️ Duração (s):</span> 
                                        <Input 
                                            value={videoDuration}
                                            onChange={(e) => setVideoDuration(e.target.value)}
                                            className="h-6 w-16 text-xs inline-block bg-gray-100 border-gray-300 text-black"
                                            placeholder="10"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <span className="text-gray-700">📉 Créditos restantes:</span> 
                                        <span className={`font-bold ml-1 ${(parseFloat(currentCredits) - (parseFloat(videoDuration)||10)*10) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {currentCredits ? (parseFloat(currentCredits) - (parseFloat(videoDuration)||10)*10).toFixed(0) : '-'}
                                        </span>
                                    </div>
                                </>
                            )}
                            <div className="col-span-2 md:col-span-1">
                                <span className="text-gray-700">🎥 Custo/vídeo:</span> 
                                <span className="font-bold ml-1">$ {formatMoney(organicSubMode === 'manual' ? (organicApi === 'chatgpt' ? parseFloat(orgCostVideo)||0 : 0) : ((parseFloat(videoDuration)||10) * 10 * 0.005))}</span>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <span className="text-gray-700">👁️ Impressões:</span> 
                                <span className="font-bold ml-1">{orgImpressions || '0'}</span>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <span className="text-gray-700">🖱️ Cliques:</span> 
                                <span className="font-bold ml-1">{orgClicks || '0'}</span>
                            </div>
                             <div className="col-span-2 md:col-span-1">
                                <span className="text-gray-700">🛒 Vendas:</span> 
                                <span className="font-bold ml-1">{orgSales || '0'}</span>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <span className="text-gray-700">📊 CTR:</span> 
                                <span className="font-bold ml-1">{formatPercent(orgImpressions && orgClicks && parseFloat(orgImpressions) > 0 ? ((parseFloat(orgClicks) / parseFloat(orgImpressions)) * 100) : 0, 2)}%</span>
                            </div>
                        </div>

                        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 mb-3">
                            <p className="text-xs font-bold text-white mb-2 border-b border-gray-600 pb-1">CUSTOS</p>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-300">💵 CPC Orgânico:</span>
                                <span className="font-bold text-green-400">
                                    {parseFloat(orgClicks) > 0 
                                        ? `R$ ${formatMoney(parseFloat(calculations.adsCostPerSale) * parseFloat(orgSales) / parseFloat(orgClicks))} por clique`
                                        : 'R$ 0,00 por clique'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">🎯 CPA Orgânico:</span>
                                <span className="font-bold text-green-400">R$ {formatMoney(calculations.adsCostPerSale)} por venda</span>
                            </div>
                        </div>

                        {/* Projeção de Conversão */}
                        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 mb-3 mt-3">
                            <p className="text-xs font-bold text-white mb-2 border-b border-gray-600 pb-1">PROJEÇÃO DE CONVERSÃO (Simulação)</p>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-800 border-b border-gray-700 h-8">
                                        <TableHead className="text-xs font-bold text-gray-300 h-8 p-1 text-center">Conv.</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-300 h-8 p-1 text-center">Vendas</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-300 h-8 p-1 text-center">Fat.</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-300 h-8 p-1 text-center">Lucro</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[0.5, 1.0, 1.5, 2.0, 3.0].map((rate) => {
                                        const clicksVal = parseFloat(orgClicks) || 0;
                                        if (clicksVal === 0) return null;
                                        
                                        const projSales = Math.floor(clicksVal * (rate / 100));
                                        if (projSales === 0) return null;

                                        const projRevenue = projSales * parseFloat(calculations.suggestedPrice);
                                        
                                        const currentCPA = parseFloat(calculations.adsCostPerSale) || 0;
                                        const profitPerUnitBeforeAds = parseFloat(calculations.netRevenue) + currentCPA;
                                        const totalOrgCost = currentCPA * (parseFloat(orgSales)||0); 
                                        
                                        // Total Profit = (ProfitPerUnitBeforeAds * ProjSales) - TotalFixedOrganicCost
                                        // Note: Organic cost is fixed (production), doesn't scale with sales in this model (unless sales come from more videos).
                                        // Assuming fixed production for this projection.
                                        const totalProfit = (projSales * profitPerUnitBeforeAds) - totalOrgCost;

                                        return (
                                            <TableRow key={rate} className="hover:bg-gray-800/50 h-8 border-b border-gray-700">
                                                <TableCell className="text-center text-xs p-1">{rate}%</TableCell>
                                                <TableCell className="text-center text-xs p-1">{projSales}</TableCell>
                                                <TableCell className="text-center text-xs p-1">R$ {projRevenue.toLocaleString('pt-BR', {maximumFractionDigits:0})}</TableCell>
                                                <TableCell className={`text-center text-xs p-1 font-bold ${totalProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    R$ {totalProfit.toLocaleString('pt-BR', {maximumFractionDigits:0})}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                             {(!orgClicks || parseFloat(orgClicks) === 0) && (
                                <p className="text-[10px] text-center text-gray-500 mt-1">Insira cliques para ver a projeção</p>
                            )}
                        </div>

                        <div className="bg-yellow-50 p-2 rounded border border-yellow-100 flex gap-2 items-start">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-yellow-800">
                                <p className="font-bold">Tráfego orgânico pode não ser gratuito</p>
                                <p>Você pode ter que pagar a ferramentas de conteúdo com o tempo.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Comparativo Rápido */}
                {calculations && (
                  <>
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg text-white mt-4 border border-gray-700">
                    <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-yellow-400" />
                        COMPARATIVO RÁPIDO
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-300">Tráfego Pago (Ref):</span>
                            <span className="font-bold">CPA ≈ R$ {formatMoney((parseFloat(calculations.suggestedPrice) * 0.3) || 45)} (Est. 30%)</span> 
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-300">Seu Cenário ({trafficMode === 'paid' ? 'Pago' : 'Orgânico'}):</span>
                            <span className={`font-bold ${trafficMode === 'organic' ? 'text-green-400' : 'text-yellow-400'}`}>
                                CPA = R$ {formatMoney(calculations.totalCPA)}
                            </span>
                        </div>
                        
                        {trafficMode === 'organic' && (
                            <div className="mt-3 pt-3 border-t border-gray-600">
                                <p className="text-green-300 font-bold flex items-center gap-2">
                                    💡 Economia Estimada: R$ {formatMoney(Math.max(0, ((parseFloat(calculations.suggestedPrice) * 0.3) - (parseFloat(calculations.totalCPA) || 0))))} por venda
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detalhamento */}
                <div className="space-y-3 mt-4">
                  <div className={`flex justify-between items-center py-2 border-b ${
                      ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                  }`}>
                    <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Custos Embalagem</span>
                    <span className={`font-semibold ${
                        ['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-red-200'
                    }`}>
                        {parseFloat(calculations.packagingCost) > 0 
                            ? `- R$ ${formatMoney(calculations.packagingCost)}` 
                            : `R$ ${formatMoney(calculations.packagingCost)}`
                        }
                    </span>
                  </div>

                  <div className={`flex justify-between items-center py-2 border-b ${
                      ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                  }`}>
                    <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Taxa do Fornecedor</span>
                    <span className={`font-semibold ${
                        ['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-red-200'
                    }`}>
                        {parseFloat(calculations.supplierFeeCost) > 0 
                            ? `- R$ ${formatMoney(calculations.supplierFeeCost)}` 
                            : `R$ ${formatMoney(calculations.supplierFeeCost)}`
                        }
                    </span>
                  </div>

                  {marketplace === 'wordpress' && parseFloat(wordpressShipping) > 0 && (
                    <div className={`flex justify-between items-center py-2 border-b ${
                        ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                    }`}>
                      <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Frete (Wordpress)</span>
                      <span className={`font-semibold ${
                          ['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-red-200'
                      }`}>- R$ {formatMoney(wordpressShipping)}</span>
                    </div>
                  )}
                  
                  <div className={`flex justify-between items-center py-2 border-b ${
                      ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                  }`}>
                    <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Taxa Marketplace ({formatPercent(calculations.marketplaceFee, 0)}%)</span>
                    <span className={`font-semibold ${
                        ['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-red-200'
                    }`}>- R$ {formatMoney(calculations.marketplaceCost)}</span>
                  </div>

                  <div className={`flex justify-between items-center py-2 border-b ${
                      ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                  }`}>
                    <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Taxa de Gateway - Compra</span>
                    <span className={`font-semibold ${
                        ['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-red-200'
                    }`}>- R$ {formatMoney(calculations.gatewayCost)}</span>
                  </div>

                  <div className={`flex justify-between items-center py-2 border-b ${
                      ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                  }`}>
                    <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Taxa de Gateway - Fornecedor</span>
                    <span className={`font-semibold ${
                        ['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-red-200'
                    }`}>- R$ {formatMoney(calculations.supplierGatewayCost)}</span>
                  </div>

                  {parseFloat(calculations.paidTrafficCost) > 0 && (
                     <div className={`flex justify-between items-center py-2 border-b ${
                        ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                    }`}>
                        <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Investimento Tráfego</span>
                        <span className={`font-semibold ${
                            ['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-red-200'
                        }`}>- R$ {formatMoney(calculations.paidTrafficCost)}</span>
                    </div>
                  )}

                  {parseFloat(calculations.paidTrafficGatewayCost) > 0 && (
                     <div className={`flex justify-between items-center py-2 border-b ${
                        ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                    }`}>
                        <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Taxa de Gateway -&gt; Tráfego Pago</span>
                        <span className={`font-semibold ${
                            ['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-red-200'
                        }`}>- R$ {formatMoney(calculations.paidTrafficGatewayCost)}</span>
                    </div>
                  )}

                  {parseFloat(calculations.fixedFee) > 0 && (
                    <div className={`flex justify-between items-center py-2 border-b ${
                        ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                    }`}>
                      <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Taxa Fixa</span>
                      <span className={`font-semibold ${
                          ['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-red-200'
                      }`}>- R$ {formatMoney(calculations.fixedFee)}</span>
                    </div>
                  )}

                  {parseFloat(calculations.adsCostPerSale) > 0 && (
                    <>
                      <div className={`flex justify-between items-center py-2 border-b ${
                          ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                      }`}>
                        <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Custo Shopee Ads (Est.)</span>
                        <span className={`font-semibold ${
                            ['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-red-200'
                        }`}>- R$ {formatMoney(calculations.adsCostPerSale)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20 bg-white/5 px-2 rounded">
                        <span className="text-white/80 text-sm">CPA (Custo por Aquisição)</span>
                        <span className="font-semibold text-white">R$ {formatMoney(calculations.adsCostPerSale)}</span>
                      </div>
                    </>
                  )}

{/* Old duplicate Investimento Tráfego removed */}

                  <div className={`flex justify-between items-center py-2 border-b ${
                      ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                  }`}>
                    <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Total de Taxas e Custos</span>
                    <span className={`font-semibold ${
                        ['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-red-200'
                    }`}>- R$ {formatMoney(calculations.totalFees)}</span>
                  </div>

                  {calculations.discountApplied > 0 && (
                    <div className={`flex justify-between items-center py-2 border-b ${
                        ['low', 'excellent'].includes(calculations.marginStatus) ? 'border-black/10' : 'border-white/20'
                    }`}>
                        <span className={['low', 'excellent'].includes(calculations.marginStatus) ? 'text-black' : 'text-white/80'}>Desconto Aplicado ({formatPercent(calculations.discountPercent, 1)}%)</span>
                        <span className="font-semibold text-yellow-300">- R$ {formatMoney(calculations.discountApplied)}</span>
                    </div>
                  )}

                  <div className={`flex justify-between items-center py-4 rounded-lg px-4 mt-2 border shadow-lg animate-on-scroll ${
                     calculations.marginStatus === 'negative' ? 'bg-red-600 border-red-500' :
                     calculations.marginStatus === 'excellent' ? 'bg-[#16A34A] border-green-600' :
                     'bg-[#DCFCE7] border-green-200'
                   }`}>
                     <span className={`font-bold font-iceland text-xl ${
                         calculations.marginStatus === 'negative' || calculations.marginStatus === 'excellent' ? 'text-white' : 'text-black'
                     }`}>Lucro Líquido</span>
                     <span className={`text-4xl font-bold ${
                         calculations.marginStatus === 'negative' || calculations.marginStatus === 'excellent' ? 'text-white' : 'text-black'
                     }`}>R$ {formatMoney(calculations.netRevenue)}</span>
                   </div>
                  <p className={`text-xs mt-1 font-semibold ${
                     ['negative', 'low', 'excellent'].includes(calculations.marginStatus)
                       ? 'text-white'
                       : 'text-green-800'
                   }`}>
                     {calculations.marginStatus === 'negative'
                        ? 'Resultado negativo. Ajuste preço ou custos.'
                        : calculations.marginStatus === 'low'
                          ? 'Lucro abaixo do recomendado.'
                          : calculations.marginStatus === 'excellent'
                            ? 'Lucro acima do recomendado.'
                            : 'Lucro dentro do recomendado.'}
                   </p>

                   <div className={`flex justify-between items-center py-4 rounded-lg px-4 border shadow-lg animate-on-scroll ${
                     calculations.marginStatus === 'negative' ? 'bg-red-600 border-red-500' :
                     calculations.marginStatus === 'excellent' ? 'bg-[#16A34A] border-green-600' :
                     'bg-[#DCFCE7] border-green-200'
                   }`}>
                     <span className={`font-bold font-iceland text-xl ${
                         calculations.marginStatus === 'negative' || calculations.marginStatus === 'excellent' ? 'text-white' : 'text-black'
                     }`}>Margem de Lucro</span>
                     <span className={`text-4xl font-bold ${
                         calculations.marginStatus === 'negative' || calculations.marginStatus === 'excellent' ? 'text-white' : 'text-black'
                     }`}>{formatPercent(calculations.actualMargin, 1)}%</span>
                   </div>
                  <p className={`text-xs mt-1 font-semibold ${
                     ['negative', 'low', 'excellent'].includes(calculations.marginStatus)
                       ? 'text-white'
                       : 'text-green-800'
                   }`}>
                     {calculations.marginStatus === 'negative'
                        ? 'Margem negativa. Reavalie a precificação.'
                        : calculations.marginStatus === 'low'
                          ? 'Margem abaixo da recomendação.'
                          : calculations.marginStatus === 'excellent'
                            ? 'Margem acima da recomendação.'
                            : 'Margem dentro da recomendação.'}
                   </p>
                </div>

                {/* Resultado das Variações - Logo abaixo de Lucro e Margem */}
                {variationCalculations.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-white mb-3">Variações do Produto</h3>
                    <div className="grid md:grid-cols-2 gap-4 animate-fadeIn">
                        {variationCalculations.map((v) => (
                             <Card key={v.id} className="bg-gradient-to-r from-gray-700 to-gray-800 border-none shadow-xl text-white">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-bold">{v.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between py-1">
                                            <span className="text-white/80">Preço Sugerido</span>
                                            <span className="font-bold">R$ {formatMoney(v.metrics.suggestedPrice)}</span>
                                        </div>
                                        <div className="flex justify-between py-1 font-bold border-t border-white/20 pt-2">
                                            <span>Lucro Líquido</span>
                                            <span className="text-green-300">R$ {formatMoney(v.metrics.netRevenue)}</span>
                                        </div>
                                        <div className="flex justify-between py-1 font-bold">
                                            <span>Margem</span>
                                            <span className="text-green-300">{formatPercent(v.metrics.actualMargin, 1)}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                             </Card>
                        ))}
                    </div>
                  </div>
                )}

                {/* Recomendação */}
                <div className="bg-black backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30 mt-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white mb-1">Margem Recomendada</p>
                      <p className="text-sm text-white/90">
                        Para produtos nesta faixa de preço (R$ {formatMoney(calculations.totalCost)}), 
                        recomendamos uma margem de <strong>{formatPercent(calculations.recommendedMargin, 0)}%</strong> para cobrir custos operacionais e garantir lucratividade.
                      </p>
                    </div>
                  </div>
                </div>
                

                
                
                {/* Tabela de Lucro por Unidade */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm mt-4 text-gray-800">
                    <div className="bg-green-600 p-2 text-center">
                        <p className="text-white font-bold">Projeção de Lucro</p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-green-100 hover:bg-green-100 border-b border-green-200">
                                <TableHead className="text-center font-bold text-green-800 h-8">Unidades Vendidas</TableHead>
                                <TableHead className="text-center font-bold text-green-800 h-8">Lucro Estimado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[10, 25, 50, 100, 250, 500, 1000].map((qty) => (
                                <TableRow key={qty} className="hover:bg-green-50 border-b border-gray-100 last:border-0">
                                    <TableCell className="text-center py-2 font-medium">
                                        <span className="font-bold">{qty}</span>
                                    </TableCell>
                                    <TableCell className="text-center py-2 font-bold text-green-700">
                                        R$ {(parseFloat(calculations.netRevenue) * qty).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Tabela de Perdas Estimadas */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm mt-4 text-gray-800">
                    <div className="bg-red-600 p-2 text-center">
                        <p className="text-white font-bold">Projeção de Perdas</p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-red-100 hover:bg-red-100 border-b border-red-200">
                                <TableHead className="text-center font-bold text-red-800 h-8">Unidades Devolvidas</TableHead>
                                <TableHead className="text-center font-bold text-red-800 h-8">Perdas Estimadas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[10, 25, 50, 100, 250, 500, 1000].map((qty) => {
                                // Calculate returned units based on return rate
                                const returnedUnits = Math.round(qty * (calculations.returnRate / 100));
                                // Calculate loss: returned units * loss per return
                                const totalLoss = returnedUnits * parseFloat(calculations.lossPerReturn);
                                
                                return (
                                <TableRow key={qty} className="hover:bg-red-50 border-b border-gray-100 last:border-0">
                                    <TableCell className="text-center py-2 font-medium">
                                        <span className="font-bold">{returnedUnits}</span>
                                    </TableCell>
                                    <TableCell className="text-center py-2 font-bold text-red-700">
                                        - R$ {totalLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                    {parseFloat(calculations.emergencyReserve) > 0 && (
                        <div className="p-3 bg-red-50 border-t border-red-100 text-center text-xs text-red-800">
                            <span className="font-bold">Reserva de Emergência Disponível (Total):</span> R$ {(parseFloat(calculations.emergencyReserve) * 50).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (para 50 unidades)
                        </div>
                    )}
                </div>
                  </>
                )}

                {/* Infraestrutura Técnica (Tráfego Orgânico) - MOVED HERE */}
                {trafficMode === 'organic' && (
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm mt-4 text-gray-800 border border-gray-200">
                     <div className="bg-indigo-600 p-2 text-center">
                        <p className="text-white font-bold flex items-center justify-center gap-2">
                            <Package className="w-4 h-4" />
                            Infraestrutura Técnica Disponível
                        </p>
                     </div>
                     <div className="p-4 space-y-4">
                        <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                           <h4 className="font-bold text-indigo-900 text-sm mb-2">N8N Workflow 1 - Criação de Conteúdo + Postagem</h4>
                           <div className="text-xs text-indigo-800 space-y-1">
                              <p><strong>Fluxo:</strong> Buscar Produtos → Criar Prompt (UGC) → Gemini (Grátis) → Criar Vídeo → Upload Múltiplo</p>
                              <p><strong>Ferramentas:</strong> n8n + API Gemini + MindVideo/Kie.ai</p>
                              <p className="mt-1 font-mono bg-white/50 p-1 rounded inline-block">
                                 Schedule → Code JS → AI Agent → HTTP Request → Wait → Upload Video
                              </p>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-bold text-gray-800 text-xs mb-2">Plataformas Suportadas (Grátis)</h4>
                                <ul className="text-xs space-y-1">
                                    <li className="flex items-center gap-1 text-green-700"><span className="text-green-500">✅</span> Pinterest</li>
                                    <li className="flex items-center gap-1 text-green-700"><span className="text-green-500">✅</span> Instagram</li>
                                    <li className="flex items-center gap-1 text-green-700"><span className="text-green-500">✅</span> Facebook</li>
                                    <li className="flex items-center gap-1 text-green-700"><span className="text-green-500">✅</span> YouTube</li>
                                    <li className="flex items-center gap-1 text-green-700"><span className="text-green-500">✅</span> X (Twitter)</li>
                                    <li className="flex items-center gap-1 text-green-700"><span className="text-green-500">✅</span> Threads</li>
                                    <li className="flex items-center gap-1 text-red-500 opacity-70"><span className="text-red-500">❌</span> TikTok (Apenas pago)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-xs mb-2">Serviço de Postagem</h4>
                                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                    <p className="font-bold text-xs">upload-post.com</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Plano Gratuito (Inicial):</p>
                                    <ul className="text-[10px] text-gray-600 mt-1 list-disc pl-3">
                                        <li>5 Perfis Sociais</li>
                                        <li>300 min API FFmpeg/mês</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-indigo-100 space-y-3">
                            <div>
                                <h4 className="font-bold text-gray-800 text-xs mb-1">Plano Gratuito Inicial</h4>
                                <p className="text-[10px] text-gray-600">
                                    Ideal para começar. O TikTok não está disponível na versão free. Considere upgrade futuro conforme a necessidade de escalar.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                    <p className="font-bold text-xs text-blue-600">Basic (€19/mês)</p>
                                    <p className="text-[10px] text-gray-500">20 Perfis, 600 min/mês</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                    <p className="font-bold text-xs text-purple-600">Pro (€49/mês)</p>
                                    <p className="text-[10px] text-gray-500">50 Perfis, 1500 min/mês</p>
                                </div>
                            </div>
                        </div>
                     </div>
                  </div>
                )}
              </ResultsPanel>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#fe2c55] text-white rounded-xl p-5 shadow-lg">
                <div className="grid gap-6 xl:grid-cols-2 mb-6">
                  {/* Coluna 1: Totais e Reservas */}
                  <div className="rounded-lg bg-white/15 p-3 h-full flex flex-col">
                    <div className="space-y-3 flex-1">
                      <div className="rounded-lg bg-white/15 p-3">
                        <p className="text-xs uppercase font-semibold tracking-wide">Total de produtos por marketplace</p>
                        <div className="mt-2 space-y-1 text-sm">
                          {Object.keys(marketplaceTotals).length === 0 ? (
                            <span className="text-white/80">Nenhum produto cadastrado</span>
                          ) : (
                            Object.entries(marketplaceTotals).map(([label, total]) => (
                              <div key={label} className="flex items-center justify-between">
                                <span>{label}</span>
                                <span className="font-bold">{total}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/15 p-3">
                        <p className="text-xs uppercase font-semibold tracking-wide">Capital de giro disponível</p>
                        <p className="mt-2 text-lg font-bold">R$ {formatMoney(parseCurrency(workingCapital || 0))}</p>
                      </div>
                      <div className="rounded-lg bg-white/15 p-3">
                        <p className="text-xs uppercase font-semibold tracking-wide">Reserva de emergência</p>
                        <p className="mt-2 text-lg font-bold">R$ {formatMoney(parseCurrency(emergencyReserve || 0))}</p>
                      </div>
                    </div>
                  </div>

                  {/* Coluna 2: Maior Preço (Agora mais largo) */}
                  <div className="rounded-lg bg-white/15 p-3 h-full">
                    <p className="text-xs uppercase font-semibold tracking-wide mb-3">Maior preço por marketplace</p>
                    <div className="space-y-2 text-sm">
                      {Object.keys(marketplaceMaxProducts).length === 0 ? (
                        <span className="text-white/80">Sem preços para exibir</span>
                      ) : (
                        Object.entries(marketplaceMaxProducts).map(([label, item]) => (
                          <div key={label} className="flex items-center gap-3 border-b border-white/10 pb-2 last:border-0 hover:bg-white/5 p-2 rounded-lg transition-colors">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name || label} className="h-12 w-12 flex-shrink-0 rounded-md object-cover border border-white/20" />
                            ) : (
                              <div className="h-12 w-12 flex-shrink-0 rounded-md border border-white/20 bg-white/10" />
                            )}
                            
                            <div className="flex-1 min-w-0 grid grid-cols-2 gap-4 items-center">
                              <div>
                                <p className="text-[10px] text-white/60 leading-tight block mb-0.5 whitespace-nowrap" title={label}>
                                  {formatMarketplaceDisplayLabel(label)}
                                </p>
                                {item.accountHolder && (
                                  <p className="text-[10px] text-white/50 truncate mb-0.5">
                                    {item.accountHolder.split(' ')[0]} - {item.accountType || 'CPF'}
                                  </p>
                                )}
                                <p className="text-xs font-bold text-white truncate" title={item.name}>{item.name ? item.name : '-'}</p>
                              </div>
                                <div className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <span className="text-[10px] text-white/60">Venda:</span>
                                    <span className="text-xs font-bold text-[#4DFF6B] whitespace-nowrap">R$ {formatMoney(item.price)}</span>
                                  </div>
                                  <div className="flex items-center justify-end gap-2">
                                    <span className="text-[10px] text-white/60">Custo:</span>
                                    <span className="text-[10px] text-white/80 whitespace-nowrap">R$ {formatMoney(item.cost)}</span>
                                  </div>
                                </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Linha Inferior: Projeção de Lucros (Full Width) */}
                <div className="rounded-lg bg-white/15 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase font-semibold tracking-wide">Projeção de lucros</p>
                    {filteredProjectionProducts.length > 0 && (
                       <div className="flex items-center gap-2 bg-black/20 rounded-full px-3 py-1">
                          <button onClick={() => setSelectedProductIndex((safeSelectedProductIndex - 1 + filteredProjectionProducts.length) % filteredProjectionProducts.length)} className="text-white hover:text-[#25f4ee] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                          <span className="text-xs font-medium text-white min-w-[100px] text-center truncate px-2">
                            {selectedProduct?.name || 'Selecione um produto'}
                          </span>
                          <button onClick={() => setSelectedProductIndex((safeSelectedProductIndex + 1) % filteredProjectionProducts.length)} className="text-white hover:text-[#25f4ee] transition-colors"><ChevronRight className="w-4 h-4" /></button>
                       </div>
                    )}
                  </div>

                  {selectedProduct ? (
                    <div className="flex flex-col gap-6 items-start">
                      {/* Card do Produto Selecionado */}
                      <div className="w-full flex flex-col gap-3">
                        <div className="w-full max-w-xs">
                          <Input
                            value={projectionSearch}
                            onChange={(event) => {
                              setProjectionSearch(event.target.value);
                              setSelectedProductIndex(0);
                            }}
                            placeholder="Buscar produto"
                            className="bg-black/20 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                        <h4 className="font-bold text-white text-xl md:text-2xl font-iceland tracking-wide pl-1">{selectedProduct.name}</h4>
                        
                        <div className="flex flex-col sm:flex-row items-end gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                          {selectedProduct.imageUrl ? (
                             <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover border border-white/20 shadow-sm" />
                          ) : (
                             <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                               <Package className="w-12 h-12 text-white/20" />
                             </div>
                          )}
                          
                          <div className="flex-1 min-w-0 w-full mb-0">
                              <div className="mb-2 pl-1">
                                  <p className="text-xs font-bold text-black line-clamp-1">{selectedProduct.supplierName || 'Sem fornecedor'}</p>
                                  <p className="text-[10px] text-white block">
                                      {getMarketplaceName(selectedProduct.marketplace)} - {selectedProduct.accountHolder || 'N/A'} {selectedProduct.accountType ? selectedProduct.accountType.toUpperCase() : ''}
                                  </p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/20 rounded-lg p-2 text-center border border-white/5 flex flex-col justify-center min-h-[100px]">
                                   <p className="text-[10px] text-white/50 uppercase mb-0.5">Venda</p>
                                   <p className="text-lg font-bold text-[#4DFF6B]">R$ {formatMoney(selectedProductUnitValue)}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <div className="bg-black/20 rounded-lg p-2 text-center border border-white/5 flex-1 flex flex-col justify-center">
                                     <p className="text-[10px] text-white/50 uppercase mb-0.5">Lucro Estimado</p>
                                     <p className="text-sm font-bold text-[#4DFF6B]">
                                       R$ {formatMoney(parseCurrency(String(selectedProduct.netRevenue || 0)) || (parseCurrency(String(selectedProduct.sellingPrice || 0)) - parseCurrency(String(selectedProduct.costPrice || 0))))}
                                     </p>
                                  </div>
                                  <div className="bg-black/20 rounded-lg p-2 text-center border border-white/5 flex-1 flex flex-col justify-center">
                                     <p className="text-[10px] text-white/50 uppercase mb-0.5">Compra</p>
                                     <p className="text-sm text-white/80">R$ {formatMoney(parseCurrency(String(selectedProduct.costPrice || 0)))}</p>
                                  </div>
                                </div>
                              </div>
                          </div>
                        </div>
                      </div>

                    {/* Grid de Projeção */}
                    <div className="w-full">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {projectionUnits.map((qty) => {
                           const revenue = parseCurrency(String(selectedProduct.netRevenue || 0));
                           const grossProfit = parseCurrency(String(selectedProduct.sellingPrice || 0)) - parseCurrency(String(selectedProduct.costPrice || 0));
                           const profitUnit = revenue !== 0 ? revenue : grossProfit;
                           const totalProfit = profitUnit * qty;
                           
                           return (
                              <div key={qty} className="rounded-xl bg-white/10 p-4 border border-white/5 hover:bg-white/15 transition-all hover:scale-[1.02] group flex flex-col justify-center items-center text-center">
                                <p className="text-[10px] uppercase text-white/60 mb-2">Vender {qty} un</p>
                                <p className="text-sm sm:text-lg font-bold text-white group-hover:text-[#4DFF6B] transition-colors whitespace-nowrap">
                                  {formatProfitValue(totalProfit)}
                                </p>
                              </div>
                           );
                        })}
                      </div>
                    </div>
                   </div>
                  ) : (
                    <div className="text-center py-8 text-white/40">
                      <p>{projectionSearch ? 'Nenhum produto encontrado para a busca' : 'Nenhum produto selecionado para projeção'}</p>
                    </div>
                  )}
                </div>
              </div>
              {showProductsList ? (
                <Card className="shadow-xl border-gray-100 animate-on-scroll !bg-white">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <div className="flex flex-row items-center gap-2">
                      <Package className="w-6 h-6 text-pink-600" />
                      <CardTitle className="text-2xl font-bold text-gray-800 font-iceland">Produtos adicionados</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                      <Select value={productFilters.marketplace} onValueChange={(value) => handleProductFilterChange('marketplace', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Marketplace" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
                          <SelectItem value="shopee">Shopee</SelectItem>
                          <SelectItem value="enjoei">Enjoei</SelectItem>
                          <SelectItem value="tiktok">Tiktok Shop</SelectItem>
                          <SelectItem value="shein">Shein</SelectItem>
                          <SelectItem value="amazon">Amazon</SelectItem>
                          <SelectItem value="wordpress">Wordpress (Site)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Fornecedor"
                        value={productFilters.supplier}
                        onChange={(event) => handleProductFilterChange('supplier', event.target.value)}
                      />
                      <Input
                        placeholder="CNPJ"
                        value={productFilters.cnpj}
                        onChange={(event) => handleProductFilterChange('cnpj', event.target.value)}
                      />
                      <Input
                        placeholder="Titular"
                        value={productFilters.holder}
                        onChange={(event) => handleProductFilterChange('holder', event.target.value)}
                      />
                      <Select value={productFilters.accountType} onValueChange={(value) => handleProductFilterChange('accountType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de conta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="cnpj">CNPJ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {isProductsLoadingState ? (
                      <div className="text-sm text-gray-500">Carregando produtos...</div>
                    ) : effectiveProducts.length === 0 ? (
                      <div className="text-sm text-gray-500">Nenhum produto adicionado ainda.</div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-sm text-gray-500">Nenhum produto encontrado com os filtros atuais.</div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {pagedProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onDelete={handleDeleteProductAnimated}
                            onEdit={handleEditProductClick}
                          />
                        ))}
                      </div>
                    )}
                    {totalPages > 1 ? (
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        >
                          Anterior
                        </Button>
                        <span className="text-xs text-gray-500">
                          Página {currentPage} de {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        >
                          Próxima
                        </Button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

              ) : null}

              {/* Taxas dos Marketplaces (Informativo) */}
              <div className="!bg-white rounded-xl">
              <CollapsibleSection title="Taxas dos Marketplaces (Referência)" icon={<AlertCircle className="w-6 h-6 text-blue-600" />}>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="bg-white rounded-lg p-4 border border-pink-100">
                    <h5 className="font-bold text-[#fe2c55] mb-2">📦 Mercado Livre Clássico</h5>
                    <ul className="space-y-1 ml-4">
                      <li>• <strong>Comissão:</strong> 10% a 14% sobre o valor da venda (varia por categoria)</li>
                      <li>• <strong>Custo Fixo:</strong> R$ 6,00 a R$ 6,75 (produtos abaixo de R$ 79)</li>
                      <li>• <strong>Frete Grátis:</strong> Obrigatório acima de R$ 79 (pago pelo vendedor, com descontos por reputação)</li>
                      <li>• <strong>Visibilidade:</strong> Alta</li>
                      <li>• <strong>Parcelamento:</strong> Não inclui parcelamento sem juros</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-pink-100">
                    <h5 className="font-bold text-[#fe2c55] mb-2">⭐ Anúncio Premium (Mercado Livre)</h5>
                    <ul className="space-y-1 ml-4">
                      <li>• <strong>Comissão:</strong> 15% a 19% sobre o valor da venda (varia por categoria)</li>
                      <li>• <strong>Custo Fixo:</strong> R$ 6,00 a R$ 6,75 (produtos abaixo de R$ 79)</li>
                      <li>• <strong>Visibilidade:</strong> Máxima - destaque e prioridade nas buscas</li>
                      <li>• <strong>Parcelamento:</strong> Até 12x sem juros para o comprador</li>
                      <li>• <strong>Benefício:</strong> Maior conversão de vendas pela visibilidade</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-pink-100">
                    <h5 className="font-bold text-[#fe2c55] mb-2">🛍️ Shopee</h5>
                    <ul className="space-y-1 ml-4">
                      <li>• <strong>Com Frete Grátis:</strong> 14% comissão + 6% frete + R$ 4 fixo*</li>
                      <li>• <strong>Sem Frete Grátis:</strong> 12% comissão + 2% transação + R$ 4 fixo*</li>
                      <li>• <strong>*Produtos abaixo de R$ 8:</strong> Taxa fixa é 50% do valor do item (não R$ 4)</li>
                    </ul>
                  </div>

                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-gray-800 font-semibold mb-2">💡 Dicas Importantes:</p>
                    <ul className="space-y-1 ml-4 text-gray-700">
                      <li>• O custo fixo varia conforme o preço: R$ 6,00 (até R$ 40), R$ 6,50 (R$ 40-60), R$ 6,75 (R$ 60-79)</li>
                      <li>• A margem recomendada já considera custos operacionais e embalagem</li>
                      <li>• No Mercado Livre, o Premium tem maior custo mas gera mais vendas pela visibilidade</li>
                      <li>• Valores atualizados conforme políticas de 2024 dos marketplaces</li>
                    </ul>
                  </div>
                </div>
              </CollapsibleSection>
              </div>
            </div>
          )}

        </div>
        <footer className="mt-12 pt-8 border-t border-white/10 text-center pb-4">
          <p className="text-gray-400 text-sm font-medium font-iceland tracking-wide">Desenvolvido por: Jonatan Renan</p>
          <p className="text-gray-600 text-xs mt-1">Alob Express © todos os direitos reservados</p>
        </footer>
        </div>
      </div>
      <EditProductDialog
        product={editingProduct}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEditProduct}
      />
    </div>
  );
};

export default DropshippingCalculator;
