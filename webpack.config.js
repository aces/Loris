const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs = require('fs');

const optimization = {
  minimizer: [
    new TerserPlugin({
      cache: true,
      parallel: true,
      terserOptions: {
        compress: false,
        ecma: 6,
        mangle: false,
      },
      sourceMap: true,
    }),
  ],
};
const resolve = {
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
    Card: path.resolve(__dirname, './jsx/Card'),
    Password: path.resolve(__dirname, './jsx/Password'),
  },
  extensions: ['*', '.js', '.jsx', '.json'],
};
const mod = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader?cacheDirectory',
        },
        {
          loader: 'eslint-loader',
          options: {
            cache: true,
          },
        },
      ],
      enforce: 'pre',
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
      ],
    },
  ],
};

/**
 * Creates a webpack config entry for a LORIS module named
 * mname.
 *
 * @param {string} mname - The LORIS module name
 * @param {array} entries - The webpack entry points for the module
 * @param {boolean} override - Is the module an override or a native LORIS module.
 *
 * @return {object} - The webpack configuration
 */
function lorisModule(mname, entries, override=false) {
  let entObj = {};
  let base = './modules';

  if (override) {
    base = './project/modules';
  }

  for (let i = 0; i < entries.length; i++) {
    entObj[entries[i]] =
      base + '/' + mname + '/jsx/' + entries[i] + '.js';
  }
  return {
    entry: entObj,
    output: {
      path: path.resolve(__dirname, base) + '/' + mname + '/js/',
      filename: '[name].js',
      library: ['lorisjs', mname, '[name]'],
      libraryTarget: 'window',
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
    },
    node: {
      fs: 'empty',
    },
    devtool: 'source-map',
    plugins: [],
    optimization: optimization,
    resolve: resolve,
    module: mod,
    mode: 'none',
    stats: 'errors-warnings',
  };
}

const config = [
  // Core components
  {
    entry: {
      DynamicDataTable: './jsx/DynamicDataTable.js',
      PaginationLinks: './jsx/PaginationLinks.js',
      StaticDataTable: './jsx/StaticDataTable.js',
      MultiSelectDropdown: './jsx/MultiSelectDropdown.js',
      Breadcrumbs: './jsx/Breadcrumbs.js',
      Form: './jsx/Form.js',
      Markdown: './jsx/Markdown.js',
      CSSGrid: './jsx/CSSGrid.js',
      Password: './jsx/Password.js',
    },
    output: {
      path: __dirname + '/htdocs/js/components/',
      filename: '[name].js',
      library: ['lorisjs', '[name]'],
      libraryTarget: 'window',
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
    },
    node: {
      fs: 'empty',
    },
    devtool: 'source-map',
    plugins: [
      new CopyPlugin([
        {
          from: path.resolve(__dirname, 'node_modules/react/umd/*'),
          to: path.resolve(__dirname, 'htdocs/vendor/js/react'),
          force: true,
          flatten: true,
          ignore: ['react.profiling.min.js'],
        },
        {
          from: path.resolve(__dirname, 'node_modules/react-dom/umd/*'),
          to: path.resolve(__dirname, 'htdocs/vendor/js/react'),
          force: true,
          flatten: true,
          ignore: [
            'react-dom.profiling.min.js',
            'react-dom-server.*',
            'react-dom-test-utils.*',
            'react-dom-unstable-fizz.*',
            'react-dom-unstable-flight-client.*',
            'react-dom-unstable-flight-server.*',
            'react-dom-unstable-native-dependencies.*',
          ],
        },
      ]),
    ],
    optimization: optimization,
    resolve: resolve,
    module: mod,
    stats: 'errors-warnings',
  },
  // Modules
  lorisModule('media', ['CandidateMediaWidget', 'mediaIndex']),
  lorisModule('issue_tracker', [
    'issueTrackerIndex',
    'index',
    'CandidateIssuesWidget',
  ]),
  lorisModule('publication', ['publicationIndex', 'viewProjectIndex']),
  lorisModule('document_repository', ['docIndex', 'editFormIndex']),
  lorisModule('candidate_parameters', [
    'CandidateParameters',
    'ConsentWidget',
  ]),
  lorisModule('configuration', ['SubprojectRelations']),
  lorisModule('conflict_resolver', [
    'CandidateConflictsWidget',
    'conflictResolverIndex',
    'resolvedConflictsIndex',
  ]),
  lorisModule('battery_manager', ['batteryManagerIndex']),
  lorisModule('bvl_feedback', ['react.behavioural_feedback_panel']),
  lorisModule('behavioural_qc', ['behavioural_qc_module']),
  lorisModule('candidate_list', [
    'openProfileForm',
    'onLoad',
    'candidateListIndex',
  ]),
  lorisModule('datadict', ['dataDictIndex']),
  lorisModule('data_release', [
    'dataReleaseIndex',
  ]),
  lorisModule('dataquery', [
    'react.app',
    'react.fieldselector',
    'react.filterBuilder',
    'react.paginator',
    'react.sidebar',
    'react.tabs',
  ]),
  lorisModule('dqt', [
    'components/expansionpanels',
    'components/searchabledropdown',
    'components/stepper',
    'react.app',
    'react.fieldselector',
    'react.filterBuilder',
    'react.navigationStepper',
    'react.notice',
    'react.savedqueries',
    'react.sidebar',
    'react.tabs',
  ]),
  lorisModule('dicom_archive', ['dicom_archive']),
  lorisModule('genomic_browser', ['FileUploadModal']),
  lorisModule('electrophysiology_browser', [
    'electrophysiologyBrowserIndex',
    'electrophysiologySessionView',
  ]),
  lorisModule('genomic_browser', ['profileColumnFormatter']),
  lorisModule('imaging_browser', [
    'ImagePanel',
    'imagingBrowserIndex',
    'CandidateScanQCSummaryWidget',
  ]),
  lorisModule('instrument_builder', [
    'react.instrument_builder',
    'react.questions',
  ]),
  lorisModule('instrument_manager', ['instrumentManagerIndex']),
  lorisModule('survey_accounts', ['surveyAccountsIndex']),
  lorisModule('mri_violations', [
    'mri_protocol_check_violations_columnFormatter',
    'columnFormatter',
    'columnFormatterUnresolved',
    'mri_protocol_violations_columnFormatter',
  ]),
  lorisModule('user_accounts', ['userAccountsIndex']),
  lorisModule('examiner', ['examinerIndex']),
  lorisModule('help_editor', ['help_editor']),
  lorisModule('brainbrowser', ['Brainbrowser']),
  lorisModule('imaging_uploader', ['index']),
  lorisModule('acknowledgements', ['acknowledgementsIndex']),
  lorisModule('new_profile', ['NewProfileIndex']),
  lorisModule('module_manager', ['modulemanager']),
  lorisModule('imaging_qc', ['imagingQCIndex']),
  lorisModule('server_processes_manager', ['server_processes_managerIndex']),
  lorisModule('instruments', ['CandidateInstrumentList']),
  lorisModule('candidate_profile', ['CandidateInfo']),
];

// Support project overrides
if (fs.existsSync('./project/webpack-project.config.js')) {
  const projConfig = require('./project/webpack-project.config.js');

  for (const [module, files] of Object.entries(projConfig)) {
    config.push(lorisModule(module, files, true));
  }
}

module.exports = config;
