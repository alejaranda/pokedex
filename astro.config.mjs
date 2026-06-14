// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://alejaranda.github.io",
  base: "/pokedex",
  vite: {
    plugins: [tailwindcss()],
  },
});
