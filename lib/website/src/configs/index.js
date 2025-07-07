import AstroConfig from "./astro.json";
import AppConfig from "./app.json";
import MenuConfig from "./menu.json";

/**
 * Configuration data for the website.
 * Don't change the name and don't use directly but use `import config from "@config";` instead.
 * This allows to use the `config` in the components without importing the file directly.
 */
export default {
  // Default configuration. Don't change or remove this.
  astro: AstroConfig,
  app: AppConfig,
  // Custom configuration
  menu: MenuConfig,
};
