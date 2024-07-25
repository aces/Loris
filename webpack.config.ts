import cp from 'child_process';
import fs from 'fs';
import path from 'path';
import webpack, {DefinePlugin, IgnorePlugin} from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

// An object mapping each LORIS module to its entry points.
let lorisModules: { [x: string]: string[] } = {
  media: ['CandidateMediaWidget', 'mediaIndex'],
  issue_tracker: ['issueTrackerIndex', 'index', 'CandidateIssuesWidget'],
  login: ['loginIndex'],
  publication: ['publicationIndex', 'viewProjectIndex'],
  document_repository: ['docIndex', 'editFormIndex'],
  candidate_parameters: ['CandidateParameters', 'ConsentWidget'],
  configuration: [
    'CohortRelations',
    'configuration_helper',
    'DiagnosisEvolution',
  ],
  conflict_resolver: ['conflict_resolver', 'CandidateConflictsWidget'],
  battery_manager: ['batteryManagerIndex'],
  bvl_feedback: ['react.behavioural_feedback_panel'],
  behavioural_qc: ['behaviouralQCIndex'],
  create_timepoint: ['createTimepointIndex'],
  candidate_list: ['openProfileForm', 'candidateListIndex'],
  datadict: ['dataDictIndex'],
  dataquery: ['index'],
  data_release: ['dataReleaseIndex'],
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
  ],
  electrophysiology_uploader: [
    'ElectrophysiologyUploader',
    'UploadForm',
    'UploadViewer',
  ],
  imaging_browser: [
    'ImagePanel',
    'imagingBrowserIndex',
    'CandidateScanQCSummaryWidget',
  ],
  instrument_builder: ['react.instrument_builder', 'react.questions'],
  instrument_manager: ['instrumentManagerIndex'],
  survey_accounts: ['surveyAccountsIndex'],
  mri_violations: ['mriViolationsIndex'],
  user_accounts: ['userAccountsIndex'],
  examiner: ['examinerIndex'],
  help_editor: ['help_editor', 'helpEditorForm'],
  brainbrowser: ['Brainbrowser'],
  imaging_uploader: ['index'],
  acknowledgements: ['acknowledgementsIndex'],
  new_profile: ['NewProfileIndex'],
  module_manager: ['modulemanager'],
  imaging_qc: ['imagingQCIndex'],
  server_processes_manager: ['server_processes_managerIndex'],
  statistics: ['WidgetIndex'],
  instruments: ['CandidateInstrumentList', 'ControlpanelDeleteInstrumentData'],
  candidate_profile: ['CandidateInfo'],
  schedule_module: ['scheduleIndex'],
  api_docs: ['swagger-ui_custom'],
  dashboard: ['welcome'],
};

/*
 * ------------------------------------------------------------
 * Check if useEEGBrowserVisualizationComponents is set to TRUE
 * If not, protoc compiled file chunk.proto may not exist.
 * Deactivate compilation of the EEGBrowserVisualization files
 * to avoid import errors and optimize performance
 */

let EEGVisEnabled: boolean | string = false;
if ('EEG_VIS_ENABLED' in process.env) {
  EEGVisEnabled = process.env.EEG_VIS_ENABLED ?? false;
} else {
  const getConfig = cp.spawnSync('php', [
    'tools/get_config.php',
    'useEEGBrowserVisualizationComponents',
  ], {});

  try {
    EEGVisEnabled = JSON.parse(getConfig.stdout.toString());
  } catch (e) {
    console.warn(
      '\x1b[33m',
      'WARNING: Unable to fetch DB config',
      'useEEGBrowserVisualizationComponents',
      '\x1b[0m',
    );
  }
}

const optimization = {
  minimizer: [
    (compiler: webpack.Compiler) => {
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: false,
          ecma: 2015,
          mangle: false,
        },
        extractComments: false,
      }).apply(compiler);
    },
  ],
};

const resolve: webpack.ResolveOptions = {
  alias: {
    jsx: path.resolve(__dirname, './jsx'),
    jslib: path.resolve(__dirname, './jslib'),
    Breadcrumbs: path.resolve(__dirname, './jsx/Breadcrumbs'),
    DataTable: path.resolve(__dirname, './jsx/DataTable'),
    Filter: path.resolve(__dirname, './jsx/Filter'),
    FilterableDataTable: path.resolve(__dirname, './jsx/FilterableDataTable'),
    FilterForm: path.resolve(__dirname, './jsx/FilterForm'),
    Loader: path.resolve(__dirname, './jsx/Loader'),
    Modal: path.resolve(__dirname, './jsx/Modal'),
    MultiSelectDropdown: path.resolve(__dirname, './jsx/MultiSelectDropdown'),
    PaginationLinks: path.resolve(__dirname, './jsx/PaginationLinks'),
    Panel: path.resolve(__dirname, './jsx/Panel'),
    ProgressBar: path.resolve(__dirname, './jsx/ProgressBar'),
    StaticDataTable: path.resolve(__dirname, './jsx/StaticDataTable'),
    Tabs: path.resolve(__dirname, './jsx/Tabs'),
    TriggerableModal: path.resolve(__dirname, './jsx/TriggerableModal'),
    Card: path.resolve(__dirname, './jsx/Card'),
    Help: path.resolve(__dirname, './jsx/Help'),
  },
  extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
  fallback: {
    fs: false,
    path: false,
  },
};

