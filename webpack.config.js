var webpack = require('webpack');

var config = {
  entry: {
    './htdocs/js/components/DynamicDataTable.js': './jsx/DynamicDataTable.js',
    './htdocs/js/components/FilterForm.js': './jsx/FilterForm.js',
    './htdocs/js/components/PaginationLinks.js': './jsx/PaginationLinks.js',
    './htdocs/js/components/StaticDataTable.js': './jsx/StaticDataTable.js',
    './htdocs/js/components/Breadcrumbs.js': './jsx/Breadcrumbs.js',
    './htdocs/js/components/Form.js': './jsx/Form.js',
    './htdocs/js/components/Tabs.js': './jsx/Tabs.js',
    './htdocs/js/components/Markdown.js': './jsx/Markdown.js',
    './modules/media/js/columnFormatter.js': './modules/media/jsx/columnFormatter.js',
    './modules/media/js/editForm.js': './modules/media/jsx/editForm.js',
    './modules/media/js/uploadForm.js': './modules/media/jsx/uploadForm.js',
    './modules/issue_tracker/js/columnFormatter.js': './modules/issue_tracker/jsx/columnFormatter.js',
    './modules/issue_tracker/js/editIssue.js': './modules/issue_tracker/jsx/editIssue.js',
    './modules/candidate_parameters/js/candidateInfo.js': './modules/candidate_parameters/jsx/candidateInfo.js',
    './modules/candidate_parameters/js/consentStatus.js': './modules/candidate_parameters/jsx/consentStatus.js',
    './modules/candidate_parameters/js/familyInfo.js': './modules/candidate_parameters/jsx/familyInfo.js',
    './modules/candidate_parameters/js/participantStatus.js': './modules/candidate_parameters/jsx/participantStatus.js',
    './modules/candidate_parameters/js/probandInfo.js': './modules/candidate_parameters/jsx/probandInfo.js',
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
    './modules/dicom_archive/js/columnFormatter.js': './modules/dicom_archive/jsx/columnFormatter.js',
    './modules/dicom_archive/js/dicom_archive.js': './modules/dicom_archive/jsx/dicom_archive.js',
    './modules/genomic_browser/js/FileUploadModal.js': './modules/genomic_browser/jsx/FileUploadModal.js',
    './modules/imaging_browser/js/ImagePanel.js': './modules/imaging_browser/jsx/ImagePanel.js',
    './modules/imaging_browser/js/columnFormatter.js': './modules/imaging_browser/jsx/columnFormatter.js',
    './modules/instrument_builder/js/react.instrument_builder.js': './modules/instrument_builder/jsx/react.instrument_builder.js',
    './modules/instrument_builder/js/react.questions.js': './modules/instrument_builder/jsx/react.questions.js',
    './modules/survey_accounts/js/columnFormatter.js': './modules/survey_accounts/jsx/columnFormatter.js',
    './modules/server_processes_manager/js/columnFormatter.js': './modules/server_processes_manager/jsx/columnFormatter.js',
    './modules/mri_violations/js/mri_protocol_check_violations_columnFormatter.js': './modules/mri_violations/jsx/mri_protocol_check_violations_columnFormatter.js',
    './modules/mri_violations/js/columnFormatter.js': './modules/mri_violations/jsx/columnFormatter.js',
    './modules/user_accounts/js/columnFormatter.js': './modules/user_accounts/jsx/columnFormatter.js',
    './modules/reliability/js/columnFormatter.js': './modules/reliability/jsx/columnFormatter.js',
    './modules/conflict_resolver/js/resolved_conflicts_columnFormatter.js': './modules/conflict_resolver/jsx/resolved_conflicts_columnFormatter.js',
    './modules/conflict_resolver/js/unresolved_columnFormatter.js': './modules/conflict_resolver/jsx/unresolved_columnFormatter.js',
    './modules/examiner/js/columnFormatter.js': './modules/examiner/jsx/columnFormatter.js',
    './modules/final_radiological_review/js/columnFormatter.js': './modules/final_radiological_review/jsx/columnFormatter.js',
    './modules/help_editor/js/columnFormatter.js': './modules/help_editor/jsx/columnFormatter.js',
    './modules/brainbrowser/js/Brainbrowser.js': './modules/brainbrowser/jsx/Brainbrowser.js'
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
  },
  devtool: 'source-map',
  plugins: [new webpack.optimize.UglifyJsPlugin()]
};

module.exports = config;
