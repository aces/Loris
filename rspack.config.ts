import cp from 'child_process';
import fs from 'fs';
import path from 'path';
import rspack, {
  CopyRspackPlugin,
  DefinePlugin,
  IgnorePlugin,
  SwcJsMinimizerRspackPlugin,
} from '@rspack/core';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const isDev = process.env.NODE_ENV === 'development';

// An object mapping each LORIS module to its entry points.
let lorisModules: Record<string, string[]> = {
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

const optimization: rspack.Optimization = {
  minimizer: [
    (compiler: rspack.Compiler) => {
      new SwcJsMinimizerRspackPlugin({
        minimizerOptions: {
          compress: false,
          format: {
            ecma: 2015,
          },
          mangle: false,
        },
        extractComments: false,
      }).apply(compiler);
    },
  ],
};

const resolve: rspack.ResolveOptions = {
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

const module: rspack.ModuleOptions = {
  rules: [
    {
      test: /\.(jsx?|tsx?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                jsx: true,
                tsx: true,
              },
            },
            sourceMaps: true
          },
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
  ],
};

const plugins: rspack.RspackPluginInstance[] = [
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      mode: 'write-references',
      build: true,
    }
  }) as any,
];

plugins.push(new CopyRspackPlugin({
  patterns: [
    {
      from: `node_modules/react/umd/${isDev
        ? 'react.development.js'
        : 'react.production.min.js'
      }`,
      to: 'htdocs/vendor/js/react',
      force: true,
    },
    {
      from: `node_modules/react-dom/umd/${isDev
        ? 'react-dom.development.js'
        : 'react-dom.production.min.js'
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
 * Get the rspack entries of a given module, which is described by its name
 * and its entry points.
 *
 * @returns A list of two-element tuples mapping each entry name (exemple
 * 'login/loginIndex') to its rspack entry.
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
if (fs.existsSync('./project/rspack-project.config.js')) {
  const projectModules: Record<string, string[]>
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    = require('./project/rspack-project.config.js');

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
  if (!(target in lorisModules)) {
    console.error(`Target module '${target}' not found`);
    process.exit(1);
  }

  console.log(`Building module ${target}`);
  lorisModules = {
    [target]: lorisModules[target],
  };
} else {
  console.log('Building all modules');
}

// Transform the mapping of LORIS modules to a mapping of rspack entry points.
const entries = Object.fromEntries(
  Object.entries(lorisModules)
    .map(([name, files]) => makeModuleEntries(name, files))
    .flat()
);

export default {
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
} satisfies rspack.Configuration;
