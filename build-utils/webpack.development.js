const path = require("path");

module.exports = () => ({
  devtool: "source-map",
  output: {
    filename: "dev-bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "../", "dist"),
    compress: true,
    hot: true,
    port: 9000
  }
});
