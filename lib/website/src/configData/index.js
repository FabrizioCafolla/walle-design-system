import Default from "./default.json";
import Menu from "./menu.json";

export { default as Default } from "./default.json";
export { default as Menu } from "./menu.json";

/**
 * Configuration data for the website.
 * Don't change the name and don't use directly but use `import config from "@config";` instead.
 * This allows to use the `config` in the components without importing the file directly.
 */
export const config = {
  default: Default,
  menu: Menu,
  env: {
    ...import.meta.env,
    IS_PRODUCTION: import.meta.env.NODE_ENV === "production",
  },
};
