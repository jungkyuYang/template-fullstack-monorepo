export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 스코프는 앱/패키지 이름으로 제한
    "scope-enum": [
      2,
      "always",
      ["web", "api", "ui", "types", "database", "eslint-config", "typescript-config", "deps", "release"],
    ],
    "subject-max-length": [2, "always", 100],
  },
};
