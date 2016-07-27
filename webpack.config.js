var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: "./boot.js",
  context: path.resolve(__dirname, 'client'),
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
};
