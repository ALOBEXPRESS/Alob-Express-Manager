"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { getActiveOrganizationId } from "@/features/core/services/organization-membership";

const parsePrice = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  return Number(String(value).replace(/\./g, "").replace(",", ".")) || 0;
};

const mapProduct = (row) => {
  let meta = {};
  if (row?.description) {
    try {
      meta = JSON.parse(row.description);
    } catch (e) {
      meta = {};
    }
  }
  return {
    id: row.id,
    name: row.name,
    sellingPrice: row.price,
    imageUrl: meta.imageUrl || "",
    colorHex: meta.colorHex || "#16A34A",
    marginStatus: meta.marginStatus || "positive",
    supplierName: meta.supplierName || "",
    costPrice: meta.costPrice || 0,
    marketplace: meta.marketplace || "",
    netRevenue: meta.netRevenue || 0,
  };
};

const CalculatorEmbed = ({ src, title }) => {
  const [iframeHeight, setIframeHeight] = useState("800px");
  const [showFallback, setShowFallback] = useState(false);
  const iframeRef = useRef(null);
  const iframeReadyRef = useRef(false);
  const latestProductsRef = useRef([]);

  const sendToIframe = useCallback((payload) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(payload, "*");
  }, []);

  const fetchSettings = useCallback(async (organizationId) => {
    const { data, error } = await supabase
      .from("organizations")
      .select("emergency_reserve,working_capital")
      .eq("id", organizationId)
      .maybeSingle();
    if (error || !data) {
      return { emergencyReserve: 0, workingCapital: 0 };
    }
    return {
      emergencyReserve: data.emergency_reserve ?? 0,
      workingCapital: data.working_capital ?? 0,
    };
  }, []);

  const fetchProducts = useCallback(async (organizationId) => {
    const { data, error } = await supabase
      .from("products")
      .select("id,name,price,description,sku,created_at")
      .eq("organization_id", organizationId)
      .like("sku", "calc-%")
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data || []).map(mapProduct);
  }, []);

  const syncProducts = useCallback(async (organizationId) => {
    const products = await fetchProducts(organizationId);
    latestProductsRef.current = products;
    if (iframeReadyRef.current) {
      sendToIframe({ type: "CALCULATOR_PRODUCTS_LIST", products });
    }
  }, [fetchProducts, sendToIframe]);

  const syncSettings = useCallback(
    async (organizationId) => {
      const settings = await fetchSettings(organizationId);
      if (iframeReadyRef.current) {
        sendToIframe({
          type: "CALCULATOR_SETTINGS",
          emergencyReserve: settings.emergencyReserve,
          workingCapital: settings.workingCapital,
        });
      }
    },
    [fetchSettings, sendToIframe]
  );

  const handleIframeLoad = useCallback(async () => {
    console.log("CalculatorEmbed: Iframe loaded (network level)");
    // Note: We do NOT set iframeReadyRef.current = true here anymore.
    // We wait for the app to send a message (CALCULATOR_HEIGHT or others) to confirm it is running.
    // However, we still attempt to sync in case it IS ready but just hasn't sent height yet.
    
    const organizationId = await getActiveOrganizationId();
    console.log("CalculatorEmbed: Organization ID:", organizationId);
    
    if (!organizationId) {
      console.warn("CalculatorEmbed: No active organization found.");
      latestProductsRef.current = [];
      sendToIframe({ type: "CALCULATOR_PRODUCTS_LIST", products: [] });
      return;
    }
    await syncProducts(organizationId);
    await syncSettings(organizationId);
  }, [sendToIframe, syncProducts, syncSettings]);

  useEffect(() => {
    iframeReadyRef.current = false;
    setShowFallback(false);
    const fallbackTimer = window.setTimeout(() => {
      if (!iframeReadyRef.current) {
        setShowFallback(true);
      }
    }, 10000);

    const handleMessage = async (event) => {
      if (event.data && event.data.type && typeof event.data.type === "string" && event.data.type.startsWith("CALCULATOR_")) {
        iframeReadyRef.current = true;
        setShowFallback(false);
      }

      if (event.data && event.data.type === "CALCULATOR_HEIGHT") {
        setIframeHeight(`${event.data.height}px`);
        if (latestProductsRef.current.length > 0) {
          sendToIframe({
            type: "CALCULATOR_PRODUCTS_LIST",
            products: latestProductsRef.current,
          });
        }
        const organizationId = await getActiveOrganizationId();
        if (organizationId) {
          await syncSettings(organizationId);
        }
        return;
      }

      if (!event.data || !event.data.type) return;

      const organizationId = await getActiveOrganizationId();
      if (event.data.type === "CALCULATOR_PRODUCTS_FETCH") {
        if (!organizationId) {
          latestProductsRef.current = [];
          sendToIframe({ type: "CALCULATOR_PRODUCTS_LIST", products: [] });
          return;
        }
        await syncProducts(organizationId);
        return;
      }

      if (event.data.type === "CALCULATOR_SETTINGS_FETCH") {
        if (!organizationId) {
          sendToIframe({
            type: "CALCULATOR_SETTINGS",
            emergencyReserve: 0,
            workingCapital: 0,
          });
          return;
        }
        await syncSettings(organizationId);
        return;
      }

      if (event.data.type === "CALCULATOR_ADD_PRODUCT") {
        if (!organizationId) {
          sendToIframe({
            type: "CALCULATOR_PRODUCT_ERROR",
            message: "Faça login para salvar produtos.",
          });
          return;
        }
        const payload = event.data.payload || {};
        if (
          !payload.name ||
          !payload.sellingPrice ||
          !payload.imageUrl ||
          !payload.supplierName ||
          !payload.costPrice ||
          payload.stockQuantity === undefined ||
          payload.stockQuantity === null ||
          payload.stockQuantity === ""
        ) {
          sendToIframe({
            type: "CALCULATOR_PRODUCT_ERROR",
            message: "Preencha os dados obrigatórios antes de salvar.",
          });
          return;
        }

        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("organization_id", organizationId)
          .eq("name", payload.name)
          .like("sku", "calc-%")
          .limit(1)
          .maybeSingle();

        const description = JSON.stringify({
          imageUrl: payload.imageUrl,
          colorHex: payload.colorHex,
          marginStatus: payload.marginStatus,
          supplierName: payload.supplierName,
          costPrice: parsePrice(payload.costPrice),
          marketplace: payload.marketplace || "",
          amazonPlan: payload.amazonPlan,
          amazonCategory: payload.amazonCategory,
          netRevenue: parsePrice(payload.netRevenue),
          variations: payload.variations || [],
        });

        const normalizedPrice = parsePrice(payload.sellingPrice);
        const normalizedStock = Math.max(0, Math.floor(parsePrice(payload.stockQuantity)));

        if (existing?.id) {
           sendToIframe({
            type: "CALCULATOR_PRODUCT_ERROR",
            message: "Produto já cadastrado.",
          });
          return;
        } else {
          await supabase.from("products").insert({
            organization_id: organizationId,
            name: payload.name,
            description,
            price: normalizedPrice,
            stock_quantity: normalizedStock,
            sku: `calc-${Date.now()}`,
            is_digital: true,
          });
        }

        const products = await fetchProducts(organizationId);
        latestProductsRef.current = products;
        sendToIframe({ type: "CALCULATOR_PRODUCT_SAVED", products });
      }

      if (event.data.type === "CALCULATOR_DELETE_PRODUCT") {
        if (!organizationId) {
          sendToIframe({
            type: "CALCULATOR_PRODUCT_ERROR",
            message: "Faça login para excluir produtos.",
          });
          return;
        }
        const payload = event.data.payload || {};
        if (!payload.id) {
          sendToIframe({
            type: "CALCULATOR_PRODUCT_ERROR",
            message: "Produto inválido para exclusão.",
          });
          return;
        }
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("organization_id", organizationId)
          .eq("id", payload.id)
          .like("sku", "calc-%");
        if (error) {
          sendToIframe({
            type: "CALCULATOR_PRODUCT_ERROR",
            message: "Não foi possível excluir o produto.",
          });
          return;
        }
        const products = await fetchProducts(organizationId);
        latestProductsRef.current = products;
        sendToIframe({ type: "CALCULATOR_PRODUCT_DELETED", products });
      }
    };

    window.addEventListener("message", handleMessage);
    getActiveOrganizationId().then((organizationId) => {
      if (organizationId) {
        syncProducts(organizationId);
        syncSettings(organizationId);
      }
    });

    return () => {
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(fallbackTimer);
    };
  }, [fetchProducts, sendToIframe, syncProducts, syncSettings]);

  return (
    <div className="w-100 position-relative" style={{ height: iframeHeight, minHeight: "100px", transition: "height 0.3s ease" }}>
      {showFallback && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white radius-8 border">
          <div className="text-center p-4">
            <h6 className="mb-2">{title}</h6>
            <p className="text-sm text-secondary-light mb-3">
              A calculadora não respondeu. Se estiver em desenvolvimento local, inicie a aplicação da calculadora.
            </p>
            <div className="text-start bg-neutral-50 border radius-8 p-3 mb-3">
              <div className="text-xs text-secondary-light">Terminal</div>
              <div className="text-sm">cd dropshipping-calculator-app</div>
              <div className="text-sm">pnpm install</div>
              <div className="text-sm">pnpm dev</div>
            </div>
            <a className="btn btn-primary-600" href={src} target="_blank" rel="noreferrer">
              Abrir calculadora
            </a>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className="w-100 h-100 border-0 radius-8"
        allow="clipboard-read; clipboard-write"
        style={{ overflow: "auto" }}
        onLoad={handleIframeLoad}
      />
    </div>
  );
};

export default CalculatorEmbed;
