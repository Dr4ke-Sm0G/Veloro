// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  // Importe les règles par défaut
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Ajoute règles personnalisées
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "src/generated/**",
    ],
    rules: {
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
