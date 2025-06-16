// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    'assets/css/app.css',
    'assets/css/main.css',
    'assets/css/checkout.css'
  ],
  ssr: false,
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"]
})