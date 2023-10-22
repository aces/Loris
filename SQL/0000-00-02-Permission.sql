--
CREATE TABLE `permissions` (
  `permID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `moduleID` int(11) unsigned,
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
    (1,'superuser','Superuser - supersedes all permissions',NULL),
    (2,'user_accounts','User Accounts - Own Sites',(SELECT ID FROM modules WHERE Name='user_accounts')),
    (3,'user_accounts_multisite','User Accounts - All Sites',(SELECT ID FROM modules WHERE Name='user_accounts')),
    (4,'context_help','Help documentation',(SELECT ID FROM modules WHERE Name='help_editor')),
    (5,'bvl_feedback','Feedback Threads',(SELECT ID FROM modules WHERE Name='bvl_feedback')),
    (6,'imaging_browser_qc','Status',(SELECT ID FROM modules WHERE Name='imaging_browser')),
    (7,'send_to_dcc','Send to DCC',(SELECT ID FROM modules WHERE Name='instrument_list')),
    (8,'unsend_to_dcc','Reverse Send from DCC',(SELECT ID FROM modules WHERE Name='instrument_list')),
    (9,'access_all_profiles','Candidates and Timepoints - All Sites',(SELECT ID FROM modules WHERE Name='candidate_list')),
    (10,'data_entry','Candidates and Timepoints - Own Sites',(SELECT ID FROM modules WHERE Name='candidate_list')),
    (11,'examiner_view','Add and Certify Examiners - Own Sites',(SELECT ID FROM modules WHERE Name='examiner')),
    (12,'examiner_multisite','Add and Certify Examiners - All Sites',(SELECT ID FROM modules WHERE Name='examiner')),
    (13,'conflict_resolver','Resolve Conflicts',(SELECT ID FROM modules WHERE Name='conflict_resolver')),
    (14,'data_dict_view','Parameter Type Descriptions',(SELECT ID FROM modules WHERE Name='datadict')),
    (15,'violated_scans_view_allsites','Violated Scans - All Sites',(SELECT ID FROM modules WHERE Name='mri_violations')),
    (16,'config','Settings',(SELECT ID FROM modules WHERE Name='configuration')),
    (17,'imaging_browser_view_site','Imaging Scans - Own Sites',(SELECT ID FROM modules WHERE Name='imaging_browser')),
    (18,'imaging_browser_view_allsites', 'Imaging Scans - All Sites',(SELECT ID FROM modules WHERE Name='imaging_browser')),
    (19,'dicom_archive_view_allsites', 'DICOMs - All Sites',(SELECT ID FROM modules WHERE Name='dicom_archive')),
    (20,'instrument_builder', 'Instrument Forms',(SELECT ID FROM modules WHERE Name='instrument_builder')),
    (21,'data_dict_edit','Parameter Type Descriptions',(SELECT ID FROM modules WHERE Name='datadict')),
    (22,'candidate_parameter_view','Candidate Information',(SELECT ID FROM modules WHERE Name='candidate_parameters')),
    (23,'candidate_parameter_edit','Candidate Information',(SELECT ID FROM modules WHERE Name='candidate_parameters')),
    (24,'genomic_browser_view_site','Genomic Data - Own Sites',(SELECT ID FROM modules WHERE Name='genomic_browser')),
    (25,'genomic_browser_view_allsites','Genomic Data - All Sites',(SELECT ID FROM modules WHERE Name='genomic_browser')),
    (26,'document_repository_view','Documents',(SELECT ID FROM modules WHERE Name='document_repository')),
    (27,'document_repository_delete','Documents',(SELECT ID FROM modules WHERE Name='document_repository')),
    (28,'server_processes_manager','Processes',(SELECT ID FROM modules WHERE Name='server_processes_manager')),
    (29,'imaging_uploader','Imaging Scans',(SELECT ID FROM modules WHERE Name='imaging_uploader')),
    (30,'acknowledgements_view','Acknowledgee List',(SELECT ID FROM modules WHERE Name='acknowledgements')),
    (31,'acknowledgements_edit','Acknowledgee List',(SELECT ID FROM modules WHERE Name='acknowledgements')),
    (32,'dataquery_view','Cross-Modality Data',(SELECT ID FROM modules WHERE Name='dataquery')),
    (33,'genomic_data_manager','Genomic Files',(SELECT ID FROM modules WHERE Name='genomic_browser')),
    (34,'media_write','Candidate Media Files',(SELECT ID FROM modules WHERE Name='media')),
    (35,'media_read','Candidate Media Files',(SELECT ID FROM modules WHERE Name='media')),
    (36,'issue_tracker_reporter', 'Create/Edit Own Issues and Comment on All Issues',(SELECT ID FROM modules WHERE Name='issue_tracker')),
    (37,'issue_tracker_developer', 'Close/Edit/Re-assign/Comment on All Issues',(SELECT ID FROM modules WHERE Name='issue_tracker')),
    (38,'imaging_browser_phantom_allsites', 'Phantom Scans - All Sites',(SELECT ID FROM modules WHERE Name='imaging_browser')),
    (39,'imaging_browser_phantom_ownsite', 'Phantom Scans - Own Sites',(SELECT ID FROM modules WHERE Name='imaging_browser')),
    (40,'data_release_view', 'Release Files',(SELECT ID FROM modules WHERE Name='data_release')),
    (41,'data_release_upload', 'Release Files',(SELECT ID FROM modules WHERE Name='data_release')),
    (42,'data_release_edit_file_access', 'Grant Other Users Access to Releases',(SELECT ID FROM modules WHERE Name='data_release')),
    (43,'instrument_manager_read', 'Installed Instruments',(SELECT ID FROM modules WHERE Name='instrument_manager')),
    (44,'instrument_manager_write', 'Upload and Install Instruments',(SELECT ID FROM modules WHERE Name='instrument_manager')),
    (45,'publication_view', 'Publication Projects',(SELECT ID FROM modules WHERE Name='publication')),
    (46,'publication_propose', 'Propose Publication Projects',(SELECT ID FROM modules WHERE Name='publication')),
    (47,'publication_approve', 'Accept/Reject Publication Projects',(SELECT ID FROM modules WHERE Name='publication')),
    (48, 'candidate_dob_edit', 'Dates of Birth',(SELECT ID FROM modules WHERE Name='candidate_parameters')),
    (49,'electrophysiology_browser_view_allsites', 'EEGs - All Sites',(SELECT ID FROM modules WHERE Name='electrophysiology_browser')),
    (50,'electrophysiology_browser_view_site', 'EEGs - Own Sites',(SELECT ID FROM modules WHERE Name='electrophysiology_browser')),
    (51,'battery_manager_view','Battery Entries',(SELECT ID FROM modules WHERE Name='battery_manager')),
    (52,'battery_manager_edit','Battery Entries',(SELECT ID FROM modules WHERE Name='battery_manager')),
    (53,'module_manager_view', 'Installed Modules',(SELECT ID FROM modules WHERE Name='module_manager')),
    (54,'module_manager_edit', 'Installed Modules',(SELECT ID FROM modules WHERE Name='module_manager')),
    (55,'candidate_dod_edit', 'Dates of Death',(SELECT ID FROM modules WHERE Name='candidate_parameters')),
    (56,'violated_scans_view_ownsite','Violated Scans - Own Sites',(SELECT ID FROM modules WHERE Name='mri_violations')),
    (57,'document_repository_edit','Documents',(SELECT ID FROM modules WHERE Name='document_repository')),
    (58,'survey_accounts_view', 'Candidate Surveys',(SELECT ID FROM modules WHERE Name='survey_accounts')),
    (59,'imaging_quality_control_view','Flagged Imaging Entries',(SELECT ID FROM modules WHERE Name='imaging_qc')),
    (60,'behavioural_quality_control_view','Flagged Behavioural Entries',(SELECT ID FROM modules WHERE Name='behavioural_qc')),
    (61,'api_docs','API documentation',(SELECT ID FROM modules WHERE Name='api_docs')),
    (62,'electrophysiology_browser_edit_annotations','Annotations',(SELECT ID FROM modules WHERE Name='electrophysiology_browser')),
    (63,'monitor_eeg_uploads','Monitor EEG uploads',(SELECT ID FROM modules WHERE Name='electrophysiology_uploader')),
    (64,'roles_view','Roles',(SELECT ID FROM modules WHERE Name='roles')),
    (65,'roles_assign','Roles',(SELECT ID FROM modules WHERE Name='roles')),
    (66,'roles_edit','Roles',(SELECT ID FROM modules WHERE Name='roles'));

-- admin perm = all
INSERT INTO `user_perm_rel` (userID, permID)
  SELECT u.ID, p.permID
  FROM users u JOIN permissions p
  WHERE u.userid = 'admin'
  ORDER BY p.permID;

-- other permissions
INSERT INTO `permissions_permissions_types_rel` (permID, PermissionTypeID)
VALUES 
  (2, 1), (2, 2), (2, 3),
  (3, 1), (3, 2), (3, 3),
  (4, 3),
  (5, 2), (5, 3),
  (6, 3),
  (7, 7),
  (8, 7),
  (9, 1),
  (10, 1), (10, 2),
  (11, 7),
  (12, 7),
  (13, 7),
  (14, 1),
  (15, 1),
  (16, 1), (16, 3),
  (17, 1),
  (18, 1),
  (19, 1),
  (20, 2), (20, 3),
  (21, 3),
  (22, 1),
  (23, 3),
  (24, 1),
  (25, 1),
  (26, 1),
  (27, 4),
  (28, 1),
  (29, 1), (29, 5),
  (30, 1),
  (31, 3),
  (32, 1), (32, 6),
  (33, 5),
  (34, 3), (34, 4), (34, 5),
  (35, 1), (35, 6),
  (36, 7),
  (37, 7),
  (38, 1),
  (39, 1),
  (40, 1),
  (41, 5),
  (42, 7),
  (43, 1),
  (44, 7),
  (45, 1),
  (46, 7),
  (47, 7),
  (48, 3),
  (49, 1),
  (50, 1),
  (51, 1),
  (52, 2), (52, 3),
  (53, 1),
  (54, 3),
  (55, 3),
  (56, 1),
  (57, 3), (57, 5),
  (58, 1),
  (59, 1),
  (60, 1),
  (61, 1),
  (62, 2), (62, 3),
  (63, 7),
  (64, 1),
  (65, 3),
  (66, 2), (66, 3), (66, 4);

-- roles
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
  (1,'blocked', 'Blocked', 'A blocked user: user has access to nothing.'),
  (2,'administrator', 'Administrator', 'An administrator: has access to everything, no restrictions.');

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
