"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignUpLayer = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const locale = pathname?.split("/")?.[1];
  const signInUrl = locale ? `/${locale}/sign-in` : "/sign-in";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const normalizedEmail = email.trim().toLowerCase();
    const { error: requestError } = await supabase
      .from("access_requests")
      .insert({ email: normalizedEmail });
    if (requestError) {
      if (requestError.code === "23505") {
        setMessage("Solicitação já enviada para este e-mail.");
      } else {
        setMessage("Não foi possível enviar a solicitação.");
      }
      setLoading(false);
      return;
    }
    setMessage("Solicitação enviada. Aguarde aprovação.");
    setLoading(false);
  };
  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='/assets/images/auth/auth-img.png' alt='' />
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <Link href='/' className='mb-40 max-w-290-px'>
              <img src='/assets/images/logo.png' alt='' />
            </Link>
            <h4 className='mb-12'>Solicitar acesso</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Envie seu e-mail para análise do administrador.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Cadastro de interesse</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='d-flex flex-column gap-3'>
                <div>
                  <Label htmlFor='signup-email'>E-mail</Label>
                  <Input
                    id='signup-email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='seuemail@empresa.com'
                    required
                  />
                </div>
                <Button type='submit' disabled={loading} className='w-100'>
                  {loading ? "Enviando..." : "Solicitar acesso"}
                </Button>
                {message ? (
                  <div
                    className={
                      message.includes("Não") || message.includes("já")
                        ? "shadcn-alert-error"
                        : "shadcn-alert-success"
                    }
                  >
                    {message}
                  </div>
                ) : null}
              </form>
              <div className='mt-24 text-center text-sm'>
                <p className='mb-0'>
                  Já tem acesso?{" "}
                  <Link href={signInUrl} className='text-primary-600 fw-semibold'>
                    Fazer login
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

export default SignUpLayer;
