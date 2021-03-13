const path = require('path')
const webpack = require('webpack')

config = (env, argv) => { 

    const backend_url = argv.mode === 'production'
        ? 'http://localhost:3001/'
        : 'http://localhost:3001/'

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
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json']
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

