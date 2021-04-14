const path = require('path')
//const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require('webpack')

config = (env, argv) => { 

    const backend_url = argv.mode === 'production'
        ? 'http://localhost:3001/'
        : 'http://localhost:3001/'

    const stream_url = argv.mode === 'production' 
        ? 'stream'
        : ':8000'
    return {
        entry: ['@babel/polyfill','./src/index'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'main.js'
        },
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            compress: true,
            port: 3000,
            historyApiFallback: true
        },
        devtool: argv.mode === 'production' ? 'cheap-module-source-map' : 'source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        module: {
            rules: [
                {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
              BACKEND_URL: JSON.stringify(backend_url)
            })
          ]
      
    }
};

module.exports = config

