// https://nuxt.com/docs/api/configuration/nuxt-config
// Importamos Vuetify para que funcione junto con Vite y Nuxt.
import complementoVuetify, { transformAssetUrls as transformarUrlDeRecursos } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    jsonServerUrl: 'http://localhost:3001'
  },
  components: [{ path: '~/components', pathPrefix: false }],
  css: ['~/assets/css/main.css'],
  app: {
  },
  // Nuxt transpila Vuetify para que el navegador pueda ejecutar su código.
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    plugins: [
      complementoVuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        // Ajusta las rutas de imágenes y otros recursos dentro de las plantillas de Vue.
        transformAssetUrls: transformarUrlDeRecursos,
      },
    },
  },

   

})