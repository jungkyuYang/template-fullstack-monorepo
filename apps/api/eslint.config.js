import nodeConfig from "@repo/eslint-config/node";

/** @type {import("typescript-eslint").Config} */
export default [
  ...nodeConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
