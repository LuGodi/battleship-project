import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  { ignores: ["webpack.common.js", "webpack.dev.js", "webpack.prod.js"] },
];
