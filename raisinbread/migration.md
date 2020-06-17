# NEW

# CLEAN-UP


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
2019-07-10-subproject-session-FK.sql
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