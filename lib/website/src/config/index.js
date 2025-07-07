import Default from "./default.json";
import Menu from "./menu.json";

export { default as Default } from "./default.json";
export { default as Menu } from "./menu.json";

export const config = {
  default: Default,
  menu: Menu,
  env: {
    ...import.meta.env,
    IS_PRODUCTION: import.meta.env.NODE_ENV === "production",
  },
};
