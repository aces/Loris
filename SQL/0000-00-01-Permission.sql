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
  `categoryID` int(10) NOT NULL DEFAULT '2',
  PRIMARY KEY (`permID`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_permissions_1_idx` (`categoryID`),
  CONSTRAINT `fk_permissions_1`
  FOREIGN KEY (`categoryID`)
    REFERENCES `permissions_category` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
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
    (1,'superuser','There can be only one Highlander','1'),
    (2,'user_accounts','User management','2'),
    (3,'user_accounts_multisite','Across all sites create and edit users','2'),
    (4,'context_help','Edit help documentation','2'),
    (5,'bvl_feedback','Behavioural QC','1'),
    (6,'imaging_browser_qc','Edit imaging browser QC status','2'),
    (7,'mri_efax','Edit MRI Efax files','2'),
    (8,'send_to_dcc','Send to DCC','2'),
    (9,'unsend_to_dcc','Reverse Send from DCC','2'),
    (10,'access_all_profiles','Across all sites access candidate profiles','2'),
    (11,'data_entry','Data entry','1'),
    (12,'examiner_view','Add and certify examiners','2'),
    (13,'examiner_multisite','Across all sites add and certify examiners','2'),
    (14,'training','View and complete training','2'),
    (15,'timepoint_flag','Edit exclusion flags','2'),
    (16,'timepoint_flag_evaluate','Evaluate overall exclusionary criteria for the timepoint','2'),
    (17,'conflict_resolver','Resolving conflicts','2'),
    (18,'data_dict_view','View Data Dictionary (Parameter type descriptions)','2'),
    (19,'violated_scans_view_allsites','Violated Scans: View all-sites Violated Scans','2'),
    (20,'violated_scans_edit','Violated Scans: Edit MRI protocol table','2'),
    (21,'data_integrity_flag','Data Integrity Flag','2'),
    (22,'config','Edit configuration settings','2'),
    (23,'imaging_browser_view_site','View own-site Imaging Browser pages','2'),
    (24,'imaging_browser_view_allsites', 'View all-sites Imaging Browser pages', '2'),
    (25,'dicom_archive_view_allsites', 'Across all sites view Dicom Archive module and pages', '2'),
    (28,'instrument_builder', 'Instrument Builder: Create and Edit instrument forms', '2'),
    (29,'data_dict_edit','Edit Data Dictionary','2'),
    (30,'data_team_helper','Data Team Helper','2'),
    (31,'candidate_parameter_view','View Candidate Parameters','2'),
    (32,'candidate_parameter_edit','Edit Candidate Parameters','2'),
    (33,'genomic_browser_view_site','View Genomic Browser data from own site','2'),
    (34,'genomic_browser_view_allsites','View Genomic Browser data across all sites','2'),
    (35,'document_repository_view','View and upload files in Document Repository','2'),
    (36,'document_repository_delete','Delete files in Document Repository','2'),
    (37,'server_processes_manager','View and manage server processes','2'),
    (38,'imaging_uploader','Imaging Uploader','2'),
    (39,'acknowledgements_view','View Acknowledgements','2'),
    (40,'acknowledgements_edit','Edit Acknowledgements','2'),
    (41,'dataquery_view','View Data Query Tool','2'),
    (42,'genomic_data_manager','Manage the genomic files','2'),
    (43,'media_write','Media files: Uploading/Downloading/Editing','2'),
    (44,'media_read','Media files: Browsing','2'),
    (45,'issue_tracker_reporter', 'Can add a new issue, edit own issue, comment on all', 2),
    (46,'issue_tracker_developer', 'Can re-assign issues, mark issues as closed, comment on all, edit issues.', 2),
    (47,'imaging_browser_phantom_allsites', 'Can access only phantom data from all sites in Imaging Browser', 2),
    (48,'imaging_browser_phantom_ownsite', 'Can access only phantom data from own site in Imaging Browser', 2),
    (49,'data_release_upload', 'Data Release: Upload file', 2),
    (50,'data_release_edit_file_access', 'Data Release: Grant other users view-file permissions', 2),
    (51,'instrument_manager_read', 'Instrument Manager: View module', 2),
    (52,'instrument_manager_write', 'Instrument Manager: Install new instruments via file upload', 2),
    (53,'publication_view', 'Publication - Access to module', 2),
    (54,'publication_propose', 'Publication - Propose a project', 2),
    (55,'publication_approve', 'Publication - Approve or reject proposed publication projects', 2);


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
