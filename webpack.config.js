const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  experiments:{
    topLevelAwait:true
  },
  entry:{
    popup: './src/popup.jsx',
    background: './src/background.jsx',
    contentScript: './src/contentScript.jsx'
  },
  output:{
    path : path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module:{
    rules:[{
      test:/\.(js|jsx)$/,
      exclude: /node-modules/,
      use: {
        loader: 'babel-loader',
        options:{
          presets:['@babel/preset-env', '@babel/preset-react']
        }
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup.html',
      filename: 'popup.html'
    }),
    new CopyPlugin({
      patterns: [
        {from: "public"}
      ]
    })
  ]
};