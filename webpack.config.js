const TerserPlugin = require('terser-webpack-plugin');
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
    ],
  };

function lorisModule(mname, entries) {
    let entObj = {};
    for(let i = 0;i < entries.length; i++) {
        entObj[entries[i]] = './modules/' + mname + '/jsx/' + entries[i] + '.js';
    }
    return {
        entry: entObj,
        output: {
            path: path.resolve(__dirname, 'modules') + '/' + mname + '/js/',
            filename: '[name].js',
            library: [ 'lorisjs', mname ],
            libraryTarget: 'window',
        },
        externals: {
            react: 'React',
        },
        node: {
            fs: 'empty',
        },
        devtool: 'source-map',
        plugins: [],
        optimization: optimization,
        resolve: resolve,
        module: mod
    };
}

const config = [
    // Core components
    {
        entry: {
            './htdocs/js/components/DynamicDataTable.js': './jsx/DynamicDataTable.js',
            './htdocs/js/components/PaginationLinks.js': './jsx/PaginationLinks.js',
            './htdocs/js/components/StaticDataTable.js': './jsx/StaticDataTable.js',
            './htdocs/js/components/MultiSelectDropdown.js': './jsx/MultiSelectDropdown.js',
            './htdocs/js/components/Breadcrumbs.js': './jsx/Breadcrumbs.js',
            './htdocs/js/components/Form.js': './jsx/Form.js',
            './htdocs/js/components/Markdown.js': './jsx/Markdown.js',
        },
        output: {
            path: __dirname + '/',
            filename: '[name]',
        },
        externals: {
            react: 'React',
        },
        node: {
            fs: 'empty',
        },
        devtool: 'source-map',
        plugins: [],
        optimization: optimization,
        resolve: resolve,
        module: mod
    },
    // Modules 
    lorisModule('media', ['mediaIndex']),
    lorisModule('issue_tracker', ['issueTrackerIndex', 'index']),
    lorisModule('publication', ['publicationIndex', 'viewProjectIndex']),
    lorisModule('document_repository', ['docIndex', 'editFormIndex']),
    lorisModule('candidate_parameters', [ 'CandidateParameters']),
    lorisModule('configuration', [ 'SubprojectRelations']),
    lorisModule('conflict_resolver', [ 'conflictResolverIndex', 'resolvedConflictsIndex' ]),
    lorisModule('battery_manager', ['batteryManagerIndex']),
    lorisModule('bvl_feedback', ['react.behavioural_feedback_panel']),
    lorisModule('behavioural_qc', [ 'behavioural_qc_module']),
    lorisModule('candidate_list', ['openProfileForm', 'onLoad', 'candidateListIndex']),
    lorisModule('datadict', ['dataDictIndex']),
    lorisModule('data_release', ['dataReleaseIndex', 'uploadFileForm', 'addPermissionForm']),
    lorisModule('dataquery', [ 'react.app', 'react.fieldselector', 'react.filterBuilder', 'react.paginator', 'react.sidebar', 'react.tabs']),
    lorisModule('dicom_archive', [ 'dicom_archive']),
    lorisModule('genomic_browser', [ 'FileUploadModal' ]),
    lorisModule('electrophysiology_browser', [ 'electrophysiologyBrowserIndex', 'electrophysiologySessionView', 'components/electrophysiology_session_panels', 'components/Sidebar', 'components/SidebarContent', ]),
    lorisModule('genomic_browser', ['profileColumnFormatter']),
    lorisModule('imaging_browser', [ 'ImagePanel', 'imagingBrowserIndex']),
    lorisModule('instrument_builder', [ 'react.instrument_builder', 'react.questions' ]),
    lorisModule('instrument_manager', [ 'instrumentManagerIndex' ]),
    lorisModule('survey_accounts', [ 'surveyAccountsIndex' ]),
    lorisModule('mri_violations', [ 'mri_protocol_check_violations_columnFormatter', 'columnFormatter', 'columnFormatterUnresolved', 'mri_protocol_violations_columnFormatter' ]),
    lorisModule('user_accounts', [ 'userAccountsIndex' ]),
    lorisModule('examiner', [ 'examinerIndex' ]),
    lorisModule('help_editor', [ 'help_editor' ]),
    lorisModule('brainbrowser', [ 'Brainbrowser' ]),
    lorisModule('imaging_uploader', [ 'index' ]),
    lorisModule('acknowledgements', [ 'acknowledgementsIndex' ]),
    lorisModule('new_profile', [ 'NewProfileIndex' ]),
    lorisModule('module_manager', [ 'modulemanager' ]),
    lorisModule('imaging_qc', [ 'imagingQCIndex' ]),
    lorisModule('server_processes_manager', [ 'server_processes_managerIndex' ]),
];

// Support project overrides
if (fs.existsSync('./project/webpack-project.config.js')) {
  const projConfig = require('./project/webpack-project.config.js');
  config[0].entry = Object.assign(config[0].entry, projConfig);
}

module.exports = config;
