import { createClient } from "@supabase/supabase-js";

const resolveSupabaseUrl = (value) => {
  if (!value) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
};

const supabaseUrl = resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const createRequestClient = (accessToken) => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};

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
    } catch {
      meta = {};
    }
  }
  return {
    id: row.id,
    name: row.name,
    sku: meta.sku || "",
    sellingPrice: row.price,
    imageUrl: meta.imageUrl || "",
    colorHex: meta.colorHex || "#16A34A",
    marginStatus: meta.marginStatus || "positive",
    supplierName: meta.supplierName || "",
    costPrice: meta.costPrice || 0,
    marketplace: meta.marketplace || "",
    accountHolder: meta.accountHolder || "",
    accountType: meta.accountType || "",
    netRevenue: meta.netRevenue || 0,
    variations: meta.variations || [],
    stockQuantity: row.stock_quantity ?? 0,
  };
};

const getActiveOrganizationId = async (supabase) => {
  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id,joined_at")
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return { organizationId: null, error };
  return { organizationId: data?.organization_id ?? null, error: null };
};

const fetchProducts = async (supabase, organizationId) => {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,price,description,sku,created_at,stock_quantity")
    .eq("organization_id", organizationId)
    .like("sku", "calc-%")
    .order("created_at", { ascending: false });
  if (error) return { products: [], error };
  return { products: (data || []).map(mapProduct), error: null };
};

const fetchSettings = async (supabase, organizationId) => {
  const { data, error } = await supabase
    .from("organizations")
    .select("emergency_reserve,working_capital")
    .eq("id", organizationId)
    .maybeSingle();
  if (error || !data) {
    return { emergencyReserve: 0, workingCapital: 0, error: error ?? null };
  }
  return {
    emergencyReserve: data.emergency_reserve ?? 0,
    workingCapital: data.working_capital ?? 0,
    error: null,
  };
};