const module: webpack.ModuleOptions = {
  rules: [
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
  ],
};

const plugins: webpack.WebpackPluginInstance[] = [];

plugins.push(new CopyPlugin({
  patterns: [
    {
      from: path.resolve(__dirname, 'node_modules/react/umd'),
      to: path.resolve(__dirname, 'htdocs/vendor/js/react'),
      force: true,
      globOptions: {
        ignore: ['react.profiling.min.js'],
      },
      /** https://webpack.js.org/plugins/copy-webpack-plugin/#filter */
      filter: async (path) => {
        const file = path.split(/\\|\//).pop() as string;
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
      /** https://webpack.js.org/plugins/copy-webpack-plugin/#filter */
      filter: async (path) => {
        const file = path.split(/\\|\//).pop() as string;
        const keep = [
          'react-dom.development.js',
          'react-dom.production.min.js',
        ];
        return keep.includes(file);
      },
    },
  ],
}));

plugins.push(new DefinePlugin({
  EEG_VIS_ENABLED: EEGVisEnabled,
}));

if (EEGVisEnabled !== 'true' && EEGVisEnabled !== '1' ) {
  plugins.push(
    new IgnorePlugin({
      resourceRegExp: /react-series-data-viewer/,
    })
  );
}

/**
 * Get the webpack entries of a given module, which is described by its name
 * and its entry points.
 *
 * @returns A list of two-element tuples mapping each entry name (exemple
 * 'login/loginIndex') to its webpack entry.
 */
function makeModuleEntries(moduleName: string, files: string[]) {
  // Check if a project override exists for the module.
  const basePath = fs.existsSync(`./project/modules/${moduleName}`)
    ? `./project/modules/${moduleName}/`
    : `./modules/${moduleName}/`;

  return files.map((fileName) => ([moduleName + '/' + fileName, {
    import: basePath + 'jsx/' + fileName,
    filename: basePath + 'js/' + fileName + '.js',
    library: {
      name: ['lorisjs', moduleName, fileName],
      type: 'window',
    },
  }]));
}

// Add entries for project overrides.
if (fs.existsSync('./project/webpack-project.config.js')) {
  const projectModules: { [x: string]: string[] }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    = require('./project/webpack-project.config.js');

  for (const [moduleName, files] of Object.entries(projectModules)) {
    if (moduleName in lorisModules) {
      lorisModules[moduleName].push(...files);
    } else {
      lorisModules[moduleName] = files;
    }
  }
}

// Only build the given target module if there is one in the current
// environment.
const target = process.env.target;
if (target) {
  if (target in lorisModules) {
    lorisModules = {
      [target]: lorisModules[target],
    };
  } else {
    console.error(`Target module '${target}' not found.`);
    process.exit(1);
  }
}

// Transform the mapping of LORIS modules to a mapping of webpack entry points.
const entries = Object.fromEntries(
  Object.entries(lorisModules)
    .map(([name, files]) => makeModuleEntries(name, files))
    .flat()
);

const configs: webpack.Configuration[] = [];

configs.push({
  entry: {
    PaginationLinks: './jsx/PaginationLinks.js',
    StaticDataTable: './jsx/StaticDataTable.js',
    MultiSelectDropdown: './jsx/MultiSelectDropdown.js',
    Breadcrumbs: './jsx/Breadcrumbs.js',
    CSSGrid: './jsx/CSSGrid.js',
    Help: './jsx/Help.js',
    ...entries,
  },
  output: {
    path: __dirname,
    filename: './htdocs/js/components/[name].js',
    library: ['lorisjs', '[name]'],
    libraryTarget: 'window',
  },
  externals: {'react': 'React', 'react-dom': 'ReactDOM'},
  devtool: 'source-map',
  plugins,
  optimization,
  resolve,
  module,
  stats: 'errors-warnings',
});

// HACK: For some reason, the electrophysiology session view only compiles if
// it uses a separate (although possibly identical) configuration.
if (!target || target === 'electrophysiology_browser') {
  configs.push({
    entry: {
      electrophysiology_browser: {
        import: './modules/electrophysiology_browser/'
          + 'jsx/electrophysiologySessionView',
        filename: './modules/electrophysiology_browser/'
          + 'js/electrophysiologySessionView.js',
        library: {
          name: [
            'lorisjs',
            'electrophysiology_browser',
            'electrophysiologySessionView',
          ],
          type: 'window',
        },
      },
    },
    output: {
      path: __dirname,
      filename: './htdocs/js/components/[name].js',
      library: ['lorisjs', '[name]'],
      libraryTarget: 'window',
    },
    externals: {'react': 'React', 'react-dom': 'ReactDOM'},
    devtool: 'source-map',
    plugins,
    optimization,
    resolve,
    module,
    stats: 'errors-warnings',
  });
}

export default configs;
