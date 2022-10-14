const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const optimization = {
  minimizer: [
    (compiler) => {
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: false,
          ecma: 6,
          mangle: false,
        },
      }).apply(compiler);
    },
  ],
};

const resolve = {
  alias: {
    util: path.resolve(__dirname, './htdocs/js/util'),
    jsx: path.resolve(__dirname, './jsx'),
    jslib: path.resolve(__dirname, './jslib'),
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
  },
  extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
  fallback: {
     fs: false,
     path: false,
   },
};

const mod = {
  rules: [],
};

// If no compiled chunk.proto found, desactivate compilation
// on the file importing it to avoid import errors
// chunk.proto is only required for EEG visualization and requires protoc
if (!fs.existsSync(
  './modules/electrophysiology_browser/jsx/react-series-data-viewer/src/'
  + 'protocol-buffers/chunk_pb.js')
) {
  mod.rules.push({
    test: /react-series-data-viewer\/src\/chunks/,
    use: 'null-loader',
  });
}

mod.rules.push(
  {
    test: /\.(jsx?|tsx?)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader?cacheDirectory',
      },
    ],
  },
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
    ],
  },
  {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {onlyCompileBundledFiles: true},
      },
    ],
  },
);

let mode = 'production';
try {
  const configFile = fs.readFileSync('project/config.xml', 'latin1');
  const res = /<[\s]*?sandbox[\s]*?>(.*)<\/[\s]*?sandbox[\s]*?>/
              .exec(configFile);
  if (res && parseInt(res[1]) == 1) mode = 'development';
} catch (error) {
  console.error(
    'Error - Can\'t read config.xml file. '
    + 'Webpack mode set to production.'
  );
}

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
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': `"${mode}"`,
      }),
    ],
    optimization: optimization,
    resolve: resolve,
    module: mod,
    mode: 'none',
    stats: 'errors-only',
  };
}

let config = [
  // Core components
  {
    mode: mode,
    entry: {
      DynamicDataTable: './jsx/DynamicDataTable.js',
      PaginationLinks: './jsx/PaginationLinks.js',
      StaticDataTable: './jsx/StaticDataTable.js',
      MultiSelectDropdown: './jsx/MultiSelectDropdown.js',
      Breadcrumbs: './jsx/Breadcrumbs.js',
      Form: './jsx/Form.js',
      Markdown: './jsx/Markdown.js',
      CSSGrid: './jsx/CSSGrid.js',
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
    devtool: 'source-map',
    plugins: [
      new ESLintPlugin({
        files: [
          'modules/',
          'jsx/',
          'jslib/',
          'htdocs/js/',
          'webpack.config.js',
        ],
        cache: true,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'node_modules/react/umd'),
            to: path.resolve(__dirname, 'htdocs/vendor/js/react'),
            force: true,
            globOptions: {
              ignore: ['react.profiling.min.js'],
            },
            filter: async (path) => {
              const file = path.split('\\').pop().split('/').pop();
              const keep = [
                'react.development.js',
                'react.production.min.js',
              ];
              return keep.includes(file);
            },
          },
          {
            from: path.resolve(__dirname, 'node_modules/react-dom/umd'),
            to: path.resolve(__dirname, 'htdocs/vendor/js/react'),
            force: true,
            filter: async (path) => {
              const file = path.split('\\').pop().split('/').pop();
              const keep = [
                'react-dom.development.js',
                'react-dom.production.min.js',
              ];
              return keep.includes(file);
            },
          },
        ],
      }),
    ],
    optimization: optimization,
    resolve: resolve,
    module: mod,
    stats: 'errors-warnings',
  },
];

const lorisModules = {
  media: ['CandidateMediaWidget', 'mediaIndex'],
  issue_tracker: [
    'issueTrackerIndex',
    'index',
    'CandidateIssuesWidget',
  ],
  login: ['loginIndex'],
  publication: ['publicationIndex', 'viewProjectIndex'],
  document_repository: ['docIndex', 'editFormIndex'],
  candidate_parameters: [
    'CandidateParameters',
    'ConsentWidget',
  ],
  configuration: ['SubprojectRelations', 'configuration_helper'],
  conflict_resolver: ['conflict_resolver'],
  battery_manager: ['batteryManagerIndex'],
  bvl_feedback: ['react.behavioural_feedback_panel'],
  behavioural_qc: ['behaviouralQCIndex'],
  create_timepoint: ['createTimepointIndex'],
  candidate_list: [
    'openProfileForm',
    'onLoad',
    'candidateListIndex',
  ],
  datadict: ['dataDictIndex'],
  data_release: [
    'dataReleaseIndex',
  ],
  dictionary: ['dataDictIndex'],
  dqt: [
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
  ],
  dicom_archive: ['dicom_archive'],
  genomic_browser: ['genomicBrowserIndex'],
  electrophysiology_browser: [
    'electrophysiologyBrowserIndex',
    'electrophysiologySessionView',
  ],
  imaging_browser: [
    'ImagePanel',
    'imagingBrowserIndex',
    'CandidateScanQCSummaryWidget',
  ],
  instrument_builder: [
    'react.instrument_builder',
    'react.questions',
  ],
  instrument_manager: ['instrumentManagerIndex'],
  survey_accounts: ['surveyAccountsIndex'],
  mri_violations: [
    'mri_protocol_check_violations_columnFormatter',
    'columnFormatter',
    'columnFormatterUnresolved',
    'mri_protocol_violations_columnFormatter',
  ],
  user_accounts: ['userAccountsIndex'],
  examiner: ['examinerIndex'],
  help_editor: ['help_editor'],
  brainbrowser: ['Brainbrowser'],
  imaging_uploader: ['index'],
  acknowledgements: ['acknowledgementsIndex'],
  new_profile: ['NewProfileIndex'],
  module_manager: ['modulemanager'],
  imaging_qc: ['imagingQCIndex'],
  server_processes_manager: ['server_processes_managerIndex'],
  instruments: ['CandidateInstrumentList'],
  candidate_profile: ['CandidateInfo'],
  api_docs: ['swagger-ui_custom'],
};
for (const [key] of Object.entries(lorisModules)) {
  const target = process.env.target;
  if (target && target !== key) {
    // continue loop if target exists && module key doesn't match
    continue;
  }
  config.push(lorisModule(key, lorisModules[key]));
}

// Support project overrides
if (fs.existsSync('./project/webpack-project.config.js')) {
  const projConfig = require('./project/webpack-project.config.js');

  for (const [module, files] of Object.entries(projConfig)) {
    config.push(lorisModule(module, files, true));
  }
}

module.exports = config;
