"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignInLayer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  const locale = pathname?.split("/")?.[1];
  const afterLogin = locale ? `/${locale}` : "/";

  useEffect(() => {
    fetch("/api/admin/bootstrap", { method: "POST" }).catch(() => {});
  }, []);

  const validateEmail = (value) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      setError("Informe um e-mail válido.");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Informe a senha.");
      setLoading(false);
      return;
    }
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    if (signInError) {
      setError("Credenciais inválidas. Verifique e tente novamente.");
      setLoading(false);
      return;
    }
    const currentUser = signInData?.user;
    if (!currentUser) {
      setError("Não foi possível validar o usuário.");
      setLoading(false);
      return;
    }

    const { data: adminRow, error: adminError } = await supabase
      .from("app_admins")
      .select("user_id")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    const isAdmin = !!adminRow;

    if (!isAdmin) {
      const { data: profileRow, error: profileError } = await supabase
        .from("users")
        .select("status")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (profileError || !profileRow || profileRow.status !== "active") {
        await supabase.auth.signOut();
        setError("Seu acesso ainda não foi aprovado.");
        setLoading(false);
        return;
      }
    }

    setSuccess("Login efetuado com sucesso.");
    router.push(afterLogin);
  };

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestMessage("");
    const normalizedRequestEmail = requestEmail.trim().toLowerCase();
    if (!validateEmail(normalizedRequestEmail)) {
      setRequestMessage("Informe um e-mail válido.");
      setRequestLoading(false);
      return;
    }
    const { error: requestError } = await supabase
      .from("access_requests")
      .insert({ email: normalizedRequestEmail });
    if (requestError) {
      if (requestError.code === "23505") {
        setRequestMessage("Solicitação já enviada para este e-mail.");
      } else {
        setRequestMessage("Não foi possível enviar a solicitação.");
      }
      setRequestLoading(false);
      return;
    }
    setRequestMessage("Solicitação enviada para análise.");
    setRequestLoading(false);
  };
  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='/banner-destaque.webp' alt='' className='w-100 h-100 object-fit-cover auth-banner-shift-left' />
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-560-px mx-auto w-100'>
          <div>
            <Link href='/' className='mb-40 max-w-290-px'>
              <img src='/Logonome-alobexpress 2.png' alt='' className='w-100 h-auto' />
            </Link>
            <h4 className='mb-12'>Acesso à calculadora</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Entre com suas credenciais ou solicite acesso.
            </p>
          </div>
          <Card>
            <CardHeader>
              <div className='shadcn-tabs'>
                <button
                  type='button'
                  className={`shadcn-tab ${mode === "login" ? "active" : ""}`}
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccess("");
                  }}
                >
                  Entrar
                </button>
                <button
                  type='button'
                  className={`shadcn-tab ${mode === "request" ? "active" : ""}`}
                  onClick={() => {
                    setMode("request");
                    setRequestMessage("");
                  }}
                >
                  Cadastre-se
                </button>
              </div>
              <CardTitle className='mt-16'>
                {mode === "login" ? "Acesso autorizado" : "Solicitar acesso"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mode === "login" ? (
                <form onSubmit={handleSubmit} className='d-flex flex-column gap-3'>
                  <div>
                    <Label htmlFor='login-email'>E-mail</Label>
                    <Input
                      id='login-email'
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=''
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='login-password'>Senha</Label>
                    <Input
                      id='login-password'
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder='Digite sua senha'
                      required
                    />
                  </div>
                  <Button type='submit' disabled={loading} className='w-100'>
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                  {success ? (
                    <div className='shadcn-alert-success'>{success}</div>
                  ) : null}
                  {error ? (
                    <div className='shadcn-alert-error'>{error}</div>
                  ) : null}
                </form>
              ) : (
                <form
                  onSubmit={handleRequestAccess}
                  className='d-flex flex-column gap-3'
                >
                  <div>
                    <Label htmlFor='request-email'>E-mail</Label>
                    <Input
                      id='request-email'
                      type='email'
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      placeholder='seuemail@empresa.com'
                      required
                    />
                  </div>
                  <Button type='submit' disabled={requestLoading} className='w-100'>
                    {requestLoading ? "Enviando..." : "Solicitar acesso"}
                  </Button>
                  {requestMessage ? (
                    <div
                      className={
                        requestMessage.includes("Não") ||
                        requestMessage.includes("já")
                          ? "shadcn-alert-error"
                          : "shadcn-alert-success"
                      }
                    >
                      {requestMessage}
                    </div>
                  ) : null}
                </form>
              )}
              <div className='mt-24 text-center text-sm'>
                <p className='mb-0'>
                  Precisa de ajuda?{" "}
                  <Link href='/sign-up' className='text-primary-600 fw-semibold'>
                    Veja detalhes do cadastro
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SignInLayer;
