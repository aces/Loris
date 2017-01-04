'use strict';
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-babel');

  /**
   * Important: all files that pass ESLint should be added to transpileES6 list.
   * Remaining files will eventually be linted and converted to ES6 as well.
   */
  grunt.initConfig({
    babel: {
      transpileES6: {
        options: {
          presets: ['react', 'es2015'],
          babelrc: false
        },
        files: {
          'htdocs/js/components/DynamicDataTable.js': 'jsx/DynamicDataTable.js',
          'htdocs/js/components/FilterTable.js': 'jsx/FilterTable.js',
          'htdocs/js/components/PaginationLinks.js': 'jsx/PaginationLinks.js',
          'htdocs/js/components/StaticDataTable.js': 'jsx/StaticDataTable.js',
          'htdocs/js/components/react.breadcrumb.js': 'jsx/react.breadcrumb.js',
          'htdocs/js/components/Form.js': 'jsx/Form.js',
          'htdocs/js/components/Tabs.js': 'jsx/Tabs.js',
          'htdocs/js/components/Markdown.js': 'jsx/Markdown.js',
          'modules/media/js/columnFormatter.js': 'modules/media/jsx/columnFormatter.js',
          'modules/media/js/editForm.js': 'modules/media/jsx/editForm.js',
          'modules/media/js/uploadForm.js': 'modules/media/jsx/uploadForm.js',
          'modules/issue_tracker/js/columnFormatter.js': 'modules/issue_tracker/jsx/columnFormatter.js',
          'modules/issue_tracker/js/editIssue.js': 'modules/issue_tracker/jsx/editIssue.js',
          'modules/candidate_parameters/js/candidateInfo.js': 'modules/candidate_parameters/jsx/candidateInfo.js',
          'modules/candidate_parameters/js/consentStatus.js': 'modules/candidate_parameters/jsx/consentStatus.js',
          'modules/candidate_parameters/js/familyInfo.js': 'modules/candidate_parameters/jsx/familyInfo.js',
          'modules/candidate_parameters/js/participantStatus.js': 'modules/candidate_parameters/jsx/participantStatus.js',
          'modules/candidate_parameters/js/probandInfo.js': 'modules/candidate_parameters/jsx/probandInfo.js',
          'modules/configuration/js/SubprojectRelations.js': 'modules/configuration/jsx/SubprojectRelations.js'
        }
      },
      transpileES5: {
        options: {
          presets: ['react'],
          babelrc: false
        },
        files: {
          'modules/bvl_feedback/js/react.behavioural_feedback_panel.js': 'modules/bvl_feedback/jsx/react.behavioural_feedback_panel.js',
          'modules/candidate_list/js/columnFormatter.js': 'modules/candidate_list/jsx/columnFormatter.js',
          'modules/data_team_helper/js/behavioural_qc_module.js': 'modules/data_team_helper/jsx/behavioural_qc_module.js',
          'modules/datadict/js/columnFormatter.js': 'modules/datadict/jsx/columnFormatter.js',
          'modules/dataquery/js/react.app.js': 'modules/dataquery/jsx/react.app.js',
          'modules/dataquery/js/react.fieldselector.js': 'modules/dataquery/jsx/react.fieldselector.js',
          'modules/dataquery/js/react.filterBuilder.js': 'modules/dataquery/jsx/react.filterBuilder.js',
          'modules/dataquery/js/react.paginator.js': 'modules/dataquery/jsx/react.paginator.js',
          'modules/dataquery/js/react.sidebar.js': 'modules/dataquery/jsx/react.sidebar.js',
          'modules/dataquery/js/react.tabs.js': 'modules/dataquery/jsx/react.tabs.js',
          'modules/dicom_archive/js/columnFormatter.js': 'modules/dicom_archive/jsx/columnFormatter.js',
          'modules/dicom_archive/js/dicom_archive.js': 'modules/dicom_archive/jsx/dicom_archive.js',
          'modules/genomic_browser/js/FileUploadModal.js': 'modules/genomic_browser/jsx/FileUploadModal.js',
          'modules/imaging_browser/js/ImagePanel.js': 'modules/imaging_browser/jsx/ImagePanel.js',
          'modules/imaging_browser/js/columnFormatter.js': 'modules/imaging_browser/jsx/columnFormatter.js',
          'modules/instrument_builder/js/react.instrument_builder.js': 'modules/instrument_builder/jsx/react.instrument_builder.js',
          'modules/instrument_builder/js/react.questions.js': 'modules/instrument_builder/jsx/react.questions.js',
          'modules/survey_accounts/js/columnFormatter.js': 'modules/survey_accounts/jsx/columnFormatter.js',
          'modules/server_processes_manager/js/columnFormatter.js': 'modules/server_processes_manager/jsx/columnFormatter.js',
          'modules/mri_violations/js/mri_protocol_check_violations_columnFormatter.js': 'modules/mri_violations/jsx/mri_protocol_check_violations_columnFormatter.js',
          'modules/user_accounts/js/columnFormatter.js': 'modules/user_accounts/jsx/columnFormatter.js',
          'modules/reliability/js/columnFormatter.js': 'modules/reliability/jsx/columnFormatter.js'
        }
      }
    }
  });

  grunt.registerTask('jsx', ['babel:transpileES6', 'babel:transpileES5']);
};
