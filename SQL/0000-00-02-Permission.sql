--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `permID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `moduleID` int(11) unsigned,
  `action` enum (
      'View',
      'Create',
      'Edit',
      'Download',
      'Upload',
      'Delete',
      'View/Create',
      'View/Edit',
      'View/Download',
      'View/Upload',
      'View/Create/Edit',
      'Create/Edit',
      'Edit/Upload',
      'Edit/Upload/Delete'),
  PRIMARY KEY (`permID`),
  UNIQUE KEY `code` (`code`),
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


INSERT INTO `permissions` VALUES
    (1,'superuser','Superuser - supersedes all permissions',NULL,NULL),
    (2,'user_accounts','User Accounts - Own Sites',(SELECT ID FROM modules WHERE Name='user_accounts'),'View/Create/Edit'),
    (3,'user_accounts_multisite','User Accounts - All Sites',(SELECT ID FROM modules WHERE Name='user_accounts'),'View/Create/Edit'),
    (4,'context_help','Help documentation',(SELECT ID FROM modules WHERE Name='help_editor'),'Edit'),
    (5,'bvl_feedback','Feedback Threads',(SELECT ID FROM modules WHERE Name='bvl_feedback'),'Create/Edit'),
    (6,'imaging_browser_qc','Status',(SELECT ID FROM modules WHERE Name='imaging_browser'),'Edit'),
    (7,'send_to_dcc','Send to DCC',(SELECT ID FROM modules WHERE Name='instrument_list'),NULL),
    (8,'unsend_to_dcc','Reverse Send from DCC',(SELECT ID FROM modules WHERE Name='instrument_list'),NULL),
    (9,'access_all_profiles','Candidates and Timepoints - All Sites',(SELECT ID FROM modules WHERE Name='candidate_list'),'View'),
    (10,'data_entry','Candidates and Timepoints - Own Sites',(SELECT ID FROM modules WHERE Name='candidate_list'),'View/Create'),
    (11,'examiner_view','Add and Certify Examiners - Own Sites',(SELECT ID FROM modules WHERE Name='examiner'),NULL),
    (12,'examiner_multisite','Add and Certify Examiners - All Sites',(SELECT ID FROM modules WHERE Name='examiner'),NULL),
    (13,'conflict_resolver','Resolve Conflicts',(SELECT ID FROM modules WHERE Name='conflict_resolver'),NULL),
    (14,'data_dict_view','Parameter Type Descriptions',(SELECT ID FROM modules WHERE Name='datadict'),'View'),
    (15,'violated_scans_view_allsites','Violated Scans - All Sites',(SELECT ID FROM modules WHERE Name='mri_violations'),'View'),
    (16,'config','Settings',(SELECT ID FROM modules WHERE Name='configuration'),'View/Edit'),
    (17,'imaging_browser_view_site','Imaging Scans - Own Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),'View'),
    (18,'imaging_browser_view_allsites', 'Imaging Scans - All Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),'View'),
    (19,'dicom_archive_view_allsites', 'DICOMs - All Sites',(SELECT ID FROM modules WHERE Name='dicom_archive'),'View'),
    (20,'instrument_builder', 'Instrument Forms',(SELECT ID FROM modules WHERE Name='instrument_builder'),'Create/Edit'),
    (21,'data_dict_edit','Parameter Type Descriptions',(SELECT ID FROM modules WHERE Name='datadict'),'Edit'),
    (22,'candidate_parameter_view','Candidate Information',(SELECT ID FROM modules WHERE Name='candidate_parameters'),'View'),
    (23,'candidate_parameter_edit','Candidate Information',(SELECT ID FROM modules WHERE Name='candidate_parameters'),'Edit'),
    (24,'genomic_browser_view_site','Genomic Data - Own Sites',(SELECT ID FROM modules WHERE Name='genomic_browser'),'View'),
    (25,'genomic_browser_view_allsites','Genomic Data - All Sites',(SELECT ID FROM modules WHERE Name='genomic_browser'),'View'),
    (26,'document_repository_view','Documents',(SELECT ID FROM modules WHERE Name='document_repository'),'View'),
    (27,'document_repository_delete','Documents',(SELECT ID FROM modules WHERE Name='document_repository'),'Delete'),
    (28,'server_processes_manager','Processes',(SELECT ID FROM modules WHERE Name='server_processes_manager'),'View'),
    (29,'imaging_uploader','Imaging Scans',(SELECT ID FROM modules WHERE Name='imaging_uploader'),'View/Upload'),
    (30,'acknowledgements_view','Acknowledgee List',(SELECT ID FROM modules WHERE Name='acknowledgements'),'View'),
    (31,'acknowledgements_edit','Acknowledgee List',(SELECT ID FROM modules WHERE Name='acknowledgements'),'Edit'),
    (32,'dataquery_view','Cross-Modality Data',(SELECT ID FROM modules WHERE Name='dataquery'),'View/Download'),
    (33,'genomic_data_manager','Genomic Files',(SELECT ID FROM modules WHERE Name='genomic_browser'),'Upload'),
    (34,'media_write','Candidate Media Files',(SELECT ID FROM modules WHERE Name='media'),'Edit/Upload/Delete'),
    (35,'media_read','Candidate Media Files',(SELECT ID FROM modules WHERE Name='media'),'View/Download'),
    (36,'issue_tracker_reporter', 'Create/Edit Own Issues and Comment on All Issues',(SELECT ID FROM modules WHERE Name='issue_tracker'),NULL),
    (37,'issue_tracker_developer', 'Close/Edit/Re-assign/Comment on All Issues',(SELECT ID FROM modules WHERE Name='issue_tracker'),NULL),
    (38,'imaging_browser_phantom_allsites', 'Phantom Scans - All Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),'View'),
    (39,'imaging_browser_phantom_ownsite', 'Phantom Scans - Own Sites',(SELECT ID FROM modules WHERE Name='imaging_browser'),'View'),
    (40,'data_release_view', 'Release Files',(SELECT ID FROM modules WHERE Name='data_release'),'View'),
    (41,'data_release_upload', 'Release Files',(SELECT ID FROM modules WHERE Name='data_release'),'Upload'),
    (42,'data_release_edit_file_access', 'Grant Other Users Access to Releases',(SELECT ID FROM modules WHERE Name='data_release'),NULL),
    (43,'instrument_manager_read', 'Installed Instruments',(SELECT ID FROM modules WHERE Name='instrument_manager'),'View'),
    (44,'instrument_manager_write', 'Upload and Install Instruments',(SELECT ID FROM modules WHERE Name='instrument_manager'),NULL),
    (45,'publication_view', 'Publication Projects',(SELECT ID FROM modules WHERE Name='publication'),'View'),
    (46,'publication_propose', 'Propose Publication Projects',(SELECT ID FROM modules WHERE Name='publication'),NULL),
    (47,'publication_approve', 'Accept/Reject Publication Projects',(SELECT ID FROM modules WHERE Name='publication'),NULL),
    (48, 'candidate_dob_edit', 'Dates of Birth',(SELECT ID FROM modules WHERE Name='candidate_parameters'),'Edit'),
    (49,'electrophysiology_browser_view_allsites', 'EEGs - All Sites',(SELECT ID FROM modules WHERE Name='electrophysiology_browser'),'View'),
    (50,'electrophysiology_browser_view_site', 'EEGs - Own Sites',(SELECT ID FROM modules WHERE Name='electrophysiology_browser'),'View'),
    (51,'battery_manager_view','Battery Entries',(SELECT ID FROM modules WHERE Name='battery_manager'),'View'),
    (52,'battery_manager_edit','Battery Entries',(SELECT ID FROM modules WHERE Name='battery_manager'),'Create/Edit'),
    (53,'module_manager_view', 'Installed Modules',(SELECT ID FROM modules WHERE Name='module_manager'),'View'),
    (54,'module_manager_edit', 'Installed Modules',(SELECT ID FROM modules WHERE Name='module_manager'),'Edit'),
    (55,'candidate_dod_edit', 'Dates of Death',(SELECT ID FROM modules WHERE Name='candidate_parameters'),'Edit'),
    (56,'violated_scans_view_ownsite','Violated Scans - Own Sites',(SELECT ID FROM modules WHERE Name='mri_violations'),'View'),
    (57,'document_repository_edit','Documents',(SELECT ID FROM modules WHERE Name='document_repository'),'Edit/Upload'),
    (58,'survey_accounts_view', 'Candidate Surveys',(SELECT ID FROM modules WHERE Name='survey_accounts'),'View'),
    (59,'imaging_quality_control_view','Flagged Imaging Entries',(SELECT ID FROM modules WHERE Name='imaging_qc'),'View'),
    (60,'behavioural_quality_control_view','Flagged Behavioural Entries',(SELECT ID FROM modules WHERE Name='behavioural_qc'),'View'),
    (61,'api_docs','API documentation',(SELECT ID FROM modules WHERE Name='api_docs'),'View'),
    (62,'electrophysiology_browser_edit_annotations','Annotations',(SELECT ID FROM modules WHERE Name='electrophysiology_browser'), 'Create/Edit'),
    (63,'roles_view','Roles',(SELECT ID FROM modules WHERE Name='roles'), 'View'),
    (65,'roles_edit','Roles',(SELECT ID FROM modules WHERE Name='roles'), 'Edit/Upload/Delete'),
    (64,'roles_assign','Roles',(SELECT ID FROM modules WHERE Name='roles'), 'View');

INSERT INTO `user_perm_rel` (userID, permID)
  SELECT u.ID, p.permID
  FROM users u JOIN permissions p
  WHERE u.userid = 'admin'
  ORDER BY p.permID;

-- add role table
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `RoleID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Code` varchar(255) NOT NULL DEFAULT '',
  `Name` varchar(255) NOT NULL DEFAULT '',
  `Description` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`RoleID`),
  UNIQUE KEY `Code` (`Code`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

INSERT INTO `roles` VALUES
  (1,'blocked', 'Blocked', 'A blocked user has access to nothing.'),
  (2,'administrator', 'Administrator', 'An administrator has access to everything, no restrictions.');

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
