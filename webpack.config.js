module.exports = {
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
  }
};
