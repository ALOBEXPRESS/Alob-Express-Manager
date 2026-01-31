"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { supabase, clearAuthStorage } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignInLayer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  const pathLocale = pathname?.split("/")?.[1];
  const validLocales = ["en", "pt-br", "pt-BR"];
  const locale = validLocales.includes(pathLocale) ? pathLocale : "pt-br";
  const afterLogin = `/${locale}`;
  const redirectTo = searchParams?.get("redirectTo") || "";

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

    console.log("[SignInLayer] Tentando login...");

    // 2. Fazer login
    let signInData;
    let signInError;
    const attemptSignIn = async () => {
      return await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
    };

    try {
      const result = await attemptSignIn();
      signInData = result.data;
      signInError = result.error;
    } catch (requestError) {
      const message = String(requestError?.message ?? "");
      const isNetworkError =
        message.includes("Failed to fetch") ||
        message.includes("ERR_CONNECTION") ||
        message.includes("NetworkError");

      if (isNetworkError) {
        await wait(400);
        try {
          const result = await attemptSignIn();
          signInData = result.data;
          signInError = result.error;
        } catch (retryError) {
          console.error("[SignInLayer] Login request error:", retryError);
          setError("Não foi possível conectar ao Supabase.");
          setLoading(false);
          return;
        }
      } else {
        console.error("[SignInLayer] Login request error:", requestError);
        setError("Não foi possível conectar ao Supabase.");
        setLoading(false);
        return;
      }
    }
    
    if (signInError) {
      console.error("[SignInLayer] Login error:", signInError);
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

    console.log("[SignInLayer] ✅ Login successful!", currentUser.id);
    setSuccess("Login efetuado com sucesso!");
    
    console.log(`[SignInLayer] Redirecionando para: ${afterLogin}`);

    try {
      window.sessionStorage.setItem("alob-auth-pending", String(Date.now()));
    } catch {}
    
    // Esperar um pouco para garantir que a sessão foi estabelecida
    await new Promise(resolve => setTimeout(resolve, 200));

    window.location.href = afterLogin;
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
        setRequestMessage(
          "Solicitação já enviada para este e-mail. Se você já tem acesso, use a aba Entrar."
        );
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
          <div className="d-flex justify-content-end mb-2">
             <button 
               type="button" 
               className="text-xs text-danger"
               onClick={async () => {
                 try {
                   await supabase.auth.signOut();
                 } catch {}

                 try {
                   clearAuthStorage();
                 } catch {}

                const target = redirectTo || `/${locale}`;
                window.location.href = `/reset-auth.html?redirectTo=${encodeURIComponent(target)}`;
               }}
             >
               Problemas no login? Limpar dados
             </button>
          </div>
          <div>
            <Link href='/' className='mb-40 max-w-150-px'>
              <img src='/Logonome-alobexpress 2.png' alt='' className='w-100 h-auto' />
            </Link>
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
                      placeholder='Digite seu email'
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
                  <Link href={`/${locale}/sign-up`} className='text-primary-600 fw-semibold'>
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
