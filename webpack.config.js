"use strict";

const fs = require("fs");
const webpack = require("webpack");

const packageName = JSON.parse(fs.readFileSync("package.json", "utf8")).name;
const libraryName = packageName.replace(/(^|-)(.)/g, (match, _, c) => (c ? c.toUpperCase() : ""));

const config = {
  entry: "./src/index",
  devtool: "sourcemap",
  resolve: { extensions: [".ts"] },
  module: {
    rules: [
      { test: /\.ts$/, loader: "awesome-typescript", exclude: "/node_modules/" },
    ],
  },
  output: {
    filename: `dist/${packageName}.js`,
    libraryTarget: "umd",
    library: libraryName,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
};

const minified = Object.assign({}, config, {
  output: Object.assign({}, config.output, {
    filename: `dist/${packageName}.min.js`,
  }),
  plugins: config.plugins.slice(0).concat([
    new webpack.optimize.UglifyJsPlugin({ output: { comments: false }, sourceMap: true }),
  ]),
});

module.exports = [config, minified];
