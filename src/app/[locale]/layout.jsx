import PluginInit from "@/helper/PluginInit";
import "../font.css";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import CookieCleaner from "@/components/CookieCleaner";
import CookieMonitor from "@/components/CookieMonitor";
import AuthGuard from "@/components/AuthGuard";

export const metadata = {
  title: "WowDash NEXT JS - Admin Dashboard Multipurpose Bootstrap 5 Template",
  description:
    "Wowdash NEXT JS is a developer-friendly, ready-to-use admin template designed for building attractive, scalable, and high-performing web applications.",
  icons: {
    icon: "/Logo 2.svg",
  },
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!['en', 'pt-br', 'pt-BR'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <CookieCleaner />
        <CookieMonitor />
        <PluginInit />
        <NextIntlClientProvider messages={messages}>
          <AuthGuard>
            {children}
          </AuthGuard>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
