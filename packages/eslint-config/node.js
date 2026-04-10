import baseConfig from "./base.js";

/** @type {import("typescript-eslint").Config} */
export default [
  ...baseConfig,
  {
    rules: {
      // Node.js 환경에서 추가 규칙이 필요하면 여기에 추가
    },
  },
];
