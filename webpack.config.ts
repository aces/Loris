import cp from 'child_process';
import fs from 'fs';
import path from 'path';
import webpack, {DefinePlugin, IgnorePlugin} from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

// Build mode (development or production)
const isDev = process.env.NODE_ENV === 'development';

// Target module to build (if there is one)
const target = process.env.target;

// A record mapping each LORIS module to its entry points
const lorisModules: Record<string, string[]> = {
  media: ['CandidateMediaWidget', 'mediaIndex'],
  issue_tracker: ['issueTrackerIndex', 'index', 'CandidateIssuesWidget'],
  login: ['loginIndex', 'mfaPrompt'],
  publication: ['publicationIndex', 'viewProjectIndex'],
  document_repository: ['docIndex', 'editFormIndex'],
  candidate_parameters: ['CandidateParameters', 'ConsentWidget', 'DiagnosisEvolution'],
  configuration: [
    'CohortRelations',
    'configuration_helper',
    'DiagnosisEvolution',
  ],
  conflict_resolver: ['conflict_resolver', 'CandidateConflictsWidget'],
  battery_manager: ['batteryManagerIndex'],
  bvl_feedback: ['react.behavioural_feedback_panel'],
  behavioural_qc: ['behaviouralQCIndex'],
  biobank: ['biobankIndex'],
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
    'electrophysiologySessionView',
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
  my_preferences: ['mfa'],
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
    Tabs: path.resolve(__dirname, './jsx/Tabs'),
    TriggerableModal: path.resolve(__dirname, './jsx/TriggerableModal'),
    Card: path.resolve(__dirname, './jsx/Card'),
    Help: path.resolve(__dirname, './jsx/Help'),
    I18nSetup: path.resolve(__dirname, './jsx/I18nSetup'),
  },
  extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
  fallback: {
    fs: false,
    path: false,
    stream: require.resolve("stream-browserify"),
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
      exclude: [/react-series-data-viewer/],
      use: [
        {
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true,
          },
        },
      ],
    },
    {
      test: /.*\/react-series-data-viewer\/.*\.tsx?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true,
            compilerOptions: {
              strict: false,
          },
        },
      },
    ],
  },
  ],
};

const plugins: webpack.WebpackPluginInstance[] = [];

plugins.push(new CopyPlugin({
  patterns: [
    {
      from: `node_modules/react/umd/${
        isDev ? 'react.development.js' : 'react.production.min.js'
      }`,
      to: 'htdocs/vendor/js/react',
      force: true,
    },
    {
      from: `node_modules/react-dom/umd/${
        isDev ? 'react-dom.development.js' : 'react-dom.production.min.js'
      }`,
      to: 'htdocs/vendor/js/react',
      force: true,
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
 * Add the project-specific modules and entry points to the record of main
 * LORIS modules.
 */
function addProjectModules(
  modules: Record<string, string[]>,
): Record<string, string[]> {
  if (!fs.existsSync('./project/webpack-project.config.js')) {
    return modules;
  }

  const projectModules: Record<string, string[]>
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    = require('./project/webpack-project.config.js');

  // Copy the record of LORIS modules
  const allModules: Record<string, string[]> = modules;
  
  // Add project-specific modules and overrides to the record of modules
  for (const [moduleName, moduleEntryPoints] of
    Object.entries(projectModules)
  ) {
    if (moduleName in allModules) {
      allModules[moduleName].push(...moduleEntryPoints);
    } else {
      allModules[moduleName] = moduleEntryPoints;
    }
  }

  return allModules;
}

/**
 * Filter the record of LORIS modules to contain only the target module if a
 * target is defined, or return the record unchanged if no target is defined.
 */
function filterTargetModules(
  modules: Record<string, string[]>,
): Record<string, string[]> {
  // If there is no target module, do not filter the modules
  if (!target) {
    // eslint-disable-next-line no-console
    console.log('Building all modules');
    return modules;
  }

  // Exit if the target module is not found in the list of modules
  if (!(target in modules)) {
    console.error(`Target module \''${target}'\' not found`);
    process.exit(1);
  }

  // Return a record containing only the target module files
  // eslint-disable-next-line no-console
  console.log(`Building module \'${target}\'`);
  return {
    [target]: modules[target],
  };
}

/**
 * Get the Webpack entries of a given module, with each entry being mapped to
 * its name.
 */
function getModuleEntries(
  moduleName: string,
  moduleEntryPoints: string[],
): Record<string, webpack.EntryOptions>[] {
  // Check if a project override exists for the module.
  const basePath = fs.existsSync(`./project/modules/${moduleName}`)
    ? `./project/modules/${moduleName}/`
    : `./modules/${moduleName}/`;

  return moduleEntryPoints.map((moduleEntryPoint) => ({
    [moduleName + '/' + moduleEntryPoint]: {
      import: basePath + 'jsx/' + moduleEntryPoint,
      filename: basePath + 'js/' + moduleEntryPoint + '.js',
      library: {
        name: ['lorisjs', moduleName, moduleEntryPoint],
        type: 'window',
      },
    },
  }));
}

/**
 * Get the Webpack entries of the LORIS modules to build, with each entry being
 * mapped to its name.
 */
function getModulesEntries(): Record<string, webpack.EntryOptions> {
  const allModules = addProjectModules(lorisModules);
  const targetModules = filterTargetModules(allModules);
  const moduleEntries = Object.entries(targetModules)
    .map(([moduleName, moduleEntryPoints]) =>
      getModuleEntries(moduleName, moduleEntryPoints)
    )
    .flat();

  return Object.assign({}, ...moduleEntries);
}

const configs: webpack.Configuration[] = [];

configs.push({
  entry: {
    PaginationLinks: './jsx/PaginationLinks.js',
    MultiSelectDropdown: './jsx/MultiSelectDropdown.js',
    Breadcrumbs: './jsx/Breadcrumbs.js',
    PolicyButton: './jsx/PolicyButton.js',
    CSSGrid: './jsx/CSSGrid.js',
    Help: './jsx/Help.js',
    ...getModulesEntries(),
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

export default configs;
