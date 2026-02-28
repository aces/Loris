CREATE TABLE `modules` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Active` enum('Y','N') NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `modules_id` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO modules (Name, Active) VALUES ('acknowledgements', 'N');
INSERT INTO modules (Name, Active) VALUES ('api', 'Y');
INSERT INTO modules (Name, Active) VALUES ('battery_manager', 'N');
INSERT INTO modules (Name, Active) VALUES ('behavioural_qc', 'N');
INSERT INTO modules (Name, Active) VALUES ('biobank', 'N');
INSERT INTO modules (Name, Active) VALUES ('brainbrowser', 'N');
INSERT INTO modules (Name, Active) VALUES ('bvl_feedback', 'N');
INSERT INTO modules (Name, Active) VALUES ('candidate_list', 'N');
INSERT INTO modules (Name, Active) VALUES ('candidate_parameters', 'N');
INSERT INTO modules (Name, Active) VALUES ('candidate_profile', 'N');
INSERT INTO modules (Name, Active) VALUES ('configuration', 'Y');
INSERT INTO modules (Name, Active) VALUES ('conflict_resolver', 'N');
INSERT INTO modules (Name, Active) VALUES ('create_timepoint', 'N');
INSERT INTO modules (Name, Active) VALUES ('dashboard', 'Y');
INSERT INTO modules (Name, Active) VALUES ('data_release', 'N');
INSERT INTO modules (Name, Active) VALUES ('datadict', 'N');
INSERT INTO modules (Name, Active) VALUES ('dicom_archive', 'N');
INSERT INTO modules (Name, Active) VALUES ('dictionary', 'N');
INSERT INTO modules (Name, Active) VALUES ('document_repository', 'N');
INSERT INTO modules (Name, Active) VALUES ('examiner', 'N');
INSERT INTO modules (Name, Active) VALUES ('genomic_browser', 'N');
INSERT INTO modules (Name, Active) VALUES ('help_editor', 'N');
INSERT INTO modules (Name, Active) VALUES ('imaging_browser', 'N');
INSERT INTO modules (Name, Active) VALUES ('imaging_qc', 'N');
INSERT INTO modules (Name, Active) VALUES ('imaging_uploader', 'N');
INSERT INTO modules (Name, Active) VALUES ('instrument_builder', 'N');
INSERT INTO modules (Name, Active) VALUES ('instrument_list', 'N');
INSERT INTO modules (Name, Active) VALUES ('instrument_manager', 'N');
INSERT INTO modules (Name, Active) VALUES ('instruments', 'N');
INSERT INTO modules (Name, Active) VALUES ('issue_tracker', 'N');
INSERT INTO modules (Name, Active) VALUES ('login', 'Y');
INSERT INTO modules (Name, Active) VALUES ('media', 'N');
INSERT INTO modules (Name, Active) VALUES ('module_manager', 'Y');
INSERT INTO modules (Name, Active) VALUES ('api_docs', 'N');
INSERT INTO modules (Name, Active) VALUES ('mri_violations', 'N');
INSERT INTO modules (Name, Active) VALUES ('my_preferences', 'N');
INSERT INTO modules (Name, Active) VALUES ('new_profile', 'N');
INSERT INTO modules (Name, Active) VALUES ('next_stage', 'N');
INSERT INTO modules (Name, Active) VALUES ('publication', 'N');
INSERT INTO modules (Name, Active) VALUES ('server_processes_manager', 'N');
INSERT INTO modules (Name, Active) VALUES ('statistics', 'N');
INSERT INTO modules (Name, Active) VALUES ('survey_accounts', 'N');
INSERT INTO modules (Name, Active) VALUES ('timepoint_list', 'N');
INSERT INTO modules (Name, Active) VALUES ('user_accounts', 'Y');
INSERT INTO modules (Name, Active) VALUES ('electrophysiology_browser', 'N');
INSERT INTO modules (Name, Active) VALUES ('dqt', 'N');
INSERT INTO modules (Name, Active) VALUES ('electrophysiology_uploader', 'N');
INSERT INTO modules (Name, Active) VALUES ('dataquery', 'N');
INSERT INTO modules (Name, Active) VALUES ('schedule_module', 'N');
INSERT INTO modules (Name, Active) VALUES ('redcap', 'N');
INSERT INTO modules (Name, Active) VALUES ('policy_tracker', 'N');

ALTER TABLE issues ADD CONSTRAINT `fk_issues_7` FOREIGN KEY (`module`) REFERENCES `modules` (`ID`);
