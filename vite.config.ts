import { defineConfig } from "vite";

// Served from https://ishmandoo.github.io/look-up/, so assets need the
// repo name as the base path. The app now calls airplanes.live directly
// (it sends permissive CORS headers), so no dev proxy is required.
export default defineConfig({
  base: "/look-up/",
});
