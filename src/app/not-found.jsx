import Breadcrumb from "@/components/Breadcrumb";
import ErrorLayer from "@/components/ErrorLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import PluginInit from "@/helper/PluginInit";

export default async function NotFound() {
  const locale = 'pt-br';
  const messages = await getMessages({locale});

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <PluginInit />
      <MasterLayout>
        <Breadcrumb title='404' />
        <ErrorLayer />
      </MasterLayout>
    </NextIntlClientProvider>
  );
}
