const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
    target: 'node',
    externals: ['aws-sdk'],
    entry: slsw.lib.entries,
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    devtool: slsw.lib.webpack.isLocal ? 'nosources-source-map' : 'none',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js'
    },
    module: {
        rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
    },
    optimization: {
        minimize: false
    }
};
