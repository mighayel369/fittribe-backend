import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default [
  eslint.configs.recommended,

  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        "args": "all",
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],

      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-inferrable-types": "error",

      "@typescript-eslint/no-unsafe-function-type": "error",
      "no-console": "warn",
    },
  },

  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.mts"],
  }
];