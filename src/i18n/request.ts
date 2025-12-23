import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !['en', 'pt-br'].includes(locale)) {
    locale = 'pt-br';
  }
 
  return {
    locale,
    messages: (await import(`../messages/${locale === 'pt-br' ? 'pt-BR' : locale}.json`)).default
  };
});
