export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxt-alt/proxy"
  ],
  proxy: {
    proxies: {
      "/api/": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true, // 允許cors跨域
      },
    },
  },
  devServer: {
    port: 8080,
  },
})
