import baseConfig from "@repo/eslint-config/base";

/** @type {import("typescript-eslint").Config} */
export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ["storybook-static/**", ".storybook/**", "eslint.config.js"],
  },
];
