import nextConfig from "@repo/eslint-config/next";
import boundaries from "eslint-plugin-boundaries";

/** @type {import("typescript-eslint").Config} */
export default [
  ...nextConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ─── FSD 레이어 경계 규칙 ───────────────────────────────────────
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "app",      pattern: "src/app/**" },
        { type: "widgets",  pattern: "src/widgets/**" },
        { type: "features", pattern: "src/features/**" },
        { type: "entities", pattern: "src/entities/**" },
        { type: "shared",   pattern: "src/shared/**" },
      ],
      "boundaries/ignore": ["**/*.test.*", "**/*.spec.*"],
    },
    rules: {
      // 상위 레이어는 하위 레이어만 import 가능
      // app > widgets > features > entities > shared
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app",      allow: ["widgets", "features", "entities", "shared"] },
            { from: "widgets",  allow: ["features", "entities", "shared"] },
            { from: "features", allow: ["entities", "shared"] },
            { from: "entities", allow: ["shared"] },
            { from: "shared",   allow: [] },
          ],
        },
      ],
    },
  },
];
