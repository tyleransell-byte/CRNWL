import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    tailwindcss(),

    tanstackStart({
      srcDirectory: "src",
    }),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        id: "/",
        name: "CRNWL",
        short_name: "CRNWL",

        description:
          "Cornwall's hospitality jobs platform.",

        start_url: "/",
        scope: "/",

        display: "standalone",

        background_color: "#ffffff",
        theme_color: "#0f766e",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: null,
      },
    }),

    nitro(),

    viteReact(),
  ],
});