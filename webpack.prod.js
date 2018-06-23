const path    = require("path");
const webpack = require("webpack");

// Plugins
const CleanWebpackPlugin        = require("clean-webpack-plugin");
const merge = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {});