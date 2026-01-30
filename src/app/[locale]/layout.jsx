import { use } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import PluginInit from "@/helper/PluginInit";
import { SupabaseCookieGuard } from '@/components/SupabaseCookieGuard';

// Importe as mensagens
import ptBr from '@/messages/pt-BR.json';
import en from '@/messages/en.json';
import es from '@/messages/es.json';

const messages = {
  'pt-br': ptBr,
  'en': en,
  'es': es,
};

export default function RootLayout({ children, params }) {
  const { locale } = use(params);
  const normalizedLocale = locale?.toLowerCase() === 'pt-br' ? 'pt-br' : locale
  const resolvedMessages = messages[normalizedLocale] || messages['pt-br'];

  return (
    <NextIntlClientProvider locale={normalizedLocale} messages={resolvedMessages}>
      <SupabaseCookieGuard />
      <PluginInit />
      {children}
    </NextIntlClientProvider>
  );
}
