import configs from "../configs";

// Type definitions for better TypeScript support
export interface AstroConfig {
  baseUrl: string;
  basePath: string;
  trailingSlash: string;
  [key: string]: any;
}

export interface AppConfig {
  title: string;
  description: string;
  favicon: string;
  image: string;
  robots: string;
  language: string;
  [key: string]: any;
}

export interface DefaultConfig {
  astro: AstroConfig;
  app: AppConfig;
  menu: Record<string, object>;
  [key: string]: any;
}

export const config: DefaultConfig = {
  ...configs,
  env: {
    ...import.meta.env,
    IS_PRODUCTION: import.meta.env.NODE_ENV === "production",
  },
};

export default config;
