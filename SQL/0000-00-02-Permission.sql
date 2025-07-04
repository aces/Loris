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


CREATE TABLE `permissions` (
  `permID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `moduleID` int(11) unsigned,
  `action` enum (
      'Close',
      'Create',
      'Create/Edit',
      'Delete',
      'Download',
      'Edit',
      'Edit/Upload',
      'Edit/Upload/Delete',
      'Edit/Upload/Hide',
      'Upload',
      'View', 
      'View/Create',
      'View/Create/Edit',
      'View/Download',
      'View/Edit',
      'View/Edit/Comment',
      'View/Edit/Comment/Close',
      'View/Upload'),
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


INSERT INTO `permissions` (code, description, moduleID, action, categoryID) VALUES
    ('superuser','Superuser - supersedes all permissions',NULL,NULL,1),
    ('user_accounts','User Accounts - Own Sites',(SELECT ID FROM modules WHERE Name='user_accounts'),'View/Create/Edit',2),
    ('user_accounts_multisite','User Accounts - All Sites',(SELECT ID FROM modules WHERE Name='user_accounts'),'View/Create/Edit',2),
    ('context_help','Help documentation',(SELECT ID FROM modules WHERE Name='help_editor'),'Edit',2),
    ('bvl_feedback','Feedback Threads',(SELECT ID FROM modules WHERE Name='bvl_feedback'),'Create/Edit',1),
    ('imaging_browser_qc','Status',(SELECT ID FROM modules WHERE Name='imaging_browser'),'Edit',2),
    ('send_to_dcc','Send to DCC',(SELECT ID FROM modules WHERE Name='instrument_list'),NULL,2),
    ('unsend_to_dcc','Reverse Send from DCC',(SELECT ID FROM modules WHERE Name='instrument_list'),NULL,2),
    ('access_all_profiles','Candidates and Timepoints - All Sites',(SELECT ID FROM modules WHERE Name='candidate_list'),'View',2),
    ('data_entry','Candidates and Timepoints - Own Sites',(SELECT ID FROM modules WHERE Name='candidate_list'),'View/Create',1),
    ('examiner_view','Add and Certify Examiners - Own Sites',(SELECT ID FROM modules WHERE Name='examiner'),NULL,2),
    ('examiner_multisite','Add and Certify Examiners - All Sites',(SELECT ID FROM modules WHERE Name='examiner'),NULL,2),
    ('conflict_resolver','Resolve Conflicts',(SELECT ID FROM modules WHERE Name='conflict_resolver'),NULL,2),
    ('data_dict_view','Parameter Type Descriptions',(SELECT ID FROM modules WHERE Name='datadict'),'View',2),
    ('violated_scans_view_allsites','Violated Scans - All Sites',(SELECT ID FROM modules WHERE Name='mri_violations'),'View',2),
    ('config','Settings',(SELECT ID FROM modules WHERE Name='configuration'),'View/Edit',2),
    ('imaging_browser_view_site','Imaging Scans - Own Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),'View',2),
    ('imaging_browser_view_allsites', 'Imaging Scans - All Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),'View', 2),
    ('dicom_archive_view_allsites', 'DICOMs - All Sites',(SELECT ID FROM modules WHERE Name='dicom_archive'),'View', 2),
    ('instrument_builder', 'Instrument Forms',(SELECT ID FROM modules WHERE Name='instrument_builder'),'Create/Edit', 2),
    ('data_dict_edit','Parameter Type Descriptions',(SELECT ID FROM modules WHERE Name='datadict'),'Edit',2),
    ('candidate_parameter_view','Candidate Information',(SELECT ID FROM modules WHERE Name='candidate_parameters'),'View',2),
    ('candidate_parameter_edit','Candidate Information',(SELECT ID FROM modules WHERE Name='candidate_parameters'),'Edit',2),
    ('genomic_browser_view_site','Genomic Data - Own Sites',(SELECT ID FROM modules WHERE Name='genomic_browser'),'View',2),
    ('genomic_browser_view_allsites','Genomic Data - All Sites',(SELECT ID FROM modules WHERE Name='genomic_browser'),'View',2),
    ('document_repository_view','Documents',(SELECT ID FROM modules WHERE Name='document_repository'),'View',2),
    ('document_repository_delete','Documents',(SELECT ID FROM modules WHERE Name='document_repository'),'Delete',2),
    ('server_processes_manager','Processes',(SELECT ID FROM modules WHERE Name='server_processes_manager'),'View',2),
    ('imaging_uploader_allsites','Imaging Scans - All Sites',(SELECT ID FROM modules WHERE Name='imaging_uploader'),'View/Upload',2),
    ('acknowledgements_view','Acknowledgee List',(SELECT ID FROM modules WHERE Name='acknowledgements'),'View',2),
    ('acknowledgements_edit','Acknowledgee List',(SELECT ID FROM modules WHERE Name='acknowledgements'),'Edit',2),
    ('dataquery_view','Cross-Modality Data',(SELECT ID FROM modules WHERE Name='dataquery'),'View/Download',2),
    ('genomic_data_manager','Genomic Files',(SELECT ID FROM modules WHERE Name='genomic_browser'),'Upload',2),
    ('media_write','Candidate Media Files',(SELECT ID FROM modules WHERE Name='media'),'Edit/Upload/Hide',2),
    ('media_read','Candidate Media Files',(SELECT ID FROM modules WHERE Name='media'),'View/Download',2),
    ('issue_tracker_own_issue', 'Issues - Own',(SELECT ID FROM modules WHERE Name='issue_tracker'),'View/Edit/Comment/Close', 2),
    ('issue_tracker_all_issue', 'Issues - All Sites',(SELECT ID FROM modules WHERE Name='issue_tracker'),'View/Edit/Comment', 2),
    ('imaging_browser_phantom_allsites', 'Phantom Scans - All Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),'View', 2),
    ('imaging_browser_phantom_ownsite', 'Phantom Scans - Own Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),'View', 2),
    ('data_release_view', 'Release Files',(SELECT ID FROM modules WHERE Name='data_release'),'View', 2),
    ('data_release_upload', 'Release Files',(SELECT ID FROM modules WHERE Name='data_release'),'Upload', 2),
    ('data_release_edit_file_access', 'Grant Other Users Access to Releases',(SELECT ID FROM modules WHERE Name='data_release'),NULL, 2),
    ('instrument_manager_read', 'Installed Instruments',(SELECT ID FROM modules WHERE Name='instrument_manager'),'View', 2),
    ('instrument_manager_write', 'Upload and Install Instruments',(SELECT ID FROM modules WHERE Name='instrument_manager'),NULL, 2),
    ('publication_view', 'Publication Projects',(SELECT ID FROM modules WHERE Name='publication'),'View', 2),
    ('publication_propose', 'Propose Publication Projects',(SELECT ID FROM modules WHERE Name='publication'),NULL, 2),
    ('publication_approve', 'Accept/Reject Publication Projects',(SELECT ID FROM modules WHERE Name='publication'),NULL, 2),
    ('candidate_dob_edit', 'Dates of Birth',(SELECT ID FROM modules WHERE Name='candidate_parameters'),'Edit', 2),
    ('electrophysiology_browser_view_allsites', 'EEGs - All Sites',(SELECT ID FROM modules WHERE Name='electrophysiology_browser'),'View', 2),
    ('electrophysiology_browser_view_site', 'EEGs - Own Sites',(SELECT ID FROM modules WHERE Name='electrophysiology_browser'),'View', 2),
    ('battery_manager_view','Battery Entries',(SELECT ID FROM modules WHERE Name='battery_manager'),'View',2),
    ('battery_manager_edit','Battery Entries',(SELECT ID FROM modules WHERE Name='battery_manager'),'Create/Edit',2),
    ('module_manager_view', 'Installed Modules',(SELECT ID FROM modules WHERE Name='module_manager'),'View', 2),
    ('module_manager_edit', 'Installed Modules',(SELECT ID FROM modules WHERE Name='module_manager'),'Edit', 2),
    ('candidate_dod_edit', 'Dates of Death',(SELECT ID FROM modules WHERE Name='candidate_parameters'),'Edit', 2),
    ('violated_scans_view_ownsite','Violated Scans - Own Sites',(SELECT ID FROM modules WHERE Name='mri_violations'),'View',2),
    ('document_repository_upload_edit','Documents',(SELECT ID FROM modules WHERE Name='document_repository'),'Edit/Upload',2),
    ('survey_accounts_view', 'Candidate Surveys',(SELECT ID FROM modules WHERE Name='survey_accounts'),'View', 2),
    ('imaging_quality_control_view','Flagged Imaging Entries',(SELECT ID FROM modules WHERE Name='imaging_qc'),'View',2),
    ('behavioural_quality_control_view','Flagged Behavioural Entries',(SELECT ID FROM modules WHERE Name='behavioural_qc'),'View',2),
    ('api_docs','API documentation',(SELECT ID FROM modules WHERE Name='api_docs'),'View',2),
    ('electrophysiology_browser_edit_annotations','Annotations',(SELECT ID FROM modules WHERE Name='electrophysiology_browser'), 'Create/Edit', 2),
    ('monitor_eeg_uploads','Monitor EEG uploads',(SELECT ID FROM modules WHERE Name='electrophysiology_uploader'),NULL,2),
    ('dataquery_admin','Admin dataquery queries',(SELECT ID FROM modules WHERE Name='dataquery'),NULL,2),
    ('schedule_module','Schedule Module - edit and delete the appointment',(SELECT ID FROM modules WHERE Name='schedule_module'),'View/Create/Edit',2),
    ('document_repository_categories','Categories',(SELECT ID FROM modules WHERE Name='document_repository'), 'Edit/Upload/Delete', 2),
    ('document_repository_hidden','Restricted files',(SELECT ID FROM modules WHERE Name='document_repository'), 'View', 2),
    ('issue_tracker_site_issue','Issues - Own Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),'View/Edit/Comment',2),
    ('issue_tracker_close_site_issue','Issues - Own Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),'Close',2),
    ('issue_tracker_close_all_issue','Issues - All Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),'Close',2),
    ('imaging_uploader_ownsites', 'Imaging Scans - Own Sites', (SELECT ID FROM modules WHERE Name='imaging_uploader'), 'View', '2'),
    ('imaging_uploader_nosessionid', 'Imaging Scans with no session ID', (SELECT ID FROM modules WHERE Name='imaging_uploader'), 'View', '2'),
    ('dicom_archive_nosessionid', 'DICOMs with no session ID', (SELECT ID FROM modules WHERE Name='dicom_archive'), 'View', '2'),
    ('dicom_archive_view_ownsites', 'DICOMs - Own Sites', (SELECT ID FROM modules WHERE Name='dicom_archive'), 'View', '2'),
    ('view_instrument_data', 'Data', (SELECT ID FROM modules WHERE Name = 'instruments'), 'View', '2')
    ;

INSERT INTO `user_perm_rel` (userID, permID)
  SELECT u.ID, p.permID
  FROM users u JOIN permissions p
  WHERE u.userid = 'admin'
  ORDER BY p.permID;

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
