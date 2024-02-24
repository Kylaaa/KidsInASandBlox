const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        login: path.resolve(__dirname, './src/ui/apps/login.js')
    },
    output: {
        path: path.resolve(__dirname, './public'),
        filename: '[name]/app.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader : 'babel-loader',
                    options : {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.*', '.js', '.jsx']
    },
    mode: 'production'
};