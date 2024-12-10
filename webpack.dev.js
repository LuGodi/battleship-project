const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { cache } = require("webpack");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  watch: true,
  cache: false,
});
