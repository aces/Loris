# NEW


# CLEAN-UP

____________________________________________________________________________________________________________________
# 25.0
2021-03-01-publication-add-columns.sql
2021-09-13_fix_project_primary_key.sql
2021-12-01-make_subproject_titles_unique.sql
2022-03-03-AddHEDTags.sql
2022-11-22-eeg-additional-events-table.sql
2022-11-24-electrode-coord-system.sql
2022-12-01-subprojects_no_more.sql
2022-12-05-AddVizConfig.sql
2022-12-20-instrumentpermissions.sql
2022-12-20-project-name-not-null.sql
2023-01-19_add_index_on_violations_resolved.sql
2023-01-31-add-date-stage-change.sql
2023-02-17-imaging-new-config.sql
2023-02-24-electrophysiology_uploader.sql
2023-02-28_create_max_days_inactive_config_for_users.sql
2023-04-24_add_phase_enc_dir_and_echo_number_to_MRICandidateErrors.sql

## 25.0 - cleanup
2021-11-17-noextlibs.sql
2022-12-15-Drop_Flag_status.sql
2023-02-21-unusedconfigs.sql
2023-07-10-remove_quality_control_from_projects.sql
____________________________________________________________________________________________________________________
# 24.0
2019-07-01_fix_project_in_session.sql
2019-09-18_DocRepoEdit.sql
2019-12-17-RemovePasswordExpiry.sql
2020-01-07-publication_users_edit_perm_rel_pk.sql
2020-02-10-AddConsentGrouping.sql
2020-02-10_NewModulePermissions.sql
2020-02-25_Add-Admin-Contact-Email.sql
2020-03-09-SQL_patch_for_HRRT_PET_images_insertion.sql
2020-03-26_add_account_request_date_to_users_table.sql
2020-06-16-Add_Date_Format_to_ConfigSettings_DataType.sql
2020-07-14_NewModuleDQT.sql
2020-07-22_RenameBatteryManagerPermissions.sql
2020-07-29_Required_elements_completed_flag_column.sql
2020-08-10_add_AcquisitionDate_to_files.sql
2020-08-11_adding_api_docs_module.sql
2020-10-29-session-current-stage-default.sql
2021-01-31-renaming_permissions.sql
2021-02-19_electrophysiology_annotation_tables.sql
2021-03-15_change_parameter_file_Value_longtext.sql
2021-03-31-NewDictionaryModule.sql
2021-04-23-annotation_permissions.sql
2021-05-20-Electrophysiology-split-files.sql
2021-06-11_exported_files_BIDS_tables.sql
2021-06-17_mnc2bids_Config_Settings.sql
2021-06-23_set_default_ScannerID_to_NULL.sql
2021-06-25_add_alias_column_to_parameter_type_for_bids_parameter_names.sql
2019-06-01-log_level-2021-07-19.sql
2021-07-28_add_EchoTime_field_to_violation_tables.sql
2021-07-29-physiological_task_event_columns_types.sql
2021-07-29_modify_center_name_in_mri_protocol.sql
2021-07-30-physiological_parameter_file_columns_types.sql
2021-08-21_issue_tracker_description_change.sql
2021-08-25-physiological_annotation_schema_changes.sql
2021-08-27_conflict_resolved_unique_key.sql
2021-09-07_dqt_drop_old_dataquery.sql
2021-09-28-Unique_examiners.sql
2021-10-01-visits_in_database.sql
2021-11-23-Electrophysiology_electrodes_nullable_xyz.sql
2022-01-04-add_config_for_python_config_file.sql
2022-01-26-S3Support.sql

