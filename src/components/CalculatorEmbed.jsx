"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

const CalculatorEmbed = ({ src, title }) => {
  const [iframeHeight, setIframeHeight] = useState("800px");
  const [showFallback, setShowFallback] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authSession, setAuthSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const iframeRef = useRef(null);
  const iframeReadyRef = useRef(false);
  const latestProductsRef = useRef([]);
  const organizationIdRef = useRef(null);
  const organizationIdPromiseRef = useRef(null);
  const organizationIdBlockedUntilRef = useRef(0);
  const syncLoopTokenRef = useRef(0);

  const sendToIframe = useCallback((payload) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(payload, "*");
  }, []);

  const callCalculatorApi = useCallback(
    async (action, payload) => {
      const token = authSession?.access_token;
      if (!token) {
        return { ok: false, status: 401, data: null };
      }

      let response;
      try {
        response = await fetch("/api/calculator", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action, payload }),
          credentials: "omit",
        });
      } catch (error) {
        return { ok: false, status: 0, data: { error: String(error?.message ?? error) } };
      }

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      return { ok: response.ok, status: response.status, data };
    },
    [authSession?.access_token],
  );

  const fetchSettings = useCallback(
    async (organizationId) => {
      const result = await callCalculatorApi("SETTINGS_GET", { organizationId });
      if (!result.ok) {
        return { emergencyReserve: 0, workingCapital: 0 };
      }
      return {
        emergencyReserve: result.data?.emergencyReserve ?? 0,
        workingCapital: result.data?.workingCapital ?? 0,
      };
    },
    [callCalculatorApi],
  );

  const fetchProducts = useCallback(
    async (organizationId) => {
      const result = await callCalculatorApi("PRODUCTS_LIST", { organizationId });
      if (!result.ok) return [];
      return Array.isArray(result.data?.products) ? result.data.products : [];
    },
    [callCalculatorApi],
  );

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

  useEffect(() => {
    let isMounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setAuthUser(data?.session?.user ?? null);
        setAuthSession(data?.session ?? null);
        setAuthChecked(true);
      })
      .catch(() => {
        if (!isMounted) return;
        setAuthUser(null);
        setAuthSession(null);
        setAuthChecked(true);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setAuthUser(session?.user ?? null);
      setAuthSession(session ?? null);
      setAuthChecked(true);
    });

    return () => {
      isMounted = false;
      data?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    organizationIdRef.current = null;
    organizationIdPromiseRef.current = null;
    organizationIdBlockedUntilRef.current = 0;
    syncLoopTokenRef.current += 1;
  }, [authUser?.id]);

  const resolveOrganizationId = useCallback(async () => {
    if (!authUser?.id) return null;
    if (organizationIdRef.current) return organizationIdRef.current;
    const now = Date.now();
    if (now < organizationIdBlockedUntilRef.current) return null;

    if (organizationIdPromiseRef.current) {
      return await organizationIdPromiseRef.current;
    }

    organizationIdPromiseRef.current = (async () => {
      const result = await callCalculatorApi("ACTIVE_ORG");
      const organizationId =
        typeof result.data?.organizationId === "string" ? result.data.organizationId : null;
      if (organizationId) {
        organizationIdRef.current = organizationId;
        organizationIdBlockedUntilRef.current = 0;
        return organizationId;
      }
      organizationIdBlockedUntilRef.current = Date.now() + 1500;
      return null;
    })();

    try {
      return await organizationIdPromiseRef.current;
    } finally {
      organizationIdPromiseRef.current = null;
    }
  }, [authUser?.id, callCalculatorApi]);

  const startSyncLoop = useCallback(
    (options = {}) => {
      if (!authChecked || !authUser?.id) return;
      const { attemptDelayMs = 500, maxAttempts = 10 } = options;
      const token = ++syncLoopTokenRef.current;

      const run = async (attempt) => {
        if (syncLoopTokenRef.current !== token) return;
        if (!authChecked || !authUser?.id) return;

        const organizationId = await resolveOrganizationId();
        if (syncLoopTokenRef.current !== token) return;

        if (!organizationId) {
          if (attempt >= maxAttempts) return;
          window.setTimeout(
            () => run(attempt + 1),
            attemptDelayMs + Math.min(1500, attempt * 250)
          );
          return;
        }

        await syncProducts(organizationId);
        await syncSettings(organizationId);
      };

      run(0);
    },
    [authChecked, authUser?.id, resolveOrganizationId, syncProducts, syncSettings]
  );

  const handleIframeLoad = useCallback(async () => {
    console.log("CalculatorEmbed: Iframe loaded (network level)");
    if (!authChecked || !authUser?.id) {
      latestProductsRef.current = [];
      sendToIframe({ type: "CALCULATOR_PRODUCTS_LIST", products: [] });
      return;
    }

    const organizationId = await resolveOrganizationId();
    if (!organizationId) {
      startSyncLoop();
      return;
    }

    await syncProducts(organizationId);
    await syncSettings(organizationId);
  }, [authChecked, authUser?.id, resolveOrganizationId, sendToIframe, startSyncLoop, syncProducts, syncSettings]);

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
        if (event.data.type === "CALCULATOR_READY" && authChecked && authUser?.id) {
          startSyncLoop();
        }
      }

      if (event.data && event.data.type === "CALCULATOR_HEIGHT") {
        setIframeHeight(`${event.data.height}px`);
        if (latestProductsRef.current.length > 0) {
          sendToIframe({
            type: "CALCULATOR_PRODUCTS_LIST",
            products: latestProductsRef.current,
          });
        }
        if (authUser?.id) {
          const organizationId = await resolveOrganizationId();
          if (organizationId) {
            await syncSettings(organizationId);
          } else if (authChecked) {
            startSyncLoop();
          }
        }
        return;
      }

      if (!event.data || !event.data.type) return;

      const organizationId = authUser?.id ? await resolveOrganizationId() : null;
      if (event.data.type === "CALCULATOR_PRODUCTS_FETCH") {
        if (!organizationId) {
          if (authChecked && authUser?.id) {
            startSyncLoop();
            return;
          }
          latestProductsRef.current = [];
          sendToIframe({ type: "CALCULATOR_PRODUCTS_LIST", products: [] });
          return;
        }
        await syncProducts(organizationId);
        return;
      }

      if (event.data.type === "CALCULATOR_SETTINGS_FETCH") {
        if (!organizationId) {
          if (authChecked && authUser?.id) {
            startSyncLoop();
            return;
          }
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

        const result = await callCalculatorApi("PRODUCT_UPSERT", {
          organizationId,
          product: payload,
        });
        if (!result.ok) {
          if (result.status === 409) {
            sendToIframe({
              type: "CALCULATOR_PRODUCT_ERROR",
              message: "Produto já cadastrado.",
            });
            return;
          }
          sendToIframe({
            type: "CALCULATOR_PRODUCT_ERROR",
            message: payload.id
              ? "Não foi possível atualizar o produto."
              : "Não foi possível cadastrar o produto.",
          });
          return;
        }

        const products = Array.isArray(result.data?.products) ? result.data.products : [];
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
        const result = await callCalculatorApi("PRODUCT_DELETE", {
          organizationId,
          id: payload.id,
        });
        if (!result.ok) {
          sendToIframe({
            type: "CALCULATOR_PRODUCT_ERROR",
            message: "Não foi possível excluir o produto.",
          });
          return;
        }
        const products = Array.isArray(result.data?.products) ? result.data.products : [];
        latestProductsRef.current = products;
        sendToIframe({ type: "CALCULATOR_PRODUCT_DELETED", products });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(fallbackTimer);
    };
  }, [authChecked, authUser?.id, fetchProducts, resolveOrganizationId, sendToIframe, startSyncLoop, syncProducts, syncSettings]);

  useEffect(() => {
    if (!authUser?.id) return;
    startSyncLoop({ attemptDelayMs: 400, maxAttempts: 12 });
  }, [authUser?.id, startSyncLoop]);

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
