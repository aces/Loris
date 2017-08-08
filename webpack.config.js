var webpack = require('webpack');
var path = require('path');

var config = {
  entry: {
    './htdocs/js/components/DynamicDataTable.js': './jsx/DynamicDataTable.js',
    './htdocs/js/components/PaginationLinks.js': './jsx/PaginationLinks.js',
    './htdocs/js/components/StaticDataTable.js': './jsx/StaticDataTable.js',
    './htdocs/js/components/Breadcrumbs.js': './jsx/Breadcrumbs.js',
    './htdocs/js/components/Form.js': './jsx/Form.js',
    './htdocs/js/components/Markdown.js': './jsx/Markdown.js',
    './modules/media/js/mediaIndex.js': './modules/media/jsx/mediaIndex.js',
    './modules/media/js/editFormIndex.js': './modules/media/jsx/editFormIndex.js',
    './modules/issue_tracker/js/columnFormatter.js': './modules/issue_tracker/jsx/columnFormatter.js',
    './modules/issue_tracker/js/index.js': './modules/issue_tracker/jsx/index.js',
    './modules/candidate_parameters/js/index.js': './modules/candidate_parameters/jsx/index.js',
    './modules/configuration/js/SubprojectRelations.js': './modules/configuration/jsx/SubprojectRelations.js',
    './modules/bvl_feedback/js/react.behavioural_feedback_panel.js': './modules/bvl_feedback/jsx/react.behavioural_feedback_panel.js',
    './modules/data_team_helper/js/behavioural_qc_module.js': './modules/data_team_helper/jsx/behavioural_qc_module.js',
    './modules/candidate_list/js/columnFormatter.js': './modules/candidate_list/jsx/columnFormatter.js',
    './modules/datadict/js/columnFormatter.js': './modules/datadict/jsx/columnFormatter.js',
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
    './modules/imaging_browser/js/columnFormatter.js': './modules/imaging_browser/jsx/columnFormatter.js',
    './modules/imaging_browser/js/onSort.js': './modules/imaging_browser/jsx/onSort.js',
    './modules/instrument_builder/js/react.instrument_builder.js': './modules/instrument_builder/jsx/react.instrument_builder.js',
    './modules/instrument_builder/js/react.questions.js': './modules/instrument_builder/jsx/react.questions.js',
    './modules/survey_accounts/js/columnFormatter.js': './modules/survey_accounts/jsx/columnFormatter.js',
    './modules/server_processes_manager/js/columnFormatter.js': './modules/server_processes_manager/jsx/columnFormatter.js',
    './modules/mri_violations/js/mri_protocol_check_violations_columnFormatter.js': './modules/mri_violations/jsx/mri_protocol_check_violations_columnFormatter.js',
    './modules/mri_violations/js/columnFormatter.js': './modules/mri_violations/jsx/columnFormatter.js',
    './modules/mri_violations/js/columnFormatterUnresolved.js': './modules/mri_violations/jsx/columnFormatterUnresolved.js',
    './modules/mri_violations/js/mri_protocol_violations_columnFormatter.js': './modules/mri_violations/jsx/mri_protocol_violations_columnFormatter.js',
    './modules/user_accounts/js/columnFormatter.js': './modules/user_accounts/jsx/columnFormatter.js',
    './modules/reliability/js/columnFormatter.js': './modules/reliability/jsx/columnFormatter.js',
    './modules/conflict_resolver/js/resolved_conflicts_columnFormatter.js': './modules/conflict_resolver/jsx/resolved_conflicts_columnFormatter.js',
    './modules/conflict_resolver/js/unresolved_columnFormatter.js': './modules/conflict_resolver/jsx/unresolved_columnFormatter.js',
    './modules/examiner/js/columnFormatter.js': './modules/examiner/jsx/columnFormatter.js',
    './modules/final_radiological_review/js/columnFormatter.js': './modules/final_radiological_review/jsx/columnFormatter.js',
    './modules/help_editor/js/columnFormatter.js': './modules/help_editor/jsx/columnFormatter.js',
    './modules/brainbrowser/js/Brainbrowser.js': './modules/brainbrowser/jsx/Brainbrowser.js',
    './modules/data_integrity_flag/js/index.js': './modules/data_integrity_flag/jsx/index.js',
    './modules/imaging_uploader/js/index.js': './modules/imaging_uploader/jsx/index.js'
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
  resolve: {
    root: path.resolve(__dirname),
    alias: {
      util: 'htdocs/js/util',
      jsx: 'jsx',
      Breadcrumbs: 'jsx/Breadcrumbs',
      DynamicDataTable: 'jsx/DynamicDataTable',
      FilterForm: 'jsx/FilterForm',
      Form: 'jsx/Form',
      Markdown: 'jsx/Markdown',
      PaginationLinks: 'jsx/PaginationLinks',
      Panel: 'jsx/Panel',
      ProgressBar: 'jsx/ProgressBar',
      StaticDataTable: 'jsx/StaticDataTable',
      Tabs: 'jsx/Tabs'
    },
    extensions: ['', '.js', '.jsx']
  },
  externals: {
    react: 'React'
  },
  devtool: 'source-map',
  plugins: [new webpack.optimize.UglifyJsPlugin({mangle: false})]
};

module.exports = config;
