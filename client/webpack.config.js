const glob = require("glob");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const entry = glob.sync("./src/app/!(__unit__)*/*.js").concat(glob.sync("./src/app/!(__unit__)*.js"));

console.log(`entry: ${entry}`);
module.exports = {
  entry: {
    app: entry,
    vendor: ["react", "redux", "react-dom", "immutable", "moment"]
  },
  output: {
    path: '../java-server/src/main/resources/static/js',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")//,
    //new BundleAnalyzerPlugin()
  ],
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /unit|node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  }
};
