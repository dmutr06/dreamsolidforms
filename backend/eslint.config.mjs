import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";


export default defineConfig([
    { ignores: ["build", "public"] },
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        plugins: { js, "@stylistic": stylistic },
        extends: ["js/recommended"],
        rules: {
            "@stylistic/indent": ["error", 4],
            "@stylistic/semi": "error",
            "@stylistic/quotes": ["error", "double"],
        },
    },
    { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.node } },
    tseslint.configs.recommended,
]);
