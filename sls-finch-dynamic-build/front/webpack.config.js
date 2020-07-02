const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');

console.log('endddd - ', process.env.ENDPOINT)
console.log('key - ', process.env.KEY)

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: 'HTML Webpack Plugin',
        }),
        new webpack.EnvironmentPlugin(['ENDPOINT', 'KEY']),
        new CopyPlugin({
            patterns: [
                { from: './src/style.css', to: 'style.css' }
            ],
        }),
    ]
};