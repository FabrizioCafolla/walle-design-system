import eslintPluginAstro from "eslint-plugin-astro";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import markdown from "eslint-plugin-markdown";

// Base configuration
export const baseConfig = {
  ignores: [
    "dist/**",
    "node_modules/**",
    ".astro/**",
    "public/**",
    ".husky/**",
    "src/content/**/*.md",
  ],
};

// TypeScript configuration
export const typescriptConfig = {
  files: ["src/**/*.ts", "src/**/*.tsx"],
  plugins: {
    "@typescript-eslint": ts,
  },
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
  rules: {
    // Add any custom TypeScript rules here
  },
};

// General rules configuration
export const generalRulesConfig = {
  rules: {
    "no-unused-vars": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
};

// Markdown configuration
export const markdownConfig = {
  files: ["src/**/*.md"],
  processor: markdown.processors.markdown,
};

// Export all configurations
export const eslintWalleConfigs = [
  baseConfig,
  ...eslintPluginAstro.configs.recommended,
  typescriptConfig,
  generalRulesConfig,
  ...markdown.configs.recommended,
  markdownConfig,
  eslintConfigPrettier,
];
