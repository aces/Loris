--
-- Table structure for table `permissions_category`
--

CREATE TABLE `permissions_category` (
  `ID` int(10) NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `permissions_category` VALUES
  (1,'Roles'),
  (2,'Permission');


CREATE TABLE `permissions_action` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL UNIQUE,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `permissions_action` VALUES
  (1, "View"),
  (2, "Create"),
  (3, "Edit"),
  (4, "Delete"),
  (5, "Comment"),
  (6, "Close"),
  (7, "Hide"),
  (8, "Download"),
  (9, "Upload");


CREATE TABLE `permissions` (
  `permID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `moduleID` int(11) unsigned,
  `categoryID` int(10) NOT NULL DEFAULT '2',
  PRIMARY KEY (`permID`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_permissions_1_idx` (`categoryID`),
  CONSTRAINT `fk_permissions_1`
  FOREIGN KEY (`categoryID`)
    REFERENCES `permissions_category` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_permissions_2`
  FOREIGN KEY (`moduleID`)
    REFERENCES `modules` (`ID`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `user_perm_rel` (
  `userID` int(10) unsigned NOT NULL default '0',
  `permID` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`userID`,`permID`),
  KEY `FK_user_perm_rel_2` (`permID`),
  CONSTRAINT `FK_user_perm_rel_2`
  FOREIGN KEY (`permID`)
    REFERENCES `permissions` (`permID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_user_perm_rel_1`
  FOREIGN KEY (`userID`)
    REFERENCES `users` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `perm_perm_action_rel` (
  `permID` int(10) unsigned NOT NULL default '0',
  `actionID` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`permID`,`actionID`),
  KEY `FK_perm_perm_action_rel_2` (`permID`),
  CONSTRAINT `FK_perm_perm_action_rel_2`
  FOREIGN KEY (`permID`)
    REFERENCES `permissions` (`permID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_perm_perm_action_rel_1`
  FOREIGN KEY (`actionID`)
    REFERENCES `permissions_action` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `permissions` (code, description, moduleID, categoryID) VALUES
    ('superuser','Superuser - supersedes all permissions',NULL,1),
    ('user_accounts','User Accounts - Own Sites',(SELECT ID FROM modules WHERE Name='user_accounts'),2),
    ('user_accounts_multisite','User Accounts - All Sites',(SELECT ID FROM modules WHERE Name='user_accounts'),2),
    ('context_help','Help documentation',(SELECT ID FROM modules WHERE Name='help_editor'),2),
    ('bvl_feedback','Feedback Threads',(SELECT ID FROM modules WHERE Name='bvl_feedback'),1),
    ('imaging_browser_qc','Status',(SELECT ID FROM modules WHERE Name='imaging_browser'),2),
    ('send_to_dcc','Send to DCC',(SELECT ID FROM modules WHERE Name='instrument_list'),2),
    ('unsend_to_dcc','Reverse Send from DCC',(SELECT ID FROM modules WHERE Name='instrument_list'),2),
    ('access_all_profiles','Candidates and Timepoints - All Sites',(SELECT ID FROM modules WHERE Name='candidate_list'),2),
    ('data_entry','Candidates and Timepoints - Own Sites',(SELECT ID FROM modules WHERE Name='candidate_list'),1),
    ('examiner_view','Add and Certify Examiners - Own Sites',(SELECT ID FROM modules WHERE Name='examiner'),2),
    ('examiner_multisite','Add and Certify Examiners - All Sites',(SELECT ID FROM modules WHERE Name='examiner'),2),
    ('conflict_resolver','Resolve Conflicts',(SELECT ID FROM modules WHERE Name='conflict_resolver'),2),
    ('data_dict_view','Parameter Type Descriptions',(SELECT ID FROM modules WHERE Name='datadict'),2),
    ('violated_scans_view_allsites','Violated Scans - All Sites',(SELECT ID FROM modules WHERE Name='mri_violations'),2),
    ('config','Settings',(SELECT ID FROM modules WHERE Name='configuration'),2),
    ('imaging_browser_view_site','Imaging Scans - Own Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),2),
    ('imaging_browser_view_allsites', 'Imaging Scans - All Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),2),
    ('dicom_archive_view_allsites', 'DICOMs - All Sites',(SELECT ID FROM modules WHERE Name='dicom_archive'),2),
    ('instrument_builder', 'Instrument Forms',(SELECT ID FROM modules WHERE Name='instrument_builder'),2),
    ('data_dict_edit','Parameter Type Descriptions',(SELECT ID FROM modules WHERE Name='datadict'),2),
    ('candidate_parameter_view','Candidate Information',(SELECT ID FROM modules WHERE Name='candidate_parameters'),2),
    ('candidate_parameter_edit','Candidate Information',(SELECT ID FROM modules WHERE Name='candidate_parameters'),2),
    ('genomic_browser_view_site','Genomic Data - Own Sites',(SELECT ID FROM modules WHERE Name='genomic_browser'),2),
    ('genomic_browser_view_allsites','Genomic Data - All Sites',(SELECT ID FROM modules WHERE Name='genomic_browser'),2),
    ('document_repository_view','Documents',(SELECT ID FROM modules WHERE Name='document_repository'),2),
    ('document_repository_delete','Documents',(SELECT ID FROM modules WHERE Name='document_repository'),2),
    ('server_processes_manager','Processes',(SELECT ID FROM modules WHERE Name='server_processes_manager'),2),
    ('imaging_uploader_allsites','Imaging Scans - All Sites',(SELECT ID FROM modules WHERE Name='imaging_uploader'),2),
    ('acknowledgements_view','Acknowledgee List',(SELECT ID FROM modules WHERE Name='acknowledgements'),2),
    ('acknowledgements_edit','Acknowledgee List',(SELECT ID FROM modules WHERE Name='acknowledgements'),2),
    ('dqt_view','Cross-Modality Data (legacy)',(SELECT ID FROM modules WHERE Name='dqt'),2),
    ('genomic_data_manager','Genomic Files',(SELECT ID FROM modules WHERE Name='genomic_browser'),2),
    ('media_write','Candidate Media Files',(SELECT ID FROM modules WHERE Name='media'),2),
    ('media_read','Candidate Media Files',(SELECT ID FROM modules WHERE Name='media'),2),
    ('issue_tracker_own_issue', 'Issues - Own',(SELECT ID FROM modules WHERE Name='issue_tracker'),2),
    ('issue_tracker_all_issue', 'Issues - All Sites',(SELECT ID FROM modules WHERE Name='issue_tracker'),2),
    ('imaging_browser_phantom_allsites', 'Phantom Scans - All Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),2),
    ('imaging_browser_phantom_ownsite', 'Phantom Scans - Own Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),2),
    ('data_release_view', 'Release Files',(SELECT ID FROM modules WHERE Name='data_release'),2),
    ('data_release_upload', 'Release Files',(SELECT ID FROM modules WHERE Name='data_release'),2),
    ('data_release_edit_file_access', 'Grant Other Users Access to Releases',(SELECT ID FROM modules WHERE Name='data_release'),2),
    ('instrument_manager_read', 'Installed Instruments',(SELECT ID FROM modules WHERE Name='instrument_manager'),2),
    ('instrument_manager_write', 'Upload and Install Instruments',(SELECT ID FROM modules WHERE Name='instrument_manager'),2),
    ('publication_view', 'Publication Projects',(SELECT ID FROM modules WHERE Name='publication'),2),
    ('publication_propose', 'Propose Publication Projects',(SELECT ID FROM modules WHERE Name='publication'),2),
    ('publication_approve', 'Accept/Reject Publication Projects',(SELECT ID FROM modules WHERE Name='publication'),2),
    ('candidate_dob_edit', 'Dates of Birth',(SELECT ID FROM modules WHERE Name='candidate_parameters'),2),
    ('electrophysiology_browser_view_allsites', 'EEGs - All Sites',(SELECT ID FROM modules WHERE Name='electrophysiology_browser'),2),
    ('electrophysiology_browser_view_site', 'EEGs - Own Sites',(SELECT ID FROM modules WHERE Name='electrophysiology_browser'),2),
    ('battery_manager_view','Battery Entries',(SELECT ID FROM modules WHERE Name='battery_manager'),2),
    ('battery_manager_edit','Battery Entries',(SELECT ID FROM modules WHERE Name='battery_manager'),2),
    ('module_manager_view', 'Installed Modules',(SELECT ID FROM modules WHERE Name='module_manager'),2),
    ('module_manager_edit', 'Installed Modules',(SELECT ID FROM modules WHERE Name='module_manager'),2),
    ('candidate_dod_edit', 'Dates of Death',(SELECT ID FROM modules WHERE Name='candidate_parameters'),2),
    ('violated_scans_view_ownsite','Violated Scans - Own Sites',(SELECT ID FROM modules WHERE Name='mri_violations'),2),
    ('document_repository_upload_edit','Documents',(SELECT ID FROM modules WHERE Name='document_repository'),2),
    ('survey_accounts_view', 'Candidate Surveys',(SELECT ID FROM modules WHERE Name='survey_accounts'),2),
    ('imaging_quality_control_view','Flagged Imaging Entries',(SELECT ID FROM modules WHERE Name='imaging_qc'),2),
    ('behavioural_quality_control_view','Flagged Behavioural Entries',(SELECT ID FROM modules WHERE Name='behavioural_qc'),2),
    ('api_docs','API documentation',(SELECT ID FROM modules WHERE Name='api_docs'),2),
    ('electrophysiology_browser_edit_annotations','Annotations',(SELECT ID FROM modules WHERE Name='electrophysiology_browser'),2),
    ('monitor_eeg_uploads','Monitor EEG uploads',(SELECT ID FROM modules WHERE Name='electrophysiology_uploader'),2),
    ('dataquery_admin','Admin dataquery queries',(SELECT ID FROM modules WHERE Name='dataquery'),2),
    ('schedule_module','Schedule Module - edit and delete the appointment',(SELECT ID FROM modules WHERE Name='schedule_module'),2),
    ('document_repository_categories','Categories',(SELECT ID FROM modules WHERE Name='document_repository'),2),
    ('document_repository_hidden','Restricted files',(SELECT ID FROM modules WHERE Name='document_repository'),2),
    ('issue_tracker_site_issue','Issues - Own Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),2),
    ('issue_tracker_close_site_issue','Issues - Own Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),2),
    ('issue_tracker_close_all_issue','Issues - All Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),2),
    ('imaging_uploader_ownsites', 'Imaging Scans - Own Sites', (SELECT ID FROM modules WHERE Name='imaging_uploader'),2),
    ('imaging_uploader_nosessionid', 'Imaging Scans with no session ID', (SELECT ID FROM modules WHERE Name='imaging_uploader'),2),
    ('dicom_archive_nosessionid', 'DICOMs with no session ID', (SELECT ID FROM modules WHERE Name='dicom_archive'),2),
    ('dicom_archive_view_ownsites', 'DICOMs - Own Sites', (SELECT ID FROM modules WHERE Name='dicom_archive'),2),
    ('view_instrument_data', 'Data', (SELECT ID FROM modules WHERE Name = 'instruments'),2),
    ('redcap_ui_view','REDCap GUI - View',(SELECT ID FROM modules WHERE Name ='redcap'),2),
    ('biobank_specimen_view','View Specimen Data',(SELECT ID FROM modules WHERE Name='biobank'), '2'),
    ('biobank_specimen_create','Create Specimens',(SELECT ID FROM modules WHERE Name='biobank'), '2'),
    ('biobank_specimen_update','Process Specimens',(SELECT ID FROM modules WHERE Name='biobank'), '2'),
    ('biobank_specimen_alter','Edit Specimen Data',(SELECT ID FROM modules WHERE Name='biobank'), '2'),
    ('biobank_container_view','View Container Data',(SELECT ID FROM modules WHERE Name='biobank'), '2'),
    ('biobank_container_create','Create Containers',(SELECT ID FROM modules WHERE Name='biobank'), '2'),
    ('biobank_container_update','Edit Container Data',(SELECT ID FROM modules WHERE Name='biobank'), '2'),
    ('biobank_pool_view','View Pool Data',(SELECT ID FROM modules WHERE Name='biobank'), '2'),
    ('biobank_pool_create','Create Pools',(SELECT ID FROM modules WHERE Name='biobank'), '2'),
    ('biobank_fullsiteaccess','Full Site Access',(SELECT ID FROM modules WHERE Name='biobank'), '2'),
    ('biobank_fullprojectaccess','Full Project Access',(SELECT ID FROM modules WHERE Name='biobank'), '2'),
    ('dataquery_view','Cross-Modality Data',(SELECT ID FROM modules WHERE Name='dataquery'),2);

INSERT INTO `user_perm_rel` (userID, permID)
  SELECT u.ID, p.permID
  FROM users u JOIN permissions p
  WHERE u.userid = 'admin'
  ORDER BY p.permID;


INSERT INTO `perm_perm_action_rel` (permID, actionID) VALUES
  ((SELECT permID FROM permissions WHERE code = 'user_accounts'),1),
  ((SELECT permID FROM permissions WHERE code = 'user_accounts'),2),
  ((SELECT permID FROM permissions WHERE code = 'user_accounts'),3),
  ((SELECT permID FROM permissions WHERE code = 'user_accounts_multisite'),1),
  ((SELECT permID FROM permissions WHERE code = 'user_accounts_multisite'),2),
  ((SELECT permID FROM permissions WHERE code = 'user_accounts_multisite'),3),
  ((SELECT permID FROM permissions WHERE code = 'context_help'),3),
  ((SELECT permID FROM permissions WHERE code = 'bvl_feedback'),2),
  ((SELECT permID FROM permissions WHERE code = 'bvl_feedback'),3),
  ((SELECT permID FROM permissions WHERE code = 'imaging_browser_qc'),3),
  ((SELECT permID FROM permissions WHERE code = 'access_all_profiles'),1),
  ((SELECT permID FROM permissions WHERE code = 'data_entry'),1),
  ((SELECT permID FROM permissions WHERE code = 'data_entry'),2),
  ((SELECT permID FROM permissions WHERE code = 'data_dict_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'violated_scans_view_allsites'),1),
  ((SELECT permID FROM permissions WHERE code = 'config'),1),
  ((SELECT permID FROM permissions WHERE code = 'config'),3),
  ((SELECT permID FROM permissions WHERE code = 'imaging_browser_view_site'),1),
  ((SELECT permID FROM permissions WHERE code = 'imaging_browser_view_allsites'),1),
  ((SELECT permID FROM permissions WHERE code = 'dicom_archive_view_allsites'),1),
  ((SELECT permID FROM permissions WHERE code = 'instrument_builder'),2),
  ((SELECT permID FROM permissions WHERE code = 'instrument_builder'),3),
  ((SELECT permID FROM permissions WHERE code = 'data_dict_edit'),3),
  ((SELECT permID FROM permissions WHERE code = 'candidate_parameter_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'candidate_parameter_edit'),3),
  ((SELECT permID FROM permissions WHERE code = 'genomic_browser_view_site'),1),
  ((SELECT permID FROM permissions WHERE code = 'genomic_browser_view_allsites'),1),
  ((SELECT permID FROM permissions WHERE code = 'document_repository_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'document_repository_delete'),4),
  ((SELECT permID FROM permissions WHERE code = 'server_processes_manager'),1),
  ((SELECT permID FROM permissions WHERE code = 'imaging_uploader_allsites'),1),
  ((SELECT permID FROM permissions WHERE code = 'imaging_uploader_allsites'),9),
  ((SELECT permID FROM permissions WHERE code = 'acknowledgements_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'acknowledgements_edit'),3),
  ((SELECT permID FROM permissions WHERE code = 'dataquery_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'dataquery_view'),8),
  ((SELECT permID FROM permissions WHERE code = 'genomic_data_manager'),9),
  ((SELECT permID FROM permissions WHERE code = 'media_write'),3),
  ((SELECT permID FROM permissions WHERE code = 'media_write'),7),
  ((SELECT permID FROM permissions WHERE code = 'media_write'),9),
  ((SELECT permID FROM permissions WHERE code = 'media_read'),1),
  ((SELECT permID FROM permissions WHERE code = 'media_read'),8),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_own_issue'),1),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_own_issue'),3),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_own_issue'),5),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_own_issue'),6),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_all_issue'),1),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_all_issue'),3),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_all_issue'),5),
  ((SELECT permID FROM permissions WHERE code = 'imaging_browser_phantom_allsites'),1),
  ((SELECT permID FROM permissions WHERE code = 'imaging_browser_phantom_ownsite'),1),
  ((SELECT permID FROM permissions WHERE code = 'data_release_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'data_release_upload'),9),
  ((SELECT permID FROM permissions WHERE code = 'instrument_manager_read'),1),
  ((SELECT permID FROM permissions WHERE code = 'publication_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'candidate_dob_edit'),3),
  ((SELECT permID FROM permissions WHERE code = 'electrophysiology_browser_view_allsites'),1),
  ((SELECT permID FROM permissions WHERE code = 'electrophysiology_browser_view_site'),1),
  ((SELECT permID FROM permissions WHERE code = 'battery_manager_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'battery_manager_edit'),2),
  ((SELECT permID FROM permissions WHERE code = 'battery_manager_edit'),3),
  ((SELECT permID FROM permissions WHERE code = 'module_manager_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'module_manager_edit'),3),
  ((SELECT permID FROM permissions WHERE code = 'candidate_dod_edit'),3),
  ((SELECT permID FROM permissions WHERE code = 'violated_scans_view_ownsite'),1),
  ((SELECT permID FROM permissions WHERE code = 'document_repository_upload_edit'),3),
  ((SELECT permID FROM permissions WHERE code = 'document_repository_upload_edit'),9),
  ((SELECT permID FROM permissions WHERE code = 'survey_accounts_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'imaging_quality_control_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'behavioural_quality_control_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'api_docs'),1),
  ((SELECT permID FROM permissions WHERE code = 'electrophysiology_browser_edit_annotations'),2),
  ((SELECT permID FROM permissions WHERE code = 'electrophysiology_browser_edit_annotations'),3),
  ((SELECT permID FROM permissions WHERE code = 'schedule_module'),1),
  ((SELECT permID FROM permissions WHERE code = 'schedule_module'),2),
  ((SELECT permID FROM permissions WHERE code = 'schedule_module'),3),
  ((SELECT permID FROM permissions WHERE code = 'document_repository_categories'),3),
  ((SELECT permID FROM permissions WHERE code = 'document_repository_categories'),4),
  ((SELECT permID FROM permissions WHERE code = 'document_repository_categories'),9),
  ((SELECT permID FROM permissions WHERE code = 'document_repository_hidden'),1),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_site_issue'),1),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_site_issue'),3),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_site_issue'),5),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_close_site_issue'),6),
  ((SELECT permID FROM permissions WHERE code = 'issue_tracker_close_all_issue'),6),
  ((SELECT permID FROM permissions WHERE code = 'imaging_uploader_ownsites'),1),
  ((SELECT permID FROM permissions WHERE code = 'imaging_uploader_nosessionid'),1),
  ((SELECT permID FROM permissions WHERE code = 'dicom_archive_nosessionid'),1),
  ((SELECT permID FROM permissions WHERE code = 'dicom_archive_view_ownsites'),1),
<<<<<<< HEAD
  ((SELECT permID FROM permissions WHERE code = 'view_instrument_data'),1),
  ((SELECT permID FROM permissions WHERE code = 'redcap_ui_view'),1)
  ;
=======
  ((SELECT permID FROM permissions WHERE code = 'biobank_specimen_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'biobank_specimen_create'),2),
  ((SELECT permID FROM permissions WHERE code = 'biobank_specimen_update'),3),
  ((SELECT permID FROM permissions WHERE code = 'biobank_specimen_alter'),3),
  ((SELECT permID FROM permissions WHERE code = 'biobank_container_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'biobank_container_create'),2),
  ((SELECT permID FROM permissions WHERE code = 'biobank_container_update'),3),
  ((SELECT permID FROM permissions WHERE code = 'biobank_pool_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'biobank_pool_create'),2),
  ((SELECT permID FROM permissions WHERE code = 'biobank_fullsiteaccess'),1),
  ((SELECT permID FROM permissions WHERE code = 'biobank_fullprojectaccess'),1),
  ((SELECT permID FROM permissions WHERE code = 'view_instrument_data'),1),
  ((SELECT permID FROM permissions WHERE code = 'dqt_view'),1),
  ((SELECT permID FROM permissions WHERE code = 'dqt_view'),8);
>>>>>>> main


-- permissions for each notification module
DROP TABLE IF EXISTS `notification_modules_perm_rel`;
CREATE TABLE `notification_modules_perm_rel` (
      `notification_module_id` int(10) unsigned NOT NULL,
      `perm_id` int(10) unsigned NOT NULL default '0',
      CONSTRAINT `FK_notification_modules_perm_rel_1` FOREIGN KEY (`notification_module_id`) REFERENCES `notification_modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT `FK_notification_modules_perm_rel_2` FOREIGN KEY (`perm_id`) REFERENCES `permissions` (`permID`) ON DELETE CASCADE ON UPDATE CASCADE,
      PRIMARY KEY (`notification_module_id`,`perm_id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- populate notification perm table
INSERT INTO notification_modules_perm_rel SELECT nm.id, p.permID FROM notification_modules nm JOIN permissions p WHERE nm.module_name='media' AND (p.code='media_write' OR p.code='media_read');
INSERT INTO notification_modules_perm_rel SELECT nm.id, p.permID FROM notification_modules nm JOIN permissions p WHERE nm.module_name='document_repository' AND (p.code='document_repository_view' OR p.code='document_repository_delete');
INSERT INTO notification_modules_perm_rel SELECT nm.id, p.permID FROM notification_modules nm JOIN permissions p WHERE nm.module_name='publication' AND (p.code='publication_view' OR p.code='publication_propose' OR p.code='publication_approve');

CREATE TABLE `testnames_permissions_rel` (
    `TestID` int(10) unsigned NOT NULL,
    `permID` int(10) unsigned NOT NULL,
    PRIMARY KEY  (`TestID`,`permID`),
    CONSTRAINT `FK_testnames_permissions_rel_test` FOREIGN KEY (`TestID`) REFERENCES `test_names` (`ID`),
    CONSTRAINT `FK_testnames_permissions_rel_perm` FOREIGN KEY (`permID`) REFERENCES `permissions` (`permID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
