import eslintPluginAstro from "eslint-plugin-astro";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import markdown from "eslint-plugin-markdown";

export default [
  // Base ESLint config
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".astro/**",
      "public/**",
      ".husky/**",
      "src/content/**/*.md",
    ],
  },

  // Use Astro's recommended rules
  ...eslintPluginAstro.configs.recommended,

  // TypeScript configuration
  {
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
  },

  // General rules for all files
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // Markdown rules
  ...markdown.configs.recommended,
  {
    files: ["src/**/*.md"],
    processor: markdown.processors.markdown,
  },

  // Use Prettier's recommended config (must be last)
  eslintConfigPrettier,
];
