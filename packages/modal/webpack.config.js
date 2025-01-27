/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const generateWebpackConfig = require("../../webpack.config");

const pkg = require("./package.json");

const currentPath = path.resolve(".");

const ssrModule = {
  rules: [
    {
      test: /\.css$/,
      use: [
        "isomorphic-style-loader",
        {
          loader: "css-loader",
        },
      ],
    },
    {
      test: /\.svg$/,
      exclude: /node_modules/,
      use: ["@svgr/webpack", "url-loader"],
    },
  ],
};
const config = generateWebpackConfig({
  currentPath,
  pkg,
  alias: {},
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          { loader: "style-loader", options: {} },
          { loader: "css-loader", options: {} },
        ],
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: ["@svgr/webpack", "url-loader"],
      },
    ],
  },
  ssrModule,
});

module.exports = config;
