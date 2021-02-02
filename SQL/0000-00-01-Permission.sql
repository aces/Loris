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
    (1,'superuser','Superuser - supersedes all permissions','1'),
    (2,'user_accounts','User Accounts Module View Own Site','2'),
    (3,'user_accounts_multisite','User Accounts Module create and edit users All Sites','2'),
    (4,'context_help','Help Module Edit Documentation','2'),
    (5,'bvl_feedback','Behavioural QC','1'),
    (6,'imaging_browser_qc','Imaging Browser Module Edit QC Status','2'),
    (8,'send_to_dcc','Candidate Profile Module Send to DCC All Sites','2'),
    (9,'unsend_to_dcc','Candidate Profile Module Reverse Send from DCC own Site','2'),
    (10,'access_all_profiles','Candidate Profile Access All Sites','2'),
    (11,'data_entry','Data entry','1'),
    (12,'examiner_view','Examiner Module Edit Own Site','2'),
    (13,'examiner_multisite','Examiner Module Edit All Sites','2'),
    (15,'timepoint_flag','Candidate Parameter Module Edit Exclusion Flags Own Site','2'),
    (17,'conflict_resolver','Conflict Resolver Module Edit Own Site','2'),
    (18,'data_dict_view','Data Dictionary Module View','2'),
    (19,'violated_scans_view_allsites','MRI Violated Scan Module View All Sites','2'),
    (22,'config','Configuration Settings Edit','2'),
    (23,'imaging_browser_view_site','Imaging Browser Module View Own Site','2'),
    (24,'imaging_browser_view_allsites','Imaging Browser Module View All Sites','2'),
    (25,'dicom_archive_view_allsites','DICOM Module Archive Access','2'),
    (28,'instrument_builder','Instrument Builder Module Edit Instruments','2'),
    (29,'data_dict_edit','Data Dictionary Edit','2'),
    (31,'candidate_parameter_view','Candidate Parameter Module View Own Site','2'),
    (32,'candidate_parameter_edit','Candidate Parameter Module Edit Own Site','2'),
    (33,'genomic_browser_view_site','Genomic Browser Module View Own Sites','2'),
    (34,'genomic_browser_view_allsites','Genomic Browser Module View All Sites','2'),
    (35,'document_repository_view','Document Repository Module View and Upload Own File','2'),
    (36,'document_repository_delete','Document Repository Module Delete All Files','2'),
    (37,'server_processes_manager','Server Process Module View','2'),
    (38,'imaging_uploader','Imaging Uploader Module Upload Images for Own Site','2'),
    (39,'acknowledgements_view','Acknowledgement Module View All Sites','2'),
    (40,'acknowledgements_edit','Acknowledgement Module Edit All Sites','2'),
    (41,'dataquery_view','Data Query Tool View All Sites','2'),
    (42,'genomic_data_manager','Genomic Browser Module Edit Genomic Files at Own Site','2'),
    (43,'media_write','Media Module Upload, Download, Edit All Sites','2'),
    (44,'media_read','Media Module View File names own site','2'),
    (45,'issue_tracker_reporter','Issue Tracker Module Edit Own, Comment on All', 2),
    (46,'issue_tracker_developer','Issue Tracker Module Edit All', 2),
    (47,'imaging_browser_phantom_allsites','Imaging Browser Module Access Phantom Data All Sites', 2),
    (48,'imaging_browser_phantom_ownsite','Imaging Browser Module Access Phantom Data Own Site', 2),
    (49,'data_release_view','Data Release Module View', 2),
    (50,'data_release_upload','Data Release Module Upload', 2),
    (51,'data_release_edit_file_access','Data Release Module: Grant View Permission', 2),
    (52,'instrument_manager_read','Instrument Manager Module View', 2),
    (53,'instrument_manager_write','Instrument Manager Module Install New Instruments', 2),
    (54,'publication_view','Publication Module View', 2),
    (55,'publication_propose','Publication Module Propose Own Project', 2),
    (56,'publication_approve','Publication Module Propose Own, Approve or Reject All Projects', 2),
    (57,'candidate_dob_edit','Candidate Parameter Module Edit Date of Birth Own Site', 2),
    (58,'electrophysiology_browser_view_allsites','Electrophysiology Browser Module View All Sites', 2),
    (59,'electrophysiology_browser_view_site','Electrophysiology Browser Module View Own Site', 2),
    (60,'battery_manager_view','Battery Manager View Own Sites',2),
    (61,'battery_manager_edit','Battery Manager Edit Own Sites',2),
    (62,'module_manager_view','Module Manager Module View Own Site', 2),
    (63,'module_manager_edit','Module Manager Module Edit All Site', 2),
    (64,'candidate_dod_edit','Candidate Parameter Module Edit Date of Death Own Site', 2),
    (65,'violated_scans_view_ownsite','MRI Violated Scan Module View Own Site','2'),
    (66,'document_repository_edit','Document Repository: Edit and Upload','2'),
    (67,'survey_accounts_view','Survey Accounts: View module', 2),
    (68,'imaging_quality_control_view','Imaging Quality Control View Own Site','2'),
    (69,'behavioural_quality_control_view','Behavioural Quality Control View Own Site','2');

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
