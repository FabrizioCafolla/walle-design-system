// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { config } from "./src/configData";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: config.default.astro.base_url,
  base: config.default.astro.base_path,
  trailingSlash: "never",
  integrations: [mdx(), sitemap(), icon()],
});
