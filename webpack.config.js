'use strict';

const debug = true;
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * recursiveIssuer
 * @description Used for packaging css
 * @param {object} m
 * @return {(string|boolean)}
 */
function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

const utilities = {
  entry: {
    utilities: [
      './jsx/Form.js',
      './jsx/Tabs.js',
      './jsx/Panel.js',
      './jsx/Modal.js',
      './jsx/Loader.js',
      './jsx/Filter.js',
      './jsx/Markdown.js',
      './jsx/DataTable.js',
      './jsx/FilterForm.js',
      './jsx/ProgressBar.js',
      './jsx/Breadcrumbs.js',
      './jsx/TriggerableModal',
      './jsx/PaginationLinks.js',
      './jsx/StaticDataTable.js',
      './jsx/DynamicDataTable.js',
      './jsx/FilterableDataTable.js',
      './jsx/MultiSelectDropdown.js',
    ],
  },
  output: {
    path: path.resolve(__dirname + '/htdocs/vendor/dist', 'js'),
    filename: '[name].bundle.js',
    library: 'utilities',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.ProvidePlugin({
      'React': 'react',
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify('v1'),
      BROWSER_SUPPORTS_HTML5: true,
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          warnings: false,
          mangle: !debug,
          keep_fnames: debug,
          compress: {
            unused: !debug,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        enforce: 'pre',
      },
    ],
  },
  devtool: debug ? 'inline-source-map' : false,
  mode: debug ? 'development' : 'production',
};

const lorisModules = {
  entry: {
    './modules/media/js/mediaIndex.js': './modules/media/jsx/mediaIndex.js',
    './modules/issue_tracker/js/columnFormatter.js': './modules/issue_tracker/jsx/columnFormatter.js',
    './modules/issue_tracker/js/index.js': './modules/issue_tracker/jsx/index.js',
    './modules/candidate_parameters/js/CandidateParameters.js': './modules/candidate_parameters/jsx/CandidateParameters.js',
    './modules/configuration/js/SubprojectRelations.js': './modules/configuration/jsx/SubprojectRelations.js',
    './modules/bvl_feedback/js/react.behavioural_feedback_panel.js': './modules/bvl_feedback/jsx/react.behavioural_feedback_panel.js',
    './modules/data_team_helper/js/behavioural_qc_module.js': './modules/data_team_helper/jsx/behavioural_qc_module.js',
    './modules/candidate_list/js/AccessProfilePanel.js': './modules/candidate_list/jsx/AccessProfilePanel.js',
    './modules/candidate_list/js/columnFormatter.js': './modules/candidate_list/jsx/columnFormatter.js',
    './modules/candidate_list/js/onLoad.js': './modules/candidate_list/jsx/onLoad.js',
    './modules/datadict/js/dataDictIndex.js': './modules/datadict/jsx/dataDictIndex.js',
    './modules/data_integrity_flag/js/dataIntegrityFlagIndex.js': './modules/data_integrity_flag/jsx/dataIntegrityFlagIndex.js',
    './modules/dataquery/js/react.app.js': './modules/dataquery/jsx/react.app.js',
    './modules/dataquery/js/react.fieldselector.js': './modules/dataquery/jsx/react.fieldselector.js',
    './modules/dataquery/js/react.filterBuilder.js': './modules/dataquery/jsx/react.filterBuilder.js',
    './modules/dataquery/js/react.paginator.js': './modules/dataquery/jsx/react.paginator.js',
    './modules/dataquery/js/react.sidebar.js': './modules/dataquery/jsx/react.sidebar.js',
    './modules/dataquery/js/react.tabs.js': './modules/dataquery/jsx/react.tabs.js',
    './modules/dicom_archive/js/dicom_archive.js': './modules/dicom_archive/jsx/dicom_archive.js',
    './modules/genomic_browser/js/FileUploadModal.js': './modules/genomic_browser/jsx/FileUploadModal.js',
    './modules/genomic_browser/js/profileColumnFormatter.js': './modules/genomic_browser/jsx/profileColumnFormatter.js',
    './modules/imaging_browser/js/ImagePanel.js': './modules/imaging_browser/jsx/ImagePanel.js',
    './modules/imaging_browser/js/imagingBrowserIndex.js': './modules/imaging_browser/jsx/imagingBrowserIndex.js',
    './modules/instrument_builder/js/react.instrument_builder.js': './modules/instrument_builder/jsx/react.instrument_builder.js',
    './modules/instrument_builder/js/react.questions.js': './modules/instrument_builder/jsx/react.questions.js',
    './modules/instrument_manager/js/instrumentManagerIndex.js': './modules/instrument_manager/jsx/instrumentManagerIndex.js',
    './modules/survey_accounts/js/columnFormatter.js': './modules/survey_accounts/jsx/columnFormatter.js',
    './modules/mri_violations/js/mri_protocol_check_violations_columnFormatter.js': './modules/mri_violations/jsx/mri_protocol_check_violations_columnFormatter.js',
    './modules/mri_violations/js/columnFormatter.js': './modules/mri_violations/jsx/columnFormatter.js',
    './modules/mri_violations/js/columnFormatterUnresolved.js': './modules/mri_violations/jsx/columnFormatterUnresolved.js',
    './modules/mri_violations/js/mri_protocol_violations_columnFormatter.js': './modules/mri_violations/jsx/mri_protocol_violations_columnFormatter.js',
    './modules/user_accounts/js/userAccountsIndex.js': './modules/user_accounts/jsx/userAccountsIndex.js',
    './modules/conflict_resolver/js/resolved_conflicts_columnFormatter.js': './modules/conflict_resolver/jsx/resolved_conflicts_columnFormatter.js',
    './modules/conflict_resolver/js/unresolved_columnFormatter.js': './modules/conflict_resolver/jsx/unresolved_columnFormatter.js',
    './modules/examiner/js/examinerIndex.js': './modules/examiner/jsx/examinerIndex.js',
    './modules/help_editor/js/help_editor.js': './modules/help_editor/jsx/help_editor.js',
    './modules/brainbrowser/js/Brainbrowser.js': './modules/brainbrowser/jsx/Brainbrowser.js',
    './modules/imaging_uploader/js/index.js': './modules/imaging_uploader/jsx/index.js',
    './modules/acknowledgements/js/columnFormatter.js': './modules/acknowledgements/jsx/columnFormatter.js',
    './modules/server_processes_manager/js/server_processes_managerIndex.js': './modules/server_processes_manager/jsx/server_processes_managerIndex.js',
  },
  output: {
    path: path.resolve(__dirname + '/'),
    filename: '[name]',
  },
  plugins: [
    new webpack.ProvidePlugin({
      'React': 'react',
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify('v1'),
      BROWSER_SUPPORTS_HTML5: true,
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          warnings: false,
          mangle: !debug,
          keep_fnames: debug,
          compress: {
            unused: !debug,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader?cacheDirectory',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  resolve: {
    alias: {
      util: path.resolve(__dirname, './htdocs/js/util'),
      jsx: path.resolve(__dirname, './jsx'),
      Breadcrumbs: path.resolve(__dirname, './jsx/Breadcrumbs'),
      DataTable: path.resolve(__dirname, './jsx/DataTable'),
      DynamicDataTable: path.resolve(__dirname, './jsx/DynamicDataTable'),
      Filter: path.resolve(__dirname, './jsx/Filter'),
      FilterableDataTable: path.resolve(__dirname, './jsx/FilterableDataTable'),
      FilterForm: path.resolve(__dirname, './jsx/FilterForm'),
      Form: path.resolve(__dirname, './jsx/Form'),
      Loader: path.resolve(__dirname, './jsx/Loader'),
      Markdown: path.resolve(__dirname, './jsx/Markdown'),
      Modal: path.resolve(__dirname, './jsx/Modal'),
      MultiSelectDropdown: path.resolve(__dirname, './jsx/MultiSelectDropdown'),
      PaginationLinks: path.resolve(__dirname, './jsx/PaginationLinks'),
      Panel: path.resolve(__dirname, './jsx/Panel'),
      ProgressBar: path.resolve(__dirname, './jsx/ProgressBar'),
      StaticDataTable: path.resolve(__dirname, './jsx/StaticDataTable'),
      Tabs: path.resolve(__dirname, './jsx/Tabs'),
      TriggerableModal: path.resolve(__dirname, './jsx/TriggerableModal'),
    },
    extensions: ['*', '.js', '.jsx', '.json'],
  },
  externals: ['React'],
  node: {
    fs: 'empty',
  },
  devtool: debug ? 'inline-source-map' : false,
  mode: debug ? 'development' : 'production',
};

const styles = {
  entry: {
    loris: [
      // './htdocs/css/overcast/jquery-ui-1.10.4.custom.css',
      './htdocs/css/auto-complete.css',
      './htdocs/css/c3.css',
      // './htdocs/css/jquery-ui-1.10.4.custom.css',
      './htdocs/css/jqueryslidemenu.css',
      './htdocs/css/panel.css',
      './htdocs/css/public_layout.css',
      './htdocs/css/simple-sidebar.css',
    ],
  },
  output: {
    path: path.resolve(__dirname + '/htdocs/vendor/dist', 'css'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'loris',
          test: (m, c, entry = 'loris') => {
            return m.constructor.name === 'CssModule' &&
              recursiveIssuer(m) === entry;
          },
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        use: 'url-loader',
      },
    ],
  },
  resolve: {
    alias: {},
    modules: [],
    extensions: ['.css'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  mode: 'production',
};

module.exports = [utilities, lorisModules, styles];
