const path    = require("path");
const glob    = require("glob");
const webpack = require("webpack");

// Plugins
const CleanWebpackPlugin        = require("clean-webpack-plugin");
const CopyWebpackPlugin         = require("copy-webpack-plugin");
const ExtractTextWebpackPlugin  = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin         = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const WriteFilePlugin           = require("write-file-webpack-plugin");

module.exports = {
  entry  : [
    "./src/index.tsx",
  ],
  output : {
    filename : "[name].[hash].js",
    path     : path.join(__dirname, "dist"),
  },

  resolve : {
    // Add '.ts' and '.tsx' as resolvable extensions
    extensions : [ ".ts", ".tsx", ".js" ],
  },

  module : {
    rules : [
      {
        test   : /\.tsx?$/,
        loader : [ "awesome-typescript-loader" ],
      },
      {
        test   : /\.(png|jpg|gif|svg)$/,
        loader : "file-loader",
      },
      {
        test    : /\.scss$/,
        include : path.join(__dirname, "src"),
        use     : ExtractTextWebpackPlugin.extract({
          use      : [
            "css-loader",
            {
              loader  : "sass-loader",
              options : {
                includePaths : ['node_modules', 'node_modules/@material/*']
                  .map((d) => path.join(__dirname, d))
                  .map((g) => glob.sync(g))
                  .reduce((a, c) => a.concat(c), []),
                importer : mdcStyleImporter,
              }
            }
          ],
          fallback : "style-loader",
        }),
      },
      {
        test    : /\.scss$/,
        include : path.join(__dirname, "node_modules"),
        use     : [
          {
            loader: "sass-loader",
            options: {
              importer: mdcStyleImporter,
            }
          }
        ]
      },
    ],
  },
  
  plugins : [
    new CleanWebpackPlugin(["dist"]),
    
    new webpack.NamedModulesPlugin(),
    
    new webpack.optimize.CommonsChunkPlugin({
      name      : "vendor",
      minChunks : Infinity,
    }),
    
    new ExtractTextWebpackPlugin("[name].[hash].css"),
    
    new HtmlWebpackPlugin({
      template          : "./index.html",
      alwaysWriteToDisk : true,
    }),
    
    new HtmlWebpackHarddiskPlugin(),
    
    new CopyWebpackPlugin([
      {
        context : "src/assets",
        from    : "**/*",
        to      : "assets",
        ignore  : ["styles/**/*"]
      }
    ]),
    
    new WriteFilePlugin(),
  ],
}

function mdcStyleImporter(url) {
  if(url.indexOf("~@material") === 0) {
    const filePath = url.split("~@material")[1];
    const nodeModulePath = `./node_modules/@material/${filePath}`;
    return { file : path.resolve(nodeModulePath) };
  }
  return { file : url };
}