--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `permID` int(10) unsigned NOT NULL auto_increment,
  `code` varchar(255) NOT NULL default '',
  `description` varchar(255) NOT NULL default '',
  `categoryID` int(10) DEFAULT NULL,
  PRIMARY KEY  (`permID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
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
    (23,'edit_final_radiological_review','Can edit final radiological reviews','2'),
    (24,'view_final_radiological_review','Can see final radiological reviews','2'),
    (25,'imaging_browser_view_site','View own-site Imaging Browser pages','2'),
    (26,'imaging_browser_view_allsites', 'View all-sites Imaging Browser pages', '2'),
    (27,'dicom_archive_view_allsites', 'Across all sites view Dicom Archive module and pages', '2'),
    (28,'reliability_edit_all', 'Access and Edit all Reliability profiles', '2'),
    (29,'reliability_swap_candidates', 'Swap Reliability candidates across all sites', '2'),
    (30,'instrument_builder', 'Instrument Builder: Create and Edit instrument forms', '2'),
    (31,'data_dict_edit','Edit Data Dictionary','2'),
    (32,'data_team_helper','Data Team Helper','2'),
    (33,'candidate_parameter_view','View Candidate Parameters','2'),
    (34,'candidate_parameter_edit','Edit Candidate Parameters','2'),
    (35,'genomic_browser_view_site','View Genomic Browser data from own site','2'),
    (36,'genomic_browser_view_allsites','View Genomic Browser data across all sites','2'),
    (37,'document_repository_view','View and upload files in Document Repository','2'),
    (38,'document_repository_delete','Delete files in Document Repository','2'),
    (39,'server_processes_manager','View and manage server processes','2'),
    (40,'imaging_uploader','Imaging Uploader','2'),
    (41,'acknowledgements_view','View Acknowledgements','2'),
    (42,'acknowledgements_edit','Edit Acknowledgements','2'),
    (43,'dataquery_view','View Data Query Tool','2'),
    (44,'genomic_data_manager','Manage the genomic files','2'),
    (45,'media_write','Media files: Uploading/Downloading/Editing','2'),
    (46,'media_read','Media files: Browsing','2');

/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions_category`
--

DROP TABLE IF EXISTS `permissions_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions_category` (
  `ID` int(10) NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions_category`
--

LOCK TABLES `permissions_category` WRITE;
/*!40000 ALTER TABLE `permissions_category` DISABLE KEYS */;
INSERT INTO `permissions_category` VALUES (1,'Roles'),(2,'Permission');
/*!40000 ALTER TABLE `permissions_category` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `user_perm_rel`;
CREATE TABLE `user_perm_rel` (
  `userID` int(10) unsigned NOT NULL default '0',
  `permID` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`userID`,`permID`),
  KEY `FK_user_perm_rel_2` (`permID`),
  CONSTRAINT `FK_user_perm_rel_2` FOREIGN KEY (`permID`) REFERENCES `permissions` (`permID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_perm_rel_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_perm_rel`
--

LOCK TABLES `user_perm_rel` WRITE, `permissions` READ;
/*!40000 ALTER TABLE `user_perm_rel` DISABLE KEYS */;
INSERT INTO `user_perm_rel` (userID, permID) SELECT DISTINCT 1, permID FROM permissions;
/*!40000 ALTER TABLE `user_perm_rel` ENABLE KEYS */;
UNLOCK TABLES;
