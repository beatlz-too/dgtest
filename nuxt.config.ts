// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxtjs/i18n'],
  /// `ui/` primitives keep their own `Nb` prefix (`<NbButton>`); domain folders prefix as usual.
  components: [{ path: '~/components/ui', pathPrefix: false }, '~/components'],
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Datatype:wght@100..900&family=Geist+Pixel&display=swap' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  /// Server-only keys here, browser-safe ones under `public`. Overridden by NUXT_* env vars.
  runtimeConfig: {
    dbPath: '.data/dgtest.sqlite',
    /// The question bank's source file, rewritten when an explanation is added.
    questionsPath: 'server/assets/questions.json',
  },
  /// Test and history pages live on browser state (user id, answers, timer), so render them client-side.
  routeRules: {
    '/test/**': { ssr: false },
    '/my-tests/**': { ssr: false },
  },
  compatibilityDate: '2025-07-15',
  vite: { plugins: [tailwindcss()] },
  typescript: { strict: true },
  eslint: { config: { stylistic: { semi: false, quotes: 'single' } } },
  /// UI text only. Test content is never translated: the DGT examines in Spanish.
  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
    ],
    detectBrowserLanguage: { useCookie: true, cookieKey: 'dgtest_locale', redirectOn: 'root' },
  },
})
