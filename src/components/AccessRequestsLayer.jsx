"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase, getSafeUser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AccessRequestsLayer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")?.[1] || "pt-br";
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [tempPasswords, setTempPasswords] = useState({});

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    const { data, error: fetchError } = await supabase
      .from("access_requests")
      .select("id,email,status,created_at,reviewed_at")
      .order("created_at", { ascending: false });
    if (fetchError) {
      setError("Não foi possível carregar as solicitações.");
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const { user } = await getSafeUser();
      if (!user) {
        router.push(`/${locale}/sign-in`);
        return;
      }
      const { data: adminRow } = await supabase
        .from("app_admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!adminRow) {
        setAdmin(false);
        setLoading(false);
        return;
      }
      setAdmin(true);
      await loadRequests();
    };
    init();
  }, [locale, router]);

  const handleAction = async (requestId, action) => {
    setActionLoading(requestId);
    setError("");
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) {
      setError("Sessão expirada. Faça login novamente.");
      setActionLoading("");
      return;
    }
    const response = await fetch(`/api/access-requests/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId }),
    });
    if (!response.ok) {
      setError("Não foi possível concluir a ação.");
      setActionLoading("");
      return;
    }
    const payload = await response.json();
    if (payload?.tempPassword) {
      setTempPasswords((prev) => ({
        ...prev,
        [requestId]: payload.tempPassword,
      }));
    }
    await loadRequests();
    setActionLoading("");
  };

  return (
    <div className="row gy-4">
      <div className="col-12">
        <Card className="shadow-sm">
          <CardHeader className="d-flex flex-row align-items-center justify-content-between">
            <CardTitle>Solicitações de acesso</CardTitle>
            <Button variant="outline" onClick={loadRequests} disabled={loading}>
              Atualizar
            </Button>
          </CardHeader>
          <CardContent>
            {!admin ? (
              <div className="shadcn-alert-error">
                Você não tem permissão para visualizar esta página.
              </div>
            ) : loading ? (
              <div>Carregando solicitações...</div>
            ) : error ? (
              <div className="shadcn-alert-error">{error}</div>
            ) : requests.length === 0 ? (
              <div>Nenhuma solicitação pendente.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>E-mail</th>
                      <th>Status</th>
                      <th>Solicitado em</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((item) => (
                      <tr key={item.id}>
                        <td>{item.email}</td>
                        <td className="text-capitalize">{item.status}</td>
                        <td>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString("pt-BR")
                            : "-"}
                        </td>
                        <td className="d-flex gap-2">
                          <div className="d-flex gap-2">
                            <Button
                              type="button"
                              onClick={() => handleAction(item.id, "approve")}
                              disabled={actionLoading === item.id}
                            >
                              Aprovar
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleAction(item.id, "reject")}
                              disabled={actionLoading === item.id}
                            >
                              Rejeitar
                            </Button>
                          </div>
                          {tempPasswords[item.id] ? (
                            <div className="shadcn-alert-success">
                              Senha temporária: {tempPasswords[item.id]}
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccessRequestsLayer;
