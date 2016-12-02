var webpack = require('webpack');
var env = process.env.WEBPACK_ENV;

var config = {
  entry: {
    './modules/dicom_archive/js/index.js': './modules/dicom_archive/jsx/index.js'
  },
  output: {
      path: './',
      filename: '[name]'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  externals: {
    react: 'React'
  },
  plugins: []
};

if (env === 'development') {
  config.devtool = 'eval-source-map';
} else {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
