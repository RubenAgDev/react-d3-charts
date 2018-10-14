const path = require('path');
const webpack = require('webpack');

const APP_SRC = path.resolve(__dirname, 'src');
const APP_LIB = path.resolve(__dirname, 'lib');

const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: [
        path.join(APP_SRC, 'index.js')
    ],
    externals : {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React'
        },
        'react-dom': {
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom',
            root: 'ReactDOM'
        }
    },
    module: {
        rules: [
            // First, run the linter.
            // It's important to do this before Babel processes the JS.
            // {
            //     test: /\.(js|jsx)$/,
            //     enforce: 'pre',
            //     exclude: /node_modules/,
            //     use: [
            //         {
            //             options: {
            //                 eslintPath: require.resolve('eslint'),
            //             },
            //             loader: require.resolve('eslint-loader'),
            //         },
            //     ],
            //     include: APP_SRC,
            // },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: require.resolve('babel-loader'),
                query: {
                    cacheDirectory: true,
                },

            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    output: {
        path: APP_LIB,
        filename: 'react-d3-charts.js',
        library: 'ReactD3Charts',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // Add module names to factory functions so they appear in browser profiler.
        new webpack.NamedModulesPlugin(),
        new CleanWebpackPlugin(['lib'])
    ],
};
