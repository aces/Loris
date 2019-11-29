-- 0000-00-05-ElectrophysiologyTables.sql
DROP TABLE IF EXISTS `physiological_archive`;
DROP TABLE IF EXISTS `physiological_task_event`;
DROP TABLE IF EXISTS `physiological_electrode`;
DROP TABLE IF EXISTS `physiological_electrode_material`;
DROP TABLE IF EXISTS `physiological_electrode_type`;
DROP TABLE IF EXISTS `physiological_channel`;
DROP TABLE IF EXISTS `physiological_channel_type`;
DROP TABLE IF EXISTS `physiological_status_type`;
DROP TABLE IF EXISTS `physiological_parameter_file`;
DROP TABLE IF EXISTS `physiological_file`;
DROP TABLE IF EXISTS `physiological_output_type`;
DROP TABLE IF EXISTS `physiological_modality`;

-- 0000-00-04-Help.sql
DROP TABLE IF EXISTS `help`;

-- 0000-00-03-ConfigTables.sql
DROP TABLE IF EXISTS `Config`;
DROP TABLE IF EXISTS `ConfigSettings`;

-- 0000-00-02-Menus.sql
DROP TABLE IF EXISTS `LorisMenuPermissions`;
DROP TABLE IF EXISTS `LorisMenu`;

-- 0000-00-01-Permission.sql
DROP TABLE IF EXISTS `user_perm_rel`;
DROP TABLE IF EXISTS `notification_modules_perm_rel`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `permissions_category`;

-- 0000-00-00-schema.sql
DROP TABLE IF EXISTS `candidate_consent_rel`;
DROP TABLE IF EXISTS `consent`;
DROP TABLE IF EXISTS `candidate_consent_history`;

DROP TABLE IF EXISTS `acknowledgements`;

DROP TABLE IF EXISTS `data_release_permissions`;
DROP TABLE IF EXISTS `data_release`;

DROP TABLE IF EXISTS `ExternalLinks`;
DROP TABLE IF EXISTS `ExternalLinkTypes`;

DROP TABLE IF EXISTS `feedback_mri_comments`;
DROP TABLE IF EXISTS `feedback_mri_predefined_comments`;
DROP TABLE IF EXISTS `feedback_mri_comment_types`;
DROP TABLE IF EXISTS `feedback_bvl_entry`;
DROP TABLE IF EXISTS `feedback_bvl_thread`;
DROP TABLE IF EXISTS `feedback_bvl_type`;

DROP TABLE IF EXISTS `genomic_cpg`;
DROP TABLE IF EXISTS `genomic_cpg_annotation`;
DROP TABLE IF EXISTS `genomic_sample_candidate_rel`;
DROP TABLE IF EXISTS `genomic_candidate_files_rel`;
DROP TABLE IF EXISTS `genomic_files`;
DROP TABLE IF EXISTS `genomic_analysis_modality_enum`;
DROP TABLE IF EXISTS `GWAS`;
DROP TABLE IF EXISTS `CNV`;
DROP TABLE IF EXISTS `SNP_candidate_rel`;
DROP TABLE IF EXISTS `SNP`;
DROP TABLE IF EXISTS `genotyping_platform`;
DROP TABLE IF EXISTS `gene`;
DROP TABLE IF EXISTS `genome_loc`;

DROP TABLE IF EXISTS `publication_upload`;
DROP TABLE IF EXISTS `publication_upload_type`;
DROP TABLE IF EXISTS `publication_test_names_rel`;
DROP TABLE IF EXISTS `publication_users_edit_perm_rel`;
DROP TABLE IF EXISTS `publication_keyword_rel`;
DROP TABLE IF EXISTS `publication_keyword`;
DROP TABLE IF EXISTS `publication_parameter_type_rel`;
DROP TABLE IF EXISTS `publication_collaborator_rel`;
DROP TABLE IF EXISTS `publication`;
DROP TABLE IF EXISTS `publication_status`;
DROP TABLE IF EXISTS `publication_collaborator`;

DROP TABLE IF EXISTS `parameter_session`;
DROP TABLE IF EXISTS `parameter_file`;
DROP TABLE IF EXISTS `parameter_candidate`;
DROP TABLE IF EXISTS `parameter_type_override`;
DROP TABLE IF EXISTS `parameter_type_category_rel`;
DROP TABLE IF EXISTS `parameter_type_category`;
DROP TABLE IF EXISTS `parameter_type`;

