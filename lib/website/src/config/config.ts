import defaultConfig from "./config.json";
import menuConfig from "./menu.json";

export const config = {
  default: defaultConfig,
  menu: menuConfig,
  env: {
    ...import.meta.env,
    IS_PRODUCTION: import.meta.env.NODE_ENV === "production",
  },
};
