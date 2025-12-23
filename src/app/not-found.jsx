import Breadcrumb from "@/components/Breadcrumb";
import ErrorLayer from "@/components/ErrorLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import PluginInit from "@/helper/PluginInit";
import "./font.css";
import "./globals.css";

export default async function NotFound() {
  const locale = 'pt-br';
  const messages = await getMessages({locale});

  return (
    <html lang={locale}>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <PluginInit />
          <MasterLayout>
            <Breadcrumb title='404' />
            <ErrorLayer />
          </MasterLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
