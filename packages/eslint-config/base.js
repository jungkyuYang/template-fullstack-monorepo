import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import("typescript-eslint").Config} */
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    rules: {
      // 불필요한 any 금지
      "@typescript-eslint/no-explicit-any": "error",
      // 빈 catch 블록 금지
      "no-empty": "error",
      // console.log 경고 (logger 사용 권장)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // 사용하지 않는 변수 금지 (_로 시작하는 것은 허용)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: ["dist/**", ".next/**", "node_modules/**"],
  }
);
