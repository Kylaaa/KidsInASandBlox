const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

let uiAppsPath = path.resolve(__dirname, './src/ui/apps');
let extension = ".jsx"
let appNames = fs.readdirSync(uiAppsPath).filter((name)=> name.substring(name.length - extension.length) == extension);

let fileEntries = {};
appNames.forEach((fileName)=>{
    let key = fileName.substring(0, fileName.length - extension.length);
    fileEntries[key] = path.resolve(uiAppsPath, fileName);
});

module.exports = {
    entry: fileEntries,
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
    optimization: {
       minimize: true
    },
    resolve: {
        extensions: ['.*', '.js', '.jsx']
    },
    mode: 'production'
};