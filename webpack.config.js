/* eslint-disable global-require */
const webpackMerge = require("webpack-merge");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// eslint-disable-next-line import/no-dynamic-require
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

module.exports = ({ mode } = { mode: "production" }) =>
  webpackMerge(
    {
      mode,
      output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "http://localhost:9000/"
      },
      resolve: {
        extensions: [".js", ".jsx", ".json"]
      },
      node: {
        fs: "empty"
      },
      module: {
        rules: [
          {
            enforce: "pre",
            test: /\.jsx?$/,
            loader: "eslint-loader",
            exclude: /node_modules/
          },
          {
            test: /\.jsx?$/,
            loader: "babel-loader"
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
          },
          {
            test: /\.(png|svg|jpg|gif)$/,
            use: ["file-loader"]
          }
        ]
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: "src/assets/template.html"
        })
      ]
    },
    modeConfig(mode)
  );
