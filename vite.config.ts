import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import { imagetools } from 'vite-imagetools'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function normalizeDevRequest(): Plugin {
  return {
    name: "normalize-dev-request",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const host = req.headers.host;
        let normalizedHost =
          typeof host === "string" ? host.split(",")[0]?.trim() : undefined;

        if (!normalizedHost || !URL.canParse("/", `http://${normalizedHost}`)) {
          normalizedHost = "localhost";
        }

        if (req.headers.host !== normalizedHost) {
          req.headers.host = normalizedHost;
        }

        const originalUrl =
          typeof req.originalUrl === "string" ? req.originalUrl : req.url;

        if (originalUrl) {
          const base = `http://${normalizedHost || "localhost"}`;
          const requestUrl = originalUrl.startsWith("/")
            ? originalUrl
            : `/${originalUrl}`;
          let safeUrl = requestUrl;

          if (!URL.canParse(safeUrl, base)) {
            safeUrl = encodeURI(requestUrl).replace(
              /%(?![0-9A-Fa-f]{2})/g,
              "%25",
            );
          }

          if (!URL.canParse(safeUrl, base)) {
            safeUrl = "/";
          }

          req.url = safeUrl;
          req.originalUrl = safeUrl;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    normalizeDevRequest(),
    tailwindcss(),
    reactRouter(),
    imagetools()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
    dedupe: ['react', 'react-dom'],
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
});
