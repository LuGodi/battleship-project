import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    ignores: [
      "babel.config.js",
      "webpack.dev.js",
      "webpack.common.js",
      "webpack.prod.js",
    ],
  },
  {
    overrides: [
      {
        files: ["tests/**/*"],
        env: {
          jest: true,
        },
      },
    ],
  },
];
