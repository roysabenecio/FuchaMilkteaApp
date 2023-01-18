const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: 
                 { 
                    presets: [
                        ["@babel/preset-env"],
                        "@babel/preset-typescript",
                        [
                            "@babel/preset-react",
                            {
                                runtime: "automatic",
                                importSource: "react"
                            }
                        ]
                    ],
                    plugins: ["@babel/proposal-class-properties", "@babel/proposal-object-rest-spread"]
                 }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                exclude: /node_modules/,
                use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
            }
        ]
    },
    resolve: { extensions: ['*', '.js', '.jsx'] },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    devServer: { // webpack updates
        contentBase: path.join(__dirname, 'public/'),
        // static: path.join(__dirname, 'public/'),
        port: 8080,
        publicPath: 'http://localhost:8080/dist/',
        hotOnly: true,
        // hot: "only",
        historyApiFallback: true,
    },
    devtool: 'inline-source-map',
    plugins: [new webpack.HotModuleReplacementPlugin(), new HtmlWebpackPlugin()]
}