module.exports = {
  entry: {
    './modules/dicom_archive/js/entrypoint.js': './modules/dicom_archive/jsx/entrypoint.js'
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
