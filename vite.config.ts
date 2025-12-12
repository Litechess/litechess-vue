import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"
import { fileURLToPath, URL } from "node:url"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: mode === "development"
      ? {
          proxy: {
            "/api": {
              target: env.VITE_API_TARGET,
              changeOrigin: true,
            },
            "/identity": {
              target: env.VITE_IDENTITY_TARGET,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/identity/, ''),
            },
          },
        }
      : undefined,
  }
})
