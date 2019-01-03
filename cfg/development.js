'use strict';
let webpack = require('webpack');
let path = require('path');

const publicPath = path.join(__dirname, '../public');

let config = {
    mode: 'development',
    entry: {
        app: `${publicPath}/src/app.js`
    },
    output: {
        filename: "[name].bundle.js",
        path: `${publicPath}/dist`
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[hash:5].[ext]'
                    }
                }]
            }
        ]
    },
    devServer: {
        contentBase: `${publicPath}/dist`,
        port: '3001',
        inline: true,//实时刷新
        hot: true
    }
};

module.exports = config;