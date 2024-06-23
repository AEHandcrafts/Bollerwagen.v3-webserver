import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "dist/static",
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:5174",
    },
  },
  resolve: {
    alias: {
      assert: path.resolve(__dirname, "src/client/polyfills/assert-polyfill.ts"),
    },
  },
});
