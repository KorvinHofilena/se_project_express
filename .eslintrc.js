module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-console": "warn",
    "no-unused-vars": ["error", { args: "none", varsIgnorePattern: "^_" }],
    "consistent-return": "off",
    "no-shadow": "off",
    "prefer-destructuring": "off",
  },
};
