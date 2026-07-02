import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  base: "/food-simulator/",
  plugins: [svelte()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
