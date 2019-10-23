const path = require('path');

const buildMode = process.argv[4] === '--prod' ? 'production' : 'development';

module.exports = {
    mode: buildMode,
    entry: `${__dirname}/src/main.js`,
    output: {
        filename: 'mpu-cloud-viewer.min.js',
        path: path.resolve(__dirname, 'public'),
        libraryTarget: 'var',
        library: 'MPUCloudViewer'
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
