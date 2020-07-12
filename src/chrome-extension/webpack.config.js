const { CheckerPlugin } = require("awesome-typescript-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { optimize } = require("webpack");
const { join } = require("path");
let prodPlugins = [];
if (process.env.NODE_ENV === "production") {
  prodPlugins.push(new optimize.AggressiveMergingPlugin(), new optimize.OccurrenceOrderPlugin());
}
module.exports = {
  mode: process.env.NODE_ENV,
  devtool: "inline-source-map",
  entry: {
    backgroundscript: join(__dirname, "src/index.ts"),
  },
  output: {
    path: join(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts?$/,
        use: "ts-loader",
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new CheckerPlugin(),
    ...prodPlugins,
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
};
