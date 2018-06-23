const path  = require("path");
const merge = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  // Enable souremaps for debugging webpack's output
  devtool   : "source-map",
  devServer : {
    contentBase        : path.join(__dirname, "dist"),
    historyApiFallback : true,
  },

  module : {
    rules : [
      // All output '.js' files will have any sourcemaps
      // re-processed by 'source-map-loader'.
      {
        enforce : "pre",
        test    : /\.js$/,
        exclude : /data/,
        loader  : "source-map-loader",
      },
    ],
  },
});