## 24.0 - cleanup
2020-02-06-NoMultipleSitesConf.sql
2020-06-18-remove_violated_scans_edit_permission.sql
2020-08-11-RemoveReliabilityPermissions.sql
2020-09-09-RemoveHelpParentID.sql
2021-01-31-deleting_permissions.sql
____________________________________________________________________________________________________________________
# 23.0
2018-05-18-adding_physiological_all_sites_permissions.sql
2018-07-23-battery_manager_permissions.sql
2019-02-08-multiple_mri_protocols.sql
2019-07-02-Add_Edit_DoB_Permissions.sql
2019-07-04-add_DoD_feature.sql
2019-07-05-Add_Language_feature.sql
2019-08-06-Add_date_display_format_config_setting.sql
2019-10-09-move_MINCToolsPath_configuration_to_Config_tables.sql
2019-10-29-adding_issues_attachments_table.sql
2019-11-26-AddOtherSexEnum.sql
2019-11-29-Add_upload_directory_configuration.sql
2019-12-05-AddModuleTable.sql
2020-01-16-ModuleManager.sql
2020-01-20-adding_electrophysiology_browser_to_modules_table.sql
2020-02-18-MyPrefModule.sql
2020-02-24-CandidateProfileModule.sql
2020-04-20-Rename_highlander_permission.sql
2020-04-27-AddViolatedScansOwnSitePermission.sql

## 23.0 - cleanup
2019-12-05-RemoveMenus.sql
2019-12-06-Remove-DataIntegrityFlag.sql
2020-02-05-NoHostConfig.sql
2020-02-28-foreign_key_issues_modules.sql

# 22.0
2019-04-30-project-rel-rename.sql
2019-07-01_add_projects_to_sessions.sql
2019-07-04-remove_header_row_from_parameter_file_and_convert_back_to_Value_field_to_text.sql
2019-07-10-cohort-session-FK.sql
2019-07-17_remove_mri_acquisition_dates_table.sql
2019-08-05-add_projects_to_users.sql
2019-10-01_Rename-media-column.sql
2019-10-05-Add_alias_to_projects.sql
2019-11-01-Add_data_release_permissions.sql
2019-11-12-Rename_modules_QC_and_DTH.sql
2019-11-25-Default_value_for_session_submitted.sql

# 21.0
2018-01-17-normalisation_visit.sql
2018-01-23-qc_module_patch.sql
2018-02-27_normalize_mri_protocol.sql
2018-08-27-BIDSScanTypeTable.sql
2018-08-27-GenderToSex.sql
2018-11-05-rename_candidate_CenterID_to_RegistrationCenterID.sql
2018-11-29-Add_instrument_manager_permission.sql
2019-01-28_Add_Pwned_Password_ConfigSetting.sql
2019-02-08_cleanup_duplicated_data_path_in_Config.sql
2019-03-20-session-notnull.sql
2019-04-04_add_image_type_to_mri_protocol.sql
2019-04-26-Delete_cascades_parameter_type_rel.sql
2019-05-03-deprecate_useprojects.sql
2019-05-15-LorisMenuPermissions_QC_and_datarelease.sql
2019-05-22-ChangePublicationPathsToWebPathType.sql
2019-05-23-correct_type_ValidMin_ValidMax_of_mri_protocol_checks.sql
2019-06-06-AddActiveToNotificationSpool.sql
2019-06-13-LorisMenuPermissions_IssueTracker.sql

## 21.0 - cleanup
2018-02-20_remove_duplicate_value_from_Config.sql
2018-04-05_RemovePendingStagingFromFiles.sql
2018-11-20-remove_currentGUITable_field.sql
2019-05-13-RemoveTraining.sql
2019-05-15-Reliability_link.sql

# 20.3
2018-05-28_publication_schema.sql
2018-10-05_change_regex_config.sql
2018-11-13_add_path_to_config_enum.sql
2018-11-30_add_modality_to_deface_configuration.sql
2019-01-16_map_parameter_type_and_parameter_type_category_for_imaging.sql

# 20.2
2018-08-27_add_name_of_mri_config_file_to_config_module.sql
2018-09-07_EEG_tables.sql
2018-10-01-Add_data_release_permissions.sql
2018-11-23_insert_imaging_non_minc_file_insertion_in_notification_types.sql
2018-11-28_add_SNR_modalities_to_config_module.sql
