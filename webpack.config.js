const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const htmlWebpackPlugin = new HtmlWebpackPlugin({
//   template: path.join(__dirname, "./src/index.html"),
//   filename: "./index.html"
// });
module.exports = {
  entry: {
    index: path.join(__dirname, "index.js"),
    todraw: './src/todraw.jsx',
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    // libraryTarget: "commonjs2",
    // devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015'] }
          }
        ],

        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", MiniCssExtractPlugin.loader,"css-loader"]
      },
      {
        test: /\.less$/,
        use: ["style-loader",MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  // plugins: [new ExtractTextPlugin({
  //   filename:'dist/index.css'
  // })],
  plugins:[
    new MiniCssExtractPlugin({
        　　filename: "index.css"
     　　 })
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  },

}