DROP TABLE IF EXISTS `issues_watching`;
DROP TABLE IF EXISTS `issues_comments_history`;
DROP TABLE IF EXISTS `issues_history`;
DROP TABLE IF EXISTS `issues_comments`;
DROP TABLE IF EXISTS `issues`;
DROP TABLE IF EXISTS `issues_categories`;

DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `server_processes`;
DROP TABLE IF EXISTS `StatisticsTabs`;
DROP TABLE IF EXISTS `user_login_history`;
DROP TABLE IF EXISTS `user_account_history`;
DROP TABLE IF EXISTS `data_integrity_flag`;
DROP TABLE IF EXISTS `certification_training_quiz_answers`;
DROP TABLE IF EXISTS `certification_training_quiz_questions`;
DROP TABLE IF EXISTS `certification_training`;
DROP TABLE IF EXISTS `certification_history`;
DROP TABLE IF EXISTS `certification`;
DROP TABLE IF EXISTS `examiners_psc_rel`;
DROP TABLE IF EXISTS `examiners`;

DROP TABLE IF EXISTS `participant_status_history`;
DROP TABLE IF EXISTS `family`;
DROP TABLE IF EXISTS `participant_emails`;
DROP TABLE IF EXISTS `participant_accounts`;
DROP TABLE IF EXISTS `participant_status`;
DROP TABLE IF EXISTS `participant_status_options`;

DROP TABLE IF EXISTS `conflicts_resolved`;
DROP TABLE IF EXISTS `conflicts_unresolved`;


DROP TABLE IF EXISTS `notification_spool`;
DROP TABLE IF EXISTS `notification_types`;
DROP TABLE IF EXISTS `notification_history`;
DROP TABLE IF EXISTS `users_notifications_rel`;
DROP TABLE IF EXISTS `notification_modules_services_rel`;
DROP TABLE IF EXISTS `notification_services`;
DROP TABLE IF EXISTS `notification_modules`;

DROP TABLE IF EXISTS `document_repository`;
DROP TABLE IF EXISTS `document_repository_categories`;

DROP TABLE IF EXISTS `bids_mri_scan_type_rel`;
DROP TABLE IF EXISTS `bids_category`;
DROP TABLE IF EXISTS `bids_scan_type`;
DROP TABLE IF EXISTS `bids_scan_type_subcategory`;
DROP TABLE IF EXISTS `violations_resolved`;
DROP TABLE IF EXISTS `mri_violations_log`;
DROP TABLE IF EXISTS `mri_protocol_checks`;
DROP TABLE IF EXISTS `mri_upload`;
DROP TABLE IF EXISTS `MRICandidateErrors`;
DROP TABLE IF EXISTS `mri_protocol_violated_scans`;
DROP TABLE IF EXISTS `mri_protocol`;
DROP TABLE IF EXISTS `files_qcstatus`;
DROP TABLE IF EXISTS `files_intermediary`;
DROP TABLE IF EXISTS `files`;
DROP TABLE IF EXISTS `mri_scan_type`;
DROP TABLE IF EXISTS `mri_scanner`;
DROP TABLE IF EXISTS `mri_processing_protocol`;
DROP TABLE IF EXISTS `ImagingFileTypes`;

DROP TABLE IF EXISTS `tarchive_files`;
DROP TABLE IF EXISTS `tarchive_series`;
DROP TABLE IF EXISTS `tarchive`;

DROP TABLE IF EXISTS `history`;
DROP TABLE IF EXISTS `Visit_Windows`;
DROP TABLE IF EXISTS `test_battery`;
DROP TABLE IF EXISTS `flag`;
DROP TABLE IF EXISTS `instrument_subtests`;
DROP TABLE IF EXISTS `test_names`;
DROP TABLE IF EXISTS `test_subgroups`;
DROP TABLE IF EXISTS `session_status`;
DROP TABLE IF EXISTS `session`;
DROP TABLE IF EXISTS `user_psc_rel`;
DROP TABLE IF EXISTS `user_project_rel`;
DROP TABLE IF EXISTS `candidate`;
DROP TABLE IF EXISTS `caveat_options`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `language`;
DROP TABLE IF EXISTS `psc`;
DROP TABLE IF EXISTS `visit_project_subproject_rel`;
DROP TABLE IF EXISTS `visit`;
DROP TABLE IF EXISTS `project_subproject_rel`;
DROP TABLE IF EXISTS `Project`;
DROP TABLE IF EXISTS `subproject`;


