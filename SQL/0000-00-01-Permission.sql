SET FOREIGN_KEY_CHECKS=0;


DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `user_perm_rel`;
DROP TABLE IF EXISTS `role`;
DROP TABLE IF EXISTS `role_permission_rel`;
DROP TABLE IF EXISTS `user_role_rel`;

SET FOREIGN_KEY_CHECKS=1;


CREATE TABLE `permissions` (
  `permID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `categoryID` int(10) NOT NULL DEFAULT '2',
  PRIMARY KEY (`permID`),
  UNIQUE KEY `code` (`code`)
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
    (1,'superuser','There can be only one Highlander'),
    (2,'user_accounts','User management'),
    (3,'user_accounts_multisite','Across all sites create and edit users'),
    (4,'context_help','Edit help documentation'),
    (5,'bvl_feedback','Behavioural QC'),
    (6,'imaging_browser_qc','Edit imaging browser QC status'),
    (7,'mri_efax','Edit MRI Efax files'),
    (8,'send_to_dcc','Send to DCC'),
    (9,'unsend_to_dcc','Reverse Send from DCC'),
    (10,'access_all_profiles','Across all sites access candidate profiles'),
    (11,'data_entry','Data entry'),
    (12,'examiner_view','Add and certify examiners'),
    (13,'examiner_multisite','Across all sites add and certify examiners'),
    (14,'training','View and complete training'),
    (15,'timepoint_flag','Edit exclusion flags'),
    (16,'timepoint_flag_evaluate','Evaluate overall exclusionary criteria for the timepoint'),
    (17,'conflict_resolver','Resolving conflicts'),
    (18,'data_dict_view','View Data Dictionary (Parameter type descriptions)'),
    (19,'violated_scans_view_allsites','Violated Scans: View all-sites Violated Scans'),
    (20,'violated_scans_edit','Violated Scans: Edit MRI protocol table'),
    (21,'data_integrity_flag','Data Integrity Flag'),
    (22,'config','Edit configuration settings'),
    (23,'edit_final_radiological_review','Can edit final radiological reviews'),
    (24,'view_final_radiological_review','Can see final radiological reviews'),
    (25,'imaging_browser_view_site','View own-site Imaging Browser pages'),
    (26,'imaging_browser_view_allsites', 'View all-sites Imaging Browser pages'),
    (27,'dicom_archive_view_allsites', 'Across all sites view Dicom Archive module and pages'),
    (28,'reliability_edit_all', 'Access and Edit all Reliability profiles'),
    (29,'reliability_swap_candidates', 'Swap Reliability candidates across all sites'),
    (30,'instrument_builder', 'Instrument Builder: Create and Edit instrument forms'),
    (31,'data_dict_edit','Edit Data Dictionary'),
    (32,'data_team_helper','Data Team Helper'),
    (33,'candidate_parameter_view','View Candidate Parameters'),
    (34,'candidate_parameter_edit','Edit Candidate Parameters'),
    (35,'genomic_browser_view_site','View Genomic Browser data from own site'),
    (36,'genomic_browser_view_allsites','View Genomic Browser data across all sites'),
    (37,'document_repository_view','View and upload files in Document Repository'),
    (38,'document_repository_delete','Delete files in Document Repository'),
    (39,'server_processes_manager','View and manage server processes'),
    (40,'imaging_uploader','Imaging Uploader'),
    (41,'acknowledgements_view','View Acknowledgements'),
    (42,'acknowledgements_edit','Edit Acknowledgements'),
    (43,'dataquery_view','View Data Query Tool'),
    (44,'genomic_data_manager','Manage the genomic files'),
    (45,'media_write','Media files: Uploading/Downloading/Editing'),
    (46,'media_read','Media files: Browsing'),
    (47,'issue_tracker_reporter', 'Can add a new issue, edit own issue, comment on all'),
    (48,'issue_tracker_developer', 'Can re-assign issues, mark issues as closed, comment on all, edit issues.'),
    (49,'imaging_browser_phantom_allsites', 'Can access only phantom data from all sites in Imaging Browser'),
    (50,'imaging_browser_phantom_ownsite', 'Can access only phantom data from own site in Imaging Browser');

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


CREATE TABLE `role` (
 `RoleID` INTEGER unsigned NOT NULL AUTO_INCREMENT,
 `Name` varchar(255),
 `Label` varchar(255),
 PRIMARY KEY (`RoleID`),
 UNIQUE KEY `UK_Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `role_permission_rel` (
  `RoleID` INTEGER unsigned NOT NULL,
  `PermissionID` INTEGER unsigned NOT NULL,
  PRIMARY KEY  (`RoleID`,`PermissionID`),
  CONSTRAINT `FK_role_permission_rel_RoleID` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_role_permission_rel_PermissionID` FOREIGN KEY (`PermissionID`) REFERENCES `permissions` (`permID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user_role_rel` (
  `UserID` INTEGER unsigned NOT NULL,
  `RoleID` INTEGER unsigned NOT NULL,
  PRIMARY KEY  (`UserID`,`RoleID`),
  CONSTRAINT `FK_user_role_rel_userID` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_role_rel_RoleID` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;