export async function POST(request) {
  try {
    // SYSTEMATIC DEBUGGING: Header Instrumentation
    const cookieHeader = request.headers.get("cookie") || "";
    const authHeader = request.headers.get("authorization") || "";
    const totalHeaderSize = [...request.headers.entries()].reduce((acc, [k, v]) => acc + k.length + v.length, 0);
    const cookieCount = cookieHeader.split(';').length;
    
    console.log(`[API/Calculator] Debug:`, {
      totalHeaderSize,
      cookieHeaderSize: cookieHeader.length,
      cookieCount,
      authHeaderSize: authHeader.length,
      url: request.url
    });

    let body = null;
    try {
      body = await request.json();
    } catch {
      body = null;
    }

    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    const tokenFromBody = typeof body?.accessToken === "string" ? body.accessToken : "";
    const accessToken = tokenFromHeader || tokenFromBody;
    if (!accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createRequestClient(accessToken);
    if (!supabase) {
      return Response.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const action = String(body?.action ?? "");
    const payload = body?.payload ?? {};

  if (action === "ACTIVE_ORG") {
    const result = await getActiveOrganizationId(supabase);
    if (result.error) {
      return Response.json(
        { error: "Failed to resolve organization", details: result.error?.message ?? null },
        { status: 500 },
      );
    }
    return Response.json({ organizationId: result.organizationId });
  }

  const requestedOrganizationId =
    typeof payload?.organizationId === "string" && payload.organizationId ? payload.organizationId : null;
  const orgResult = requestedOrganizationId
    ? { organizationId: requestedOrganizationId, error: null }
    : await getActiveOrganizationId(supabase);

  if (orgResult.error) {
    return Response.json(
      { error: "Failed to resolve organization", details: orgResult.error?.message ?? null },
      { status: 500 },
    );
  }

  const organizationId = orgResult.organizationId;
  if (!organizationId) {
    return Response.json({ organizationId: null });
  }

  if (action === "PRODUCTS_LIST") {
    const result = await fetchProducts(supabase, organizationId);
    if (result.error) {
      return Response.json(
        { error: "Failed to fetch products", details: result.error?.message ?? null },
        { status: 500 },
      );
    }
    return Response.json({ organizationId, products: result.products });
  }

  if (action === "SETTINGS_GET") {
    const result = await fetchSettings(supabase, organizationId);
    if (result.error) {
      return Response.json(
        { error: "Failed to fetch settings", details: result.error?.message ?? null },
        { status: 500 },
      );
    }
    return Response.json({
      organizationId,
      emergencyReserve: result.emergencyReserve,
      workingCapital: result.workingCapital,
    });
  }

  if (action === "PRODUCT_UPSERT") {
    const productPayload = payload?.product ?? {};
    const isEdit = Boolean(productPayload?.id);

    if (
      !productPayload?.name ||
      !productPayload?.sellingPrice ||
      !productPayload?.imageUrl ||
      !productPayload?.supplierName ||
      !productPayload?.costPrice ||
      productPayload?.stockQuantity === undefined ||
      productPayload?.stockQuantity === null ||
      productPayload?.stockQuantity === ""
    ) {
      return Response.json({ error: "Invalid product" }, { status: 400 });
    }

    if (!isEdit) {
      const { data: existingData, error: existingError } = await supabase
        .from("products")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("name", productPayload.name)
        .like("sku", "calc-%")
        .limit(1)
        .maybeSingle();
      if (existingError) {
        return Response.json(
          { error: "Failed to validate product", details: existingError?.message ?? null },
          { status: 500 },
        );
      }
      if (existingData?.id) {
        return Response.json({ error: "Duplicate product" }, { status: 409 });
      }
    }

    const description = JSON.stringify({
      sku: productPayload.sku || "",
      imageUrl: productPayload.imageUrl,
      colorHex: productPayload.colorHex,
      marginStatus: productPayload.marginStatus,
      supplierName: productPayload.supplierName,
      costPrice: parsePrice(productPayload.costPrice),
      marketplace: productPayload.marketplace || "",
      amazonPlan: productPayload.amazonPlan,
      amazonCategory: productPayload.amazonCategory,
      netRevenue: parsePrice(productPayload.netRevenue),
      accountHolder: productPayload.accountHolder || "",
      accountType: productPayload.accountType || "",
      variations: productPayload.variations || [],
    });

    const normalizedPrice = parsePrice(productPayload.sellingPrice);
    const normalizedStock = Math.max(0, Math.floor(parsePrice(productPayload.stockQuantity)));

    if (isEdit) {
      const { error } = await supabase
        .from("products")
        .update({
          name: productPayload.name,
          description,
          price: normalizedPrice,
          stock_quantity: normalizedStock,
        })
        .eq("organization_id", organizationId)
        .eq("id", productPayload.id)
        .like("sku", "calc-%");
      if (error) {
        return Response.json(
          { error: "Failed to update product", details: error?.message ?? null },
          { status: 500 },
        );
      }
    } else {
      const { error } = await supabase.from("products").insert({
        organization_id: organizationId,
        name: productPayload.name,
        description,
        price: normalizedPrice,
        stock_quantity: normalizedStock,
        sku: `calc-${Date.now()}`,
        is_digital: true,
      });
      if (error) {
        return Response.json(
          { error: "Failed to create product", details: error?.message ?? null },
          { status: 500 },
        );
      }
    }

    const result = await fetchProducts(supabase, organizationId);
    if (result.error) {
      return Response.json(
        { error: "Failed to fetch products", details: result.error?.message ?? null },
        { status: 500 },
      );
    }
    return Response.json({ organizationId, products: result.products });
  }

  if (action === "PRODUCT_DELETE") {
    const productId = String(payload?.id ?? "");
    if (!productId) return Response.json({ error: "Invalid product" }, { status: 400 });

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("organization_id", organizationId)
      .eq("id", productId)
      .like("sku", "calc-%");
    if (error) {
      return Response.json(
        { error: "Failed to delete product", details: error?.message ?? null },
        { status: 500 },
      );
    }

    const result = await fetchProducts(supabase, organizationId);
    if (result.error) {
      return Response.json(
        { error: "Failed to fetch products", details: result.error?.message ?? null },
        { status: 500 },
      );
    }
    return Response.json({ organizationId, products: result.products });
  }

  return Response.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    console.error("API Calculator Error:", error);
    return Response.json(
      { error: "Internal Server Error", details: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}
