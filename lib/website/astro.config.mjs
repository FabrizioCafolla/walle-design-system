// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import config from "./src/@walle/config";

// https://astro.build/config
export default defineConfig({
  site: config.astro.baseUrl,
  base: config.astro.basePath,
  trailingSlash: /** @type {"always"|"never"|"ignore"|undefined} */ (config.astro.trailingSlash),
  integrations: [mdx(), sitemap(), icon()],
});
