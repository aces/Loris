CREATE TABLE `modules` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Active` enum('Y','N') NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `modules_id` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO modules (Name, Active) VALUES ('acknowledgements', 'Y');
INSERT INTO modules (Name, Active) VALUES ('api', 'Y');
INSERT INTO modules (Name, Active) VALUES ('battery_manager', 'Y');
INSERT INTO modules (Name, Active) VALUES ('behavioural_qc', 'Y');
INSERT INTO modules (Name, Active) VALUES ('brainbrowser', 'Y');
INSERT INTO modules (Name, Active) VALUES ('bvl_feedback', 'Y');
INSERT INTO modules (Name, Active) VALUES ('candidate_list', 'Y');
INSERT INTO modules (Name, Active) VALUES ('candidate_parameters', 'Y');
INSERT INTO modules (Name, Active) VALUES ('candidate_profile', 'Y');
INSERT INTO modules (Name, Active) VALUES ('configuration', 'Y');
INSERT INTO modules (Name, Active) VALUES ('conflict_resolver', 'Y');
INSERT INTO modules (Name, Active) VALUES ('create_timepoint', 'Y');
INSERT INTO modules (Name, Active) VALUES ('dashboard', 'Y');
INSERT INTO modules (Name, Active) VALUES ('data_release', 'Y');
INSERT INTO modules (Name, Active) VALUES ('datadict', 'Y');
INSERT INTO modules (Name, Active) VALUES ('dicom_archive', 'Y');
INSERT INTO modules (Name, Active) VALUES ('dictionary', 'Y');
INSERT INTO modules (Name, Active) VALUES ('document_repository', 'Y');
INSERT INTO modules (Name, Active) VALUES ('examiner', 'Y');
INSERT INTO modules (Name, Active) VALUES ('genomic_browser', 'Y');
INSERT INTO modules (Name, Active) VALUES ('help_editor', 'Y');
INSERT INTO modules (Name, Active) VALUES ('imaging_browser', 'Y');
INSERT INTO modules (Name, Active) VALUES ('imaging_qc', 'Y');
INSERT INTO modules (Name, Active) VALUES ('imaging_uploader', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instrument_builder', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instrument_list', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instrument_manager', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instruments', 'Y');
INSERT INTO modules (Name, Active) VALUES ('issue_tracker', 'Y');
INSERT INTO modules (Name, Active) VALUES ('login', 'Y');
INSERT INTO modules (Name, Active) VALUES ('media', 'Y');
INSERT INTO modules (Name, Active) VALUES ('module_manager', 'Y');
INSERT INTO modules (Name, Active) VALUES ('api_docs', 'Y');
INSERT INTO modules (Name, Active) VALUES ('mri_violations', 'Y');
INSERT INTO modules (Name, Active) VALUES ('my_preferences', 'Y');
INSERT INTO modules (Name, Active) VALUES ('new_profile', 'Y');
INSERT INTO modules (Name, Active) VALUES ('next_stage', 'Y');
INSERT INTO modules (Name, Active) VALUES ('publication', 'Y');
INSERT INTO modules (Name, Active) VALUES ('server_processes_manager', 'Y');
INSERT INTO modules (Name, Active) VALUES ('statistics', 'Y');
INSERT INTO modules (Name, Active) VALUES ('survey_accounts', 'Y');
INSERT INTO modules (Name, Active) VALUES ('timepoint_list', 'Y');
INSERT INTO modules (Name, Active) VALUES ('user_accounts', 'Y');
INSERT INTO modules (Name, Active) VALUES ('electrophysiology_browser', 'Y');
INSERT INTO modules (Name, Active) VALUES ('dqt', 'Y');
INSERT INTO modules (Name, Active) VALUES ('electrophysiology_uploader', 'Y');
INSERT INTO modules (Name, Active) VALUES ('dataquery', 'Y');
INSERT INTO modules (Name, Active) VALUES ('schedule_module', 'Y');

ALTER TABLE issues ADD CONSTRAINT `fk_issues_7` FOREIGN KEY (`module`) REFERENCES `modules` (`ID`);
