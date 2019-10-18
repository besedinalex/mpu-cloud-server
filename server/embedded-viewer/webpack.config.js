const path = require('path');

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: `${__dirname}/src/main.js`,
    output: {
        filename: 'mpu-cloud-viewer.js',
        path: path.resolve(__dirname, 'public'),
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};