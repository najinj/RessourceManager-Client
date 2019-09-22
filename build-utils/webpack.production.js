const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = () => ({
  devtool: "cheap-source-map",
  output: {
    filename: "prod-bundle.js"
  },
  plugins: [new CompressionWebpackPlugin()]
});
