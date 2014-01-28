-- MySQL dump 10.11
--
-- Host: localhost    Database: smart_dummy
-- ------------------------------------------------------
-- Server version	5.0.45-Debian_1ubuntu3.3-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `candidate`
--

DROP TABLE IF EXISTS `candidate`;
CREATE TABLE `candidate` (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `CandID` int(6) NOT NULL default '0',
  `PSCID` varchar(255) NOT NULL default '',
  `DoB` date default NULL,
  `EDC` date default NULL,
  `Gender` enum('Male','Female') default NULL,
  `CenterID` tinyint(2) unsigned NOT NULL default '0',
  `ProjectID` int(11) default NULL,
  `Ethnicity` varchar(255) default NULL,
  `ZIP` varchar(12) default NULL,
  `FamilyID` int(6) default NULL,
  `Sibling1` int(6) default NULL,
  `Sibling2` int(6) default NULL,
  `Sibling3` int(6) default NULL,
  `Active` enum('Y','N') NOT NULL default 'Y',
  `Date_active` date default NULL,
  `RegisteredBy` varchar(255) default NULL,
  `UserID` varchar(255) NOT NULL default '',
  `Date_registered` date default NULL,
  `Testdate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `Entity_type` enum('Human','Scanner') NOT NULL default 'Human',
  PRIMARY KEY  (`CandID`),
  UNIQUE KEY `ID` (`ID`),
  KEY `FK_candidate_1` (`CenterID`),
  CONSTRAINT `FK_candidate_1` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `candidate`
--

LOCK TABLES `candidate` WRITE;
/*!40000 ALTER TABLE `candidate` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `document_repository`;
CREATE TABLE `document_repository` (
  `record_id` int(11) NOT NULL AUTO_INCREMENT,
  `PSCID` varchar(255) DEFAULT NULL,
  `Instrument` varchar(255) DEFAULT NULL,
  `visitLabel` varchar(255) DEFAULT NULL,
  `Date_taken` date DEFAULT NULL,
  `Date_uploaded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Data_dir` varchar(255) DEFAULT NULL,
  `File_name` varchar(255) DEFAULT NULL,
  `File_type` varchar(20) DEFAULT NULL,
  `version` varchar(20) DEFAULT NULL,
  `File_size` bigint(20) unsigned DEFAULT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `For_site` int(2) DEFAULT NULL,
  `comments` text,
  `multipart` enum('Yes','No') DEFAULT NULL,
  `EARLI` tinyint(1) DEFAULT '0',
  `hide_video` tinyint(1) DEFAULT '0',
  `File_category` enum('abstract','audio_visual','image','instrument','manual','minutes','paper','presentation','protocol','spreadsheet_table','other') DEFAULT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `examiners`
--

DROP TABLE IF EXISTS `examiners`;
CREATE TABLE `examiners` (
  `examinerID` int(10) unsigned NOT NULL auto_increment,
  `full_name` varchar(255) default NULL,
  `centerID` tinyint(2) unsigned default NULL,
  `radiologist` tinyint(1) default NULL,
  PRIMARY KEY  (`examinerID`),
  UNIQUE KEY `full_name` (`full_name`,`centerID`),
  KEY `FK_examiners_1` (`centerID`),
  CONSTRAINT `FK_examiners_1` FOREIGN KEY (`centerID`) REFERENCES `psc` (`CenterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `examiners`
--

LOCK TABLES `examiners` WRITE;
/*!40000 ALTER TABLE `examiners` DISABLE KEYS */;
/*!40000 ALTER TABLE `examiners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_bvl_entry`
--

DROP TABLE IF EXISTS `feedback_bvl_entry`;
CREATE TABLE `feedback_bvl_entry` (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `FeedbackID` int(11) unsigned default NULL,
  `Comment` text,
  `UserID` varchar(255) default NULL,
  `Testdate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`ID`),
  KEY `FK_feedback_bvl_entry_1` (`FeedbackID`),
  CONSTRAINT `FK_feedback_bvl_entry_1` FOREIGN KEY (`FeedbackID`) REFERENCES `feedback_bvl_thread` (`FeedbackID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feedback_bvl_entry`
--

LOCK TABLES `feedback_bvl_entry` WRITE;
/*!40000 ALTER TABLE `feedback_bvl_entry` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback_bvl_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_bvl_thread`
--

DROP TABLE IF EXISTS `feedback_bvl_thread`;
CREATE TABLE `feedback_bvl_thread` (
  `FeedbackID` int(11) unsigned NOT NULL auto_increment,
  `CandID` int(6) default NULL,
  `SessionID` int(11) unsigned default NULL,
  `CommentID` varchar(255) default NULL,
  `Feedback_level` enum('profile','visit','instrument') NOT NULL default 'profile',
  `Feedback_type` int(11) unsigned default NULL,
  `Public` enum('N','Y') NOT NULL default 'N',
  `Status` enum('opened','answered','closed','comment') NOT NULL default 'opened',
  `Active` enum('N','Y') NOT NULL default 'N',
  `Date_taken` date default NULL,
  `UserID` varchar(255) NOT NULL default '',
  `Testdate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `FieldName` text default NULL,
  PRIMARY KEY  (`FeedbackID`),
  KEY `FK_feedback_bvl_thread_1` (`Feedback_type`),
  CONSTRAINT `FK_feedback_bvl_thread_1` FOREIGN KEY (`Feedback_type`) REFERENCES `feedback_bvl_type` (`Feedback_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feedback_bvl_thread`
--

LOCK TABLES `feedback_bvl_thread` WRITE;
/*!40000 ALTER TABLE `feedback_bvl_thread` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback_bvl_thread` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_bvl_type`
--

DROP TABLE IF EXISTS `feedback_bvl_type`;
CREATE TABLE `feedback_bvl_type` (
  `Feedback_type` int(11) unsigned NOT NULL auto_increment,
  `Name` varchar(100) NOT NULL default '',
  `Description` text,
  PRIMARY KEY  (`Feedback_type`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feedback_bvl_type`
--

LOCK TABLES `feedback_bvl_type` WRITE;
/*!40000 ALTER TABLE `feedback_bvl_type` DISABLE KEYS */;
INSERT INTO `feedback_bvl_type` VALUES (1,'Input','Input Errors'),(2,'Scoring','Scoring Errors');
/*!40000 ALTER TABLE `feedback_bvl_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_bvl_types_site`
--

DROP TABLE IF EXISTS `feedback_bvl_types_site`;
CREATE TABLE `feedback_bvl_types_site` (
  `Feedback_type` int(11) unsigned NOT NULL default '0',
  `CenterID` tinyint(2) unsigned NOT NULL default '0',
  PRIMARY KEY  (`Feedback_type`,`CenterID`),
  KEY `FK_feedback_bvl_types_site_2` (`CenterID`),
  CONSTRAINT `FK_feedback_bvl_types_site_2` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `FK_feedback_bvl_types_site_1` FOREIGN KEY (`Feedback_type`) REFERENCES `feedback_bvl_type` (`Feedback_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feedback_bvl_types_site`
--

LOCK TABLES `feedback_bvl_types_site` WRITE;
/*!40000 ALTER TABLE `feedback_bvl_types_site` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback_bvl_types_site` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_mri_comment_types`
--

DROP TABLE IF EXISTS `feedback_mri_comment_types`;
CREATE TABLE `feedback_mri_comment_types` (
  `CommentTypeID` int(11) unsigned NOT NULL auto_increment,
  `CommentName` varchar(255) NOT NULL default '',
  `CommentType` enum('volume','visit') NOT NULL default 'volume',
  `CommentStatusField` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`CommentTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feedback_mri_comment_types`
--

LOCK TABLES `feedback_mri_comment_types` WRITE;
/*!40000 ALTER TABLE `feedback_mri_comment_types` DISABLE KEYS */;
INSERT INTO `feedback_mri_comment_types` VALUES (1,'Geometric intensity','volume','a:2:{s:5:\"field\";s:19:\"Geometric_intensity\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}'),(2,'Intensity','volume','a:2:{s:5:\"field\";s:9:\"Intensity\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}'),(3,'Movement artifact','volume','a:2:{s:5:\"field\";s:30:\"Movement_artifacts_within_scan\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:6:\"Slight\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}'),(4,'Packet movement artifact','volume','a:2:{s:5:\"field\";s:34:\"Movement_artifacts_between_packets\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:6:\"Slight\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}'),(5,'Coverage','volume','a:2:{s:5:\"field\";s:8:\"Coverage\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:5:\"Limit\";i:4;s:12:\"Unacceptable\";}}'),(6,'Overall','volume',''),(7,'Subject','visit','');
/*!40000 ALTER TABLE `feedback_mri_comment_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_mri_comments`
--

DROP TABLE IF EXISTS `feedback_mri_comments`;
CREATE TABLE `feedback_mri_comments` (
  `CommentID` int(11) unsigned NOT NULL auto_increment,
  `MRIID` int(11) unsigned default NULL,
  `FileID` int(10) unsigned default NULL,
  `SeriesUID` varchar(64) default NULL,
  `EchoTime` double default NULL,
  `SessionID` int(10) unsigned default NULL,
  `PatientName` varchar(255) default NULL,
  `CandID` varchar(6) default NULL,
  `VisitNo` int(2) default NULL,
  `CommentTypeID` int(11) unsigned NOT NULL default '0',
  `PredefinedCommentID` int(11) unsigned default NULL,
  `Comment` text,
  `ChangeTime` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`CommentID`),
  KEY `MRIID` (`MRIID`),
  KEY `Candidate` (`CandID`,`VisitNo`),
  KEY `NonCandidate` (`PatientName`),
  KEY `FK_feedback_mri_comments_1` (`CommentTypeID`),
  KEY `FK_feedback_mri_comments_2` (`PredefinedCommentID`),
  KEY `FK_feedback_mri_comments_3` (`FileID`),
  KEY `FK_feedback_mri_comments_4` (`SessionID`),
  CONSTRAINT `FK_feedback_mri_comments_4` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
  CONSTRAINT `FK_feedback_mri_comments_1` FOREIGN KEY (`CommentTypeID`) REFERENCES `feedback_mri_comment_types` (`CommentTypeID`),
  CONSTRAINT `FK_feedback_mri_comments_2` FOREIGN KEY (`PredefinedCommentID`) REFERENCES `feedback_mri_predefined_comments` (`PredefinedCommentID`),
  CONSTRAINT `FK_feedback_mri_comments_3` FOREIGN KEY (`FileID`) REFERENCES `files` (`FileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feedback_mri_comments`
--

LOCK TABLES `feedback_mri_comments` WRITE;
/*!40000 ALTER TABLE `feedback_mri_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback_mri_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_mri_predefined_comments`
--

DROP TABLE IF EXISTS `feedback_mri_predefined_comments`;
CREATE TABLE `feedback_mri_predefined_comments` (
  `PredefinedCommentID` int(11) unsigned NOT NULL auto_increment,
  `CommentTypeID` int(11) unsigned NOT NULL default '0',
  `Comment` text NOT NULL,
  PRIMARY KEY  (`PredefinedCommentID`),
  KEY `CommentType` (`CommentTypeID`),
  CONSTRAINT `FK_feedback_mri_predefined_comments_1` FOREIGN KEY (`CommentTypeID`) REFERENCES `feedback_mri_comment_types` (`CommentTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feedback_mri_predefined_comments`
--

LOCK TABLES `feedback_mri_predefined_comments` WRITE;
/*!40000 ALTER TABLE `feedback_mri_predefined_comments` DISABLE KEYS */;
INSERT INTO `feedback_mri_predefined_comments` VALUES (1,2,'missing slices'),(2,2,'reduced dynamic range due to bright artifact/pixel'),(3,2,'slice to slice intensity differences'),(4,2,'noisy scan'),(5,2,'susceptibilty artifact above the ear canals.'),(6,2,'susceptibilty artifact due to dental work'),(7,2,'sagittal ghosts'),(8,3,'slight ringing artefacts'),(9,3,'severe ringing artefacts'),(10,3,'movement artefact due to eyes'),(11,3,'movement artefact due to carotid flow'),(12,4,'slight movement between packets'),(13,4,'large movement between packets'),(14,5,'Large AP wrap around, affecting brain'),(15,5,'Medium AP wrap around, no affect on brain'),(16,5,'Small AP wrap around, no affect on brain'),(17,5,'Too tight LR, cutting into scalp'),(18,5,'Too tight LR, affecting brain'),(19,5,'Top of scalp cut off'),(20,5,'Top of brain cut off'),(21,5,'Base of cerebellum cut off'),(22,5,'missing top third - minc conversion?'),(23,6,'copy of prev data');
/*!40000 ALTER TABLE `feedback_mri_predefined_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `FileID` int(10) unsigned NOT NULL auto_increment,
  `SessionID` int(10) unsigned NOT NULL default '0',
  `File` varchar(255) NOT NULL default '',
  `SeriesUID` varchar(64) DEFAULT NULL,
  `EchoTime` double DEFAULT NULL,
  `CoordinateSpace` varchar(255) default NULL,
  `ClassifyAlgorithm` varchar(255) default NULL,
  `OutputType` varchar(255) NOT NULL default '',
  `AcquisitionProtocolID` int(10) unsigned default NULL,
  `FileType` enum('mnc','obj','xfm','xfmmnc','imp','vertstat','xml','txt') default NULL,
  `PendingStaging` tinyint(1) NOT NULL default '0',
  `InsertedByUserID` varchar(255) NOT NULL default '',
  `InsertTime` int(10) unsigned NOT NULL default '0',
  `SourcePipeline` varchar(255),
  `PipelineDate` date,
  `SourceFileID` int(10) unsigned DEFAULT '0',
  PRIMARY KEY  (`FileID`),
  KEY `file` (`File`),
  KEY `sessionid` (`SessionID`),
  KEY `outputtype` (`OutputType`),
  KEY `filetype_outputtype` (`FileType`,`OutputType`),
  KEY `staging_filetype_outputtype` (`PendingStaging`,`FileType`,`OutputType`),
  KEY `AcquiIndex` (`AcquisitionProtocolID`,`SessionID`),
  CONSTRAINT `FK_files_2` FOREIGN KEY (`AcquisitionProtocolID`) REFERENCES `mri_scan_type` (`ID`),
  CONSTRAINT `FK_files_1` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
  CONSTRAINT `FK_files_3` FOREIGN KEY (`SourceFileID`) REFERENCES `files` (`FileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `files_qcstatus`;
CREATE TABLE `files_qcstatus` (
    FileQCID int(11) PRIMARY KEY auto_increment,
    FileID int(11) UNIQUE NULL,
    SeriesUID varchar(64) DEFAULT NULL,
    EchoTime double DEFAULT NULL,
    QCStatus enum('Pass', 'Fail'),
    QCFirstChangeTime int(10) unsigned,
    QCLastChangeTime int(10) unsigned
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flag`
--

DROP TABLE IF EXISTS `flag`;
CREATE TABLE `flag` (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `SessionID` int(10) unsigned NOT NULL default '0',
  `Test_name` varchar(255) NOT NULL default '',
  `CommentID` varchar(255) NOT NULL default '',
  `Data_entry` enum('In Progress','Complete') default NULL,
  `Administration` enum('None','Partial','All') default NULL,
  `Validity` enum('Questionable','Invalid','Valid') default NULL,
  `Exclusion` enum('Fail','Pass') default NULL,
  `Flag_status` enum('P','Y','N','F') default NULL,
  `UserID` varchar(255) default NULL,
  `Testdate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`CommentID`),
  KEY `Status` (`Flag_status`),
  KEY `flag_ID` (`ID`),
  KEY `flag_SessionID` (`SessionID`),
  KEY `flag_Test_name` (`Test_name`),
  KEY `flag_Exclusion` (`Exclusion`),
  KEY `flag_Data_entry` (`Data_entry`),
  KEY `flag_Validity` (`Validity`),
  KEY `flag_Administration` (`Administration`),
  KEY `flag_UserID` (`UserID`),
  CONSTRAINT `FK_flag_1` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_flag_2` FOREIGN KEY (`Test_name`) REFERENCES `test_names` (`Test_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `flag`
--

LOCK TABLES `flag` WRITE;
/*!40000 ALTER TABLE `flag` DISABLE KEYS */;
/*!40000 ALTER TABLE `flag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
CREATE TABLE `history` (
  `id` int(11) NOT NULL auto_increment,
  `tbl` varchar(255) NOT NULL default '',
  `col` varchar(255) NOT NULL default '',
  `old` text,
  `new` text,
  `primaryCols` text,
  `primaryVals` text,
  `changeDate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `userID` varchar(255) NOT NULL default '',
  `type` char(1),
  PRIMARY KEY  (`id`),
  KEY `FK_history_1` (`userID`),
  CONSTRAINT `FK_history_1` FOREIGN KEY (`userID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='This table keeps track of ongoing changes in the database. ';

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instrument_subtests`
--

DROP TABLE IF EXISTS `instrument_subtests`;
CREATE TABLE `instrument_subtests` (
  `ID` int(11) NOT NULL auto_increment,
  `Test_name` varchar(255) NOT NULL default '',
  `Subtest_name` varchar(255) NOT NULL default '',
  `Description` varchar(255) NOT NULL default '',
  `Order_number` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`),
  KEY `FK_instrument_subtests_1` (`Test_name`),
  CONSTRAINT `FK_instrument_subtests_1` FOREIGN KEY (`Test_name`) REFERENCES `test_names` (`Test_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `instrument_subtests`
--

LOCK TABLES `instrument_subtests` WRITE;
/*!40000 ALTER TABLE `instrument_subtests` DISABLE KEYS */;
/*!40000 ALTER TABLE `instrument_subtests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mri_acquisition_dates`
--

DROP TABLE IF EXISTS `mri_acquisition_dates`;
CREATE TABLE `mri_acquisition_dates` (
  `SessionID` int(10) unsigned NOT NULL default '0',
  `AcquisitionDate` date default NULL,
  PRIMARY KEY  (`SessionID`),
  CONSTRAINT `FK_mri_acquisition_dates_1` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mri_acquisition_dates`
--

LOCK TABLES `mri_acquisition_dates` WRITE;
/*!40000 ALTER TABLE `mri_acquisition_dates` DISABLE KEYS */;
/*!40000 ALTER TABLE `mri_acquisition_dates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mri_protocol`
--

DROP TABLE IF EXISTS `mri_protocol`;
CREATE TABLE `mri_protocol` (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `Center_name` varchar(4) NOT NULL default '',
  `ScannerID` int(10) unsigned NOT NULL default '0',
  `Objective` tinyint(1) unsigned default NULL,
  `Scan_type` int(10) unsigned NOT NULL default '0',
  `TR_range` varchar(255) default NULL,
  `TE_range` varchar(255) default NULL,
  `TI_range` varchar(255) default NULL,
  `slice_thickness_range` varchar(255) default NULL,
  `FoV_x_range` varchar(255) default NULL,
  `FoV_y_range` varchar(255) default NULL,
  `FoV_z_range` varchar(255) default NULL,
  `xspace_range` varchar(255) default NULL,
  `yspace_range` varchar(255) default NULL,
  `zspace_range` varchar(255) default NULL,
  `xstep_range` varchar(255) default NULL,
  `ystep_range` varchar(255) default NULL,
  `zstep_range` varchar(255) default NULL,
  `time_range` varchar(255) default NULL,
  `series_description_regex` varchar(255) default NULL,
  PRIMARY KEY  (`ID`),
  KEY `FK_mri_protocol_1` (`ScannerID`),
  CONSTRAINT `FK_mri_protocol_1` FOREIGN KEY (`ScannerID`) REFERENCES `mri_scanner` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mri_protocol`
--

LOCK TABLES `mri_protocol` WRITE;
/*!40000 ALTER TABLE `mri_protocol` DISABLE KEYS */;
/*!40000 ALTER TABLE `mri_protocol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mri_scan_type`
--

DROP TABLE IF EXISTS `mri_scan_type`;
CREATE TABLE `mri_scan_type` (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `Scan_type` text NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mri_scan_type`
--

LOCK TABLES `mri_scan_type` WRITE;
/*!40000 ALTER TABLE `mri_scan_type` DISABLE KEYS */;
INSERT INTO `mri_scan_type` VALUES (40,'fMRI'),(41,'flair'),(44,'t1'),(45,'t2'),(46,'pd'),(47,'mrs'),(48,'dti'),(49,'t1relx'),(50,'dct2e1'),(51,'dct2e2'),(52,'scout'),(53,'tal_msk'),(54,'cocosco_cls'),(55,'clean_cls'),(56,'em_cls'),(57,'seg'),(58,'white_matter'),(59,'gray_matter'),(60,'csf_matter'),(61,'nlr_masked'),(62,'pve'),(999,'unknown'),(1000,'NA');
/*!40000 ALTER TABLE `mri_scan_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mri_scanner`
--

DROP TABLE IF EXISTS `mri_scanner`;
CREATE TABLE `mri_scanner` (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `Manufacturer` varchar(255) default NULL,
  `Model` varchar(255) default NULL,
  `Serial_number` varchar(255) default NULL,
  `Software` varchar(255) default NULL,
  `CandID` int(11) default NULL,
  PRIMARY KEY  (`ID`),
  KEY `FK_mri_scanner_1` (`CandID`),
  CONSTRAINT `FK_mri_scanner_1` FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mri_scanner`
--

LOCK TABLES `mri_scanner` WRITE;
/*!40000 ALTER TABLE `mri_scanner` DISABLE KEYS */;
INSERT INTO `mri_scanner` VALUES (0,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `mri_scanner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_spool`
--

DROP TABLE IF EXISTS `notification_spool`;
CREATE TABLE `notification_spool` (
  `NotificationID` int(11) NOT NULL auto_increment,
  `NotificationTypeID` int(11) NOT NULL default '0',
  `TimeSpooled` int(11) NOT NULL default '0',
  `Message` text,
  `Sent` enum('N','Y') NOT NULL default 'N',
  `CenterID` tinyint(2) unsigned default NULL,
  PRIMARY KEY  (`NotificationID`),
  KEY `FK_notification_spool_1` (`NotificationTypeID`),
  KEY `FK_notification_spool_2` (`CenterID`),
  CONSTRAINT `FK_notification_spool_2` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `FK_notification_spool_1` FOREIGN KEY (`NotificationTypeID`) REFERENCES `notification_types` (`NotificationTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `notification_spool`
--

LOCK TABLES `notification_spool` WRITE;
/*!40000 ALTER TABLE `notification_spool` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_spool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_types`
--

DROP TABLE IF EXISTS `notification_types`;
CREATE TABLE `notification_types` (
  `NotificationTypeID` int(11) NOT NULL auto_increment,
  `Type` varchar(255) NOT NULL default '',
  `private` tinyint(1) default '0',
  `Description` text,
  PRIMARY KEY  (`NotificationTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `notification_types`
--

LOCK TABLES `notification_types` WRITE;
/*!40000 ALTER TABLE `notification_types` DISABLE KEYS */;
INSERT INTO `notification_types` VALUES (1,'mri new study',0,'New studies processed by the MRI upload handler'),(2,'mri new series',0,'New series processed by the MRI upload handler'),(3,'mri upload handler emergency',1,'MRI upload handler emergencies'),(4,'mri staging required',1,'New studies received by the MRI upload handler that require staging'),(5,'mri invalid study',0,'Incorrectly labelled studies received by the MRI upload handler'),(7,'hardcopy request',0,'Hardcopy requests'),(9,'visual bvl qc',0,'Timepoints selected for visual QC'),(10,'mri qc status',0,'MRI QC Status change');
/*!40000 ALTER TABLE `notification_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameter_candidate`
--

DROP TABLE IF EXISTS `parameter_candidate`;
CREATE TABLE `parameter_candidate` (
  `ParameterCandidateID` int(10) unsigned NOT NULL auto_increment,
  `CandID` int(6) NOT NULL default '0',
  `ParameterTypeID` int(10) unsigned NOT NULL default '0',
  `Value` varchar(255) default NULL,
  `InsertTime` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`ParameterCandidateID`),
  KEY `candidate_type` (`CandID`,`ParameterTypeID`),
  KEY `parameter_value` (`ParameterTypeID`,`Value`(64)),
  CONSTRAINT `FK_parameter_candidate_2` FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`),
  CONSTRAINT `FK_parameter_candidate_1` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='per-candidate equivalent of parameter_session';

--
-- Dumping data for table `parameter_candidate`
--

LOCK TABLES `parameter_candidate` WRITE;
/*!40000 ALTER TABLE `parameter_candidate` DISABLE KEYS */;
/*!40000 ALTER TABLE `parameter_candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameter_file`
--

DROP TABLE IF EXISTS `parameter_file`;
CREATE TABLE `parameter_file` (
  `ParameterFileID` int(10) unsigned NOT NULL auto_increment,
  `FileID` int(10) unsigned NOT NULL default '0',
  `ParameterTypeID` int(10) unsigned NOT NULL default '0',
  `Value` text,
  `InsertTime` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`ParameterFileID`),
  UNIQUE KEY `file_type_uniq` (`FileID`,`ParameterTypeID`),
  KEY `parameter_value` (`ParameterTypeID`,`Value`(64)),
  CONSTRAINT `FK_parameter_file_2` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`),
  CONSTRAINT `FK_parameter_file_1` FOREIGN KEY (`FileID`) REFERENCES `files` (`FileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `parameter_file`
--

LOCK TABLES `parameter_file` WRITE;
/*!40000 ALTER TABLE `parameter_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `parameter_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameter_session`
--

DROP TABLE IF EXISTS `parameter_session`;
CREATE TABLE `parameter_session` (
  `ParameterSessionID` int(10) unsigned NOT NULL auto_increment,
  `SessionID` int(10) unsigned NOT NULL default '0',
  `ParameterTypeID` int(10) unsigned NOT NULL default '0',
  `Value` varchar(255) default NULL,
  `InsertTime` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`ParameterSessionID`),
  KEY `session_type` (`SessionID`,`ParameterTypeID`),
  KEY `parameter_value` (`ParameterTypeID`,`Value`(64)),
  CONSTRAINT `FK_parameter_session_2` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`),
  CONSTRAINT `FK_parameter_session_1` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `parameter_session`
--

LOCK TABLES `parameter_session` WRITE;
/*!40000 ALTER TABLE `parameter_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `parameter_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameter_type`
--

DROP TABLE IF EXISTS `parameter_type`;
CREATE TABLE `parameter_type` (
  `ParameterTypeID` int(10) unsigned NOT NULL auto_increment,
  `Name` varchar(255) NOT NULL default '',
  `Type` text,
  `Description` text,
  `RangeMin` double default NULL,
  `RangeMax` double default NULL,
  `SourceField` text,
  `SourceFrom` text,
  `SourceCondition` text,
  `CurrentGUITable` varchar(255) default NULL,
  `Queryable` tinyint(1) default '1',
  `IsFile` tinyint(1) default '0',
  PRIMARY KEY  (`ParameterTypeID`),
  KEY `name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COMMENT='dictionary of all the variables in the project';

--
-- Dumping data for table `parameter_type`
--

LOCK TABLES `parameter_type` WRITE;
/*!40000 ALTER TABLE `parameter_type` DISABLE KEYS */;
INSERT INTO `parameter_type` VALUES (1,'Selected','varchar(10)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0),(2,'Geometric_intensity','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0),(3,'Intensity','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0),(4,'Movement_artifacts_within_scan','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0),(5,'Movement_artifacts_between_packets','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0),(6,'Coverage','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0),(7,'md5hash','varchar(255)','md5hash magically created by NeuroDB::File',NULL,NULL,'parameter_file.Value','parameter_file',NULL,'quat_table_1',1);
/*!40000 ALTER TABLE `parameter_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameter_type_category`
--

DROP TABLE IF EXISTS `parameter_type_category`;
CREATE TABLE `parameter_type_category` (
  `ParameterTypeCategoryID` int(10) unsigned NOT NULL auto_increment,
  `Name` varchar(255) default NULL,
  `Type` enum('Metavars','Instrument') default 'Metavars',
  PRIMARY KEY  (`ParameterTypeCategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `parameter_type_category`
--

LOCK TABLES `parameter_type_category` WRITE;
/*!40000 ALTER TABLE `parameter_type_category` DISABLE KEYS */;
INSERT INTO `parameter_type_category` VALUES (1,'MRI Variables','Metavars');
/*!40000 ALTER TABLE `parameter_type_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameter_type_category_rel`
--

DROP TABLE IF EXISTS `parameter_type_category_rel`;
CREATE TABLE `parameter_type_category_rel` (
  `ParameterTypeID` int(11) unsigned NOT NULL default '0',
  `ParameterTypeCategoryID` int(11) unsigned NOT NULL default '0',
  PRIMARY KEY  (`ParameterTypeCategoryID`,`ParameterTypeID`),
  KEY `FK_parameter_type_category_rel_1` (`ParameterTypeID`),
  CONSTRAINT `FK_parameter_type_category_rel_2` FOREIGN KEY (`ParameterTypeCategoryID`) REFERENCES `parameter_type_category` (`ParameterTypeCategoryID`),
  CONSTRAINT `FK_parameter_type_category_rel_1` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `parameter_type_category_rel`
--

LOCK TABLES `parameter_type_category_rel` WRITE;
/*!40000 ALTER TABLE `parameter_type_category_rel` DISABLE KEYS */;
/*!40000 ALTER TABLE `parameter_type_category_rel` ENABLE KEYS */;
UNLOCK TABLES;


--
-- ADDing Meta-data Visit_label , candidate_label and candidate_dob
--

INSERT INTO parameter_type (Name, Type, Description, RangeMin, RangeMax, SourceField, SourceFrom, CurrentGUITable, Queryable, SourceCondition) VALUES ('candidate_label','text','Identifier_of_candidate',null,null,'PSCID','candidate',null,1,null);
INSERT INTO parameter_type (Name, Type, Description, RangeMin, RangeMax, SourceField, SourceFrom, CurrentGUITable, Queryable, SourceCondition) VALUES ('Visit_label','varchar(255)','Visit_label',null,null,'visit_label','session',null,1,null);
INSERT INTO parameter_type (Name, Type, Description, RangeMin, RangeMax, SourceField, SourceFrom, CurrentGUITable, Queryable, SourceCondition) VALUES  ('candidate_dob','date','Candidate_Dob',null,null,'DoB','candidate',null,1,null);

INSERT INTO parameter_type_category (Name, type) VALUES('Identifiers', 'Metavars');

INSERT INTO parameter_type_category_rel (ParameterTypeID,ParameterTypeCategoryID) 
SELECT pt.ParameterTypeID,ptc.ParameterTypeCategoryID 
FROM parameter_type pt,parameter_type_category ptc 
WHERE ptc.Name='Identifiers' AND pt.Name IN ('candidate_label', 'Visit_label','candidate_dob');


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
INSERT INTO `permissions` VALUES (1,'superuser','There can be only one Highlander','1'),(2,'user_accounts','User management','2'),(3,'user_accounts_multisite','Across all sites create and edit users','2'),(4,'context_help','Edit help documentation','2'),(5,'bvl_feedback','Behavioural QC','1'),(6,'mri_feedback','Edit MRI feedback threads','2'),(7,'mri_efax','Edit MRI Efax files','2'),(8,'send_to_dcc','Send to DCC','2'),(9,'unsend_to_dcc','Reverse Send from DCC','2'),(10,'access_all_profiles','Across all sites access candidate profiles','2'),(11,'data_entry','Data entry','1'),(12,'certification','Certify examiners','2'),(13,'certification_multisite','Across all sites certify examiners','2'),(14,'timepoint_flag','Edit exclusion flags','2'),(15,'timepoint_flag_evaluate','Evaluate overall exclusionary criteria for the timepoint','2'),(16,'mri_safety','Review MRI safety form for accidental findings','2'),(17,'conflict_resolver','Resolving conflicts','2'),(18,'data_dict','Parameter Type description','2'),(19,'violated_scans','Violated Scans','2'),(20,'violated_scans_modifications','Editing the MRI protocol table (Violated Scans module)','2'),(21,'data_integrity_flag','Data Integrity Flag','2');

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

--
-- Table structure for table `psc`
--

DROP TABLE IF EXISTS `psc`;
CREATE TABLE `psc` (
  `CenterID` tinyint(2) unsigned NOT NULL auto_increment,
  `Name` varchar(150) NOT NULL default '',
  `PSCArea` varchar(150) NOT NULL default '',
  `Address` varchar(150) NOT NULL default '',
  `City` varchar(150) NOT NULL default '',
  `StateID` tinyint(2) unsigned NOT NULL default '0',
  `ZIP` varchar(12) NOT NULL default '',
  `Phone1` varchar(12) NOT NULL default '',
  `Phone2` varchar(12) NOT NULL default '',
  `Contact1` varchar(150) NOT NULL default '',
  `Contact2` varchar(150) NOT NULL default '',
  `Alias` char(3) NOT NULL default '',
  `MRI_alias` varchar(4) NOT NULL default '',
  `Account` varchar(8) NOT NULL default '',
  `Study_site` enum('N','Y') default NULL,
  PRIMARY KEY  (`CenterID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `psc`
--

LOCK TABLES `psc` WRITE;
/*!40000 ALTER TABLE `psc` DISABLE KEYS */;
INSERT INTO `psc` VALUES (1,'Data Coordinating Center','','','',0,'','','','','','DCC','','','Y');
/*!40000 ALTER TABLE `psc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `query_gui_downloadable_queries`
--

DROP TABLE IF EXISTS `query_gui_downloadable_queries`;
CREATE TABLE `query_gui_downloadable_queries` (
  `queryID` int(10) unsigned NOT NULL auto_increment,
  `query` text,
  `filename` varchar(255) default NULL,
  `userID` int(11) unsigned default NULL,
  `downloadDate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`queryID`),
  KEY `FK_query_gui_downloadable_queries_1` (`userID`),
  CONSTRAINT `FK_query_gui_downloadable_queries_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `query_gui_downloadable_queries`
--

LOCK TABLES `query_gui_downloadable_queries` WRITE;
/*!40000 ALTER TABLE `query_gui_downloadable_queries` DISABLE KEYS */;
/*!40000 ALTER TABLE `query_gui_downloadable_queries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `query_gui_stored_queries`
--

DROP TABLE IF EXISTS `query_gui_stored_queries`;
CREATE TABLE `query_gui_stored_queries` (
  `qid` int(10) unsigned NOT NULL auto_increment,
  `userID` int(11) unsigned NOT NULL default '0',
  `name` varchar(255) NOT NULL default '',
  `selected_fields` text,
  `conditionals` text,
  `conditionals_groups` text,
  `access` enum('private','public') NOT NULL default 'private',
  PRIMARY KEY  (`qid`),
  KEY `name` (`name`),
  KEY `FK_query_gui_stored_queries_1` (`userID`),
  CONSTRAINT `FK_query_gui_stored_queries_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `query_gui_stored_queries`
--

LOCK TABLES `query_gui_stored_queries` WRITE;
/*!40000 ALTER TABLE `query_gui_stored_queries` DISABLE KEYS */;
/*!40000 ALTER TABLE `query_gui_stored_queries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `query_gui_user_files`
--
DROP TABLE IF EXISTS `query_gui_user_files`;
CREATE TABLE query_gui_user_files (
    UserFileID integer auto_increment primary key,
    UserID integer REFERENCES users(ID),
    filename varchar(255),
    downloadDate timestamp DEFAULT CURRENT_TIMESTAMP,
    md5sum varchar(32),
    status enum('ready', 'packaging', 'expired')
);

--
-- Dumping data for table `query_gui_user_files`
--

LOCK TABLES `query_gui_user_files` WRITE;
/*!40000 ALTER TABLE `query_gui_user_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `query_gui_user_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `CandID` int(6) NOT NULL default '0',
  `CenterID` tinyint(2) unsigned default NULL,
  `VisitNo` smallint(5) unsigned default NULL,
  `Visit_label` varchar(255) default NULL,
  `SubprojectID` int(11) default NULL,
  `Submitted` enum('Y','N') default NULL,
  `Current_stage` enum('Not Started','Screening','Visit','Approval','Subject','Recycling Bin') default NULL,
  `Date_stage_change` date default NULL,
  `Screening` enum('Pass','Failure','Withdrawal','In Progress') default NULL,
  `Date_screening` date default NULL,
  `Visit` enum('Pass','Failure','Withdrawal','In Progress') default NULL,
  `Date_visit` date default NULL,
  `Approval` enum('In Progress','Pass','Failure') default NULL,
  `Date_approval` date default NULL,
  `Active` enum('Y','N') NOT NULL default 'Y',
  `Date_active` date default NULL,
  `RegisteredBy` varchar(255) default NULL,
  `UserID` varchar(255) NOT NULL default '',
  `Date_registered` date default NULL,
  `Testdate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `Hardcopy_request` enum('-','N','Y') NOT NULL default '-',
  `BVLQCStatus` enum('Complete') default NULL,
  `BVLQCType` enum('Visual','Hardcopy') default NULL,
  `BVLQCExclusion` enum('Excluded','Not Excluded') default NULL,
  `QCd` enum('Visual','Hardcopy') default NULL,
  `Scan_done` enum('N','Y') default NULL,
  `MRIQCStatus` enum('','Pass','Fail') NOT NULL default '',
  `MRIQCPending` enum('Y','N') NOT NULL default 'N',
  `MRIQCFirstChangeTime` datetime default NULL,
  `MRIQCLastChangeTime` datetime default NULL,
  PRIMARY KEY  (`ID`),
  KEY `session_candVisit` (`CandID`,`VisitNo`),
  KEY `FK_session_2` (`CenterID`),
  CONSTRAINT `FK_session_2` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `FK_session_1` FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Table holding session information';

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarchive`
--

DROP TABLE IF EXISTS `tarchive`;
CREATE TABLE `tarchive` (
  `DicomArchiveID` varchar(255) NOT NULL default '',
  `PatientID` varchar(255) NOT NULL default '',
  `PatientName` varchar(255) NOT NULL default '',
  `PatientDoB` date NOT NULL default '0000-00-00',
  `PatientGender` varchar(255) default NULL,
  `neurodbCenterName` varchar(255) default NULL,
  `CenterName` varchar(255) NOT NULL default '',
  `LastUpdate` datetime NOT NULL default '0000-00-00 00:00:00',
  `DateAcquired` date NOT NULL default '0000-00-00',
  `DateFirstArchived` datetime default NULL,
  `DateLastArchived` datetime default NULL,
  `AcquisitionCount` int(11) NOT NULL default '0',
  `NonDicomFileCount` int(11) NOT NULL default '0',
  `DicomFileCount` int(11) NOT NULL default '0',
  `md5sumDicomOnly` varchar(255) default NULL,
  `md5sumArchive` varchar(255) default NULL,
  `CreatingUser` varchar(255) NOT NULL default '',
  `sumTypeVersion` tinyint(4) NOT NULL default '0',
  `tarTypeVersion` tinyint(4) default NULL,
  `SourceLocation` varchar(255) NOT NULL default '',
  `ArchiveLocation` varchar(255) default NULL,
  `ScannerManufacturer` varchar(255) NOT NULL default '',
  `ScannerModel` varchar(255) NOT NULL default '',
  `ScannerSerialNumber` varchar(255) NOT NULL default '',
  `ScannerSoftwareVersion` varchar(255) NOT NULL default '',
  `SessionID` int(10) unsigned default NULL,
  `uploadAttempt` tinyint(4) NOT NULL default '0',
  `CreateInfo` text,
  `AcquisitionMetadata` longtext NOT NULL,
  `TarchiveID` int(11) NOT NULL auto_increment,
  `DateSent` datetime DEFAULT NULL,
  `PendingTransfer` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY  (`TarchiveID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tarchive`
--

LOCK TABLES `tarchive` WRITE;
/*!40000 ALTER TABLE `tarchive` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarchive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarchive_files`
--

DROP TABLE IF EXISTS `tarchive_files`;
CREATE TABLE `tarchive_files` (
  `TarchiveFileID` int(11) NOT NULL auto_increment,
  `TarchiveID` int(11) NOT NULL default '0',
  `SeriesNumber` int(11) default NULL,
  `FileNumber` int(11) default NULL,
  `EchoNumber` int(11) default NULL,
  `SeriesDescription` varchar(255) default NULL,
  `Md5Sum` varchar(255) NOT NULL,
  `FileName` varchar(255) NOT NULL,
  PRIMARY KEY  (`TarchiveFileID`),
  KEY `TarchiveID` (`TarchiveID`),
  CONSTRAINT `tarchive_files_ibfk_1` FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tarchive_files`
--

LOCK TABLES `tarchive_files` WRITE;
/*!40000 ALTER TABLE `tarchive_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarchive_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarchive_series`
--

DROP TABLE IF EXISTS `tarchive_series`;
CREATE TABLE `tarchive_series` (
  `TarchiveSeriesID` int(11) NOT NULL auto_increment,
  `TarchiveID` int(11) NOT NULL default '0',
  `SeriesNumber` int(11) NOT NULL default '0',
  `SeriesDescription` varchar(255) default NULL,
  `SequenceName` varchar(255) default NULL,
  `EchoTime` double default NULL,
  `RepetitionTime` double default NULL,
  `InversionTime` double default NULL,
  `SliceThickness` double default NULL,
  `PhaseEncoding` varchar(255) default NULL,
  `NumberOfFiles` int(11) NOT NULL default '0',
  `SeriesUID` varchar(255) default NULL,
  PRIMARY KEY  (`TarchiveSeriesID`),
  KEY `TarchiveID` (`TarchiveID`),
  CONSTRAINT `tarchive_series_ibfk_1` FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tarchive_series`
--

LOCK TABLES `tarchive_series` WRITE;
/*!40000 ALTER TABLE `tarchive_series` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarchive_series` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_battery`
--

DROP TABLE IF EXISTS `test_battery`;
CREATE TABLE `test_battery` (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `Test_name` varchar(255) NOT NULL default '',
  `AgeMinDays` int(10) unsigned default NULL,
  `AgeMaxDays` int(10) unsigned default NULL,
  `Active` enum('Y','N') NOT NULL default 'Y',
  `Stage` varchar(255) default NULL,
  `SubprojectID` int(11) default NULL,
  `Visit_label` varchar(255) default NULL,
  `CenterID` int(11) default NULL,
  `firstVisit` enum('Y','N') NOT NULL default 'N',
  PRIMARY KEY  (`ID`),
  KEY `age_test` (`AgeMinDays`,`AgeMaxDays`,`Test_name`),
  KEY `FK_test_battery_1` (`Test_name`),
  CONSTRAINT `FK_test_battery_1` FOREIGN KEY (`Test_name`) REFERENCES `test_names` (`Test_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `test_battery`
--

LOCK TABLES `test_battery` WRITE;
/*!40000 ALTER TABLE `test_battery` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_battery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_names`
--

DROP TABLE IF EXISTS `test_names`;
CREATE TABLE `test_names` (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `Test_name` varchar(255) default NULL,
  `Full_name` varchar(255) default NULL,
  `Sub_group` int(11) unsigned default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Test_name` (`Test_name`),
  KEY `FK_test_names_1` (`Sub_group`),
  CONSTRAINT `FK_test_names_1` FOREIGN KEY (`Sub_group`) REFERENCES `test_subgroups` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `test_names`
--

LOCK TABLES `test_names` WRITE;
/*!40000 ALTER TABLE `test_names` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_names` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_subgroups`
--

DROP TABLE IF EXISTS `test_subgroups`;
CREATE TABLE `test_subgroups` (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `Subgroup_name` varchar(255) default NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `test_subgroups`
--

LOCK TABLES `test_subgroups` WRITE;
/*!40000 ALTER TABLE `test_subgroups` DISABLE KEYS */;
INSERT INTO test_subgroups VALUES (1, 'Instruments');
/*!40000 ALTER TABLE `test_subgroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_perm_rel`
--

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

LOCK TABLES `user_perm_rel` WRITE;
/*!40000 ALTER TABLE `user_perm_rel` DISABLE KEYS */;
INSERT INTO `user_perm_rel` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16);
/*!40000 ALTER TABLE `user_perm_rel` ENABLE KEYS */;
UNLOCK TABLES;

CREATE TABLE `Visit_Windows` (
  `Visit_label` varchar(255) DEFAULT NULL,
  `WindowMinDays` int(11) DEFAULT NULL,
  `WindowMaxDays` int(11) DEFAULT NULL,
  `OptimumMinDays` int(11) DEFAULT NULL,
  `OptimumMaxDays` int(11) DEFAULT NULL,
  `WindowMidpointDays` int(11) DEFAULT NULL
);
--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `UserID` varchar(255) NOT NULL default '',
  `Password` varchar(255) default NULL,
  `Real_name` varchar(255) default NULL,
  `First_name` varchar(255) default NULL,
  `Last_name` varchar(255) default NULL,
  `Degree` varchar(255) default NULL,
  `Position_title` varchar(255) default NULL,
  `Institution` varchar(255) default NULL,
  `Department` varchar(255) default NULL,
  `Address` varchar(255) default NULL,
  `City` varchar(255) default NULL,
  `State` varchar(255) default NULL,
  `Zip_code` varchar(255) default NULL,
  `Country` varchar(255) default NULL,
  `Fax` varchar(255) default NULL,
  `Email` varchar(255) NOT NULL default '',
  `CenterID` tinyint(2) unsigned NOT NULL default '0',
  `Privilege` tinyint(1) NOT NULL default '0',
  `PSCPI` enum('N','Y') NOT NULL default 'N',
  `DBAccess` varchar(10) NOT NULL default '',
  `Active` enum('Y','N') NOT NULL default 'Y',
  `Examiner` enum('Y','N') NOT NULL default 'N',
  `Password_md5` varchar(34) default NULL,
  `Password_expiry` date NOT NULL default '0000-00-00',
  `Pending_approval` tinyint(1) default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `UserID` (`UserID`),
  KEY `FK_users_1` (`CenterID`),
  CONSTRAINT `FK_users_1` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin',NULL,'Admin account',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',1,0,'N','','Y','N','4817577f267cc8bb20c3e58b48a311b9f6','2006-11-27',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

DROP TABLE IF EXISTS `mri_protocol_violated_scans`;
CREATE TABLE `mri_protocol_violated_scans` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `CandID` int(6),
  `PSCID` varchar(255),
  `time_run` datetime,
  `series_description` varchar(255) DEFAULT NULL,
   minc_location varchar(255),
   PatientName varchar(255) DEFAULT NULL,
  `TR_range` varchar(255) DEFAULT NULL,
  `TE_range` varchar(255) DEFAULT NULL,
  `TI_range` varchar(255) DEFAULT NULL,
  `slice_thickness_range` varchar(255) DEFAULT NULL,
  `xspace_range` varchar(255) DEFAULT NULL,
  `yspace_range` varchar(255) DEFAULT NULL,
  `zspace_range` varchar(255) DEFAULT NULL,
  `xstep_range` varchar(255) DEFAULT NULL,
  `ystep_range` varchar(255) DEFAULT NULL,
  `zstep_range` varchar(255) DEFAULT NULL,
  `time_range` varchar(255)  DEFAULT NULL,
  `SeriesUID` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`ID`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `conflicts_unresolved` (
      `ConflictID` int(10) NOT NULL AUTO_INCREMENT,
      `TableName` varchar(255) NOT NULL,
      `ExtraKeyColumn` varchar(255) DEFAULT NULL,
      `ExtraKey1` varchar(255) NOT NULL,
      `ExtraKey2` varchar(255) NOT NULL,
      `FieldName` varchar(255) NOT NULL,
      `CommentId1` varchar(255) NOT NULL,
      `Value1` varchar(255) DEFAULT NULL,
      `CommentId2` varchar(255) NOT NULL,
      `Value2` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`ConflictID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `conflicts_resolved` (
      `ResolvedID` int(10) NOT NULL AUTO_INCREMENT,
      `UserID` varchar(255) NOT NULL,
      `ResolutionTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      `User1` varchar(255) DEFAULT NULL,
      `User2` varchar(255) DEFAULT NULL,
      `TableName` varchar(255) NOT NULL,
      `ExtraKeyColumn` varchar(255) DEFAULT NULL,
      `ExtraKey1` varchar(255) NOT NULL DEFAULT '',
      `ExtraKey2` varchar(255) NOT NULL DEFAULT '',
      `FieldName` varchar(255) NOT NULL,
      `CommentId1` varchar(255) NOT NULL,
      `CommentId2` varchar(255) NOT NULL,
      `OldValue1` varchar(255) DEFAULT NULL,
      `OldValue2` varchar(255) DEFAULT NULL,
      `NewValue` varchar(255) DEFAULT NULL,
      `ConflictID` int(10) DEFAULT NULL,
      PRIMARY KEY (`ResolvedID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `tarchive_find_new_uploads` (
      `CenterName` varchar(255) NOT NULL,
      `LastRan` datetime DEFAULT NULL,
      PRIMARY KEY (`CenterName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- Table structure for table `session_status`
--

DROP TABLE IF EXISTS `session_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session_status` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `SessionID` int(11) NOT NULL,
  `Name` varchar(64) NOT NULL,
  `Value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `session_status_index` (`SessionID`,`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_status`
--

LOCK TABLES `session_status` WRITE;
/*!40000 ALTER TABLE `session_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `session_status` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2008-04-16 21:15:00




--
-- Table structure for table `parameter_type_override`
--

DROP TABLE IF EXISTS `parameter_type_override`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parameter_type_override` (
  `Name` varchar(255) NOT NULL,
  `Description` text,
  PRIMARY KEY (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parameter_type_override`
--

LOCK TABLES `parameter_type_override` WRITE;
/*!40000 ALTER TABLE `parameter_type_override` DISABLE KEYS */;
/*!40000 ALTER TABLE `parameter_type_override` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-08-21 16:13:53


-- This table needs to be MyISAM because InnoDB doesn't
-- support full text indexes
CREATE TABLE `help` (
    `helpID` int(10) unsigned NOT NULL AUTO_INCREMENT, 
    `parentID` int(11) NOT NULL DEFAULT '-1',
    `hash` varchar(32) DEFAULT NULL,
    `topic` varchar(100) NOT NULL DEFAULT '',
    `content` text NOT NULL,
    `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
    `updated` datetime DEFAULT NULL, PRIMARY KEY (`helpID`), 
    UNIQUE KEY `hash` (`hash`), 
    FULLTEXT KEY `topic` (`topic`), 
    FULLTEXT KEY `content` (`content`)
) ENGINE=MYISAM DEFAULT CHARSET=utf8;

CREATE TABLE `help_related_links` (
    `helpID` int(10) unsigned NOT NULL DEFAULT '0',
    `relatedID` int(10) unsigned NOT NULL DEFAULT '0', 
    PRIMARY KEY (`helpID`,`relatedID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `data_integrity_flag`
--

DROP TABLE IF EXISTS `data_integrity_flag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_integrity_flag` (
  `dataflag_id` int(11) NOT NULL AUTO_INCREMENT,
  `dataflag_visitlabel` varchar(255) NOT NULL,
  `dataflag_instrument` varchar(255) NOT NULL,
  `dataflag_date` date NOT NULL,
  `dataflag_status` int(11) NOT NULL,
  `dataflag_comment` text,
  `latest_entry` tinyint(1) NOT NULL DEFAULT '1',
  `dataflag_fbcreated` int(11) NOT NULL DEFAULT '0',
  `dataflag_fbclosed` int(11) NOT NULL DEFAULT '0',
  `dataflag_fbcomment` int(11) NOT NULL DEFAULT '0',
  `dataflag_fbdeleted` int(11) NOT NULL DEFAULT '0',
  `dataflag_userid` varchar(255) NOT NULL,
  PRIMARY KEY (`dataflag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_integrity_flag`
--

LOCK TABLES `data_integrity_flag` WRITE;
/*!40000 ALTER TABLE `data_integrity_flag` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_integrity_flag` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

CREATE TABLE `final_radiological_review` (
      `CommentID` varchar(255) NOT NULL,
      `Review_Done` enum('yes','no','not_answered') DEFAULT NULL,
      `Final_Review_Results` enum('normal','abnormal','atypical','not_answered') DEFAULT NULL,
      `Final_Exclusionary` enum('exclusionary','non_exclusionary','not_answered') DEFAULT NULL,
      `SAS` int(11) DEFAULT NULL,
      `PVS` int(11) DEFAULT NULL,
      `Final_Incidental_Findings` text,
      `Final_Examiner` int(11) DEFAULT NULL,
      `Final_Review_Results2` enum('normal','abnormal','atypical','not_answered') DEFAULT NULL,
      `Final_Examiner2` int(11) DEFAULT NULL,
      `Final_Exclusionary2` enum('exclusionary','non_exclusionary','not_answered') DEFAULT NULL,
      `Review_Done2` tinyint(1) DEFAULT NULL,
      `SAS2` int(11) DEFAULT NULL,
      `PVS2` int(11) DEFAULT NULL,
      `Final_Incidental_Findings2` text,
      `Finalized` enum('yes','no','not_answered') DEFAULT NULL,
      PRIMARY KEY (`CommentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- Dump completed on 2012-10-05 10:49:10

CREATE TABLE participant_status_options (
        ID int(10) unsigned NOT NULL auto_increment,
        Description varchar(255) default NULL,
        Required boolean default NULL,
        PRIMARY KEY  (ID),
        UNIQUE KEY ID (ID) 
);
INSERT INTO participant_status_options (Description, Required) VALUES ('active', false), ('ineligible', true), ('withdrawal', true), ('death', false), ('other', true);

CREATE TABLE participant_status (
        ID int(10) unsigned NOT NULL auto_increment,
        CandID int(6) UNIQUE NOT NULL default '0',
        UserID varchar(255) default NULL,
        Examiner varchar(255) default NULL,
        entry_staff varchar(255) default NULL,
        data_entry_date timestamp NOT NULL,
        participant_status integer DEFAULT NULL REFERENCES participant_status_options(ID),
        reason_specify text default NULL,
        reason_specify_status enum('dnk','not_applicable','refusal','not_answered') default NULL,
        withdrawal_reasons enum('1_voluntary_withdrawal','2_lost_follow_up','3_other') default NULL,
        withdrawal_reasons_other_specify text default NULL,
        withdrawal_reasons_other_specify_status enum('dnk','not_applicable','refusal','not_answered') default NULL,
        PRIMARY KEY  (ID),
        UNIQUE KEY ID (ID) 
);


--
-- Table structure for table `certification`
--

DROP TABLE IF EXISTS `certification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `certification` (
  `certID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `examinerID` int(10) unsigned NOT NULL DEFAULT '0',
  `date_cert` date DEFAULT NULL,
  `visit_label` varchar(255) DEFAULT NULL,
  `testID` varchar(255) NOT NULL DEFAULT '',
  `pass` enum('not_certified','in_training','certified') DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`certID`,`testID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certification`
--

LOCK TABLES `certification` WRITE;
/*!40000 ALTER TABLE `certification` DISABLE KEYS */;
/*!40000 ALTER TABLE `certification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table `certification_history`
--

DROP TABLE IF EXISTS `certification_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `certification_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `col` varchar(255) NOT NULL DEFAULT '',
  `old` text,
  `old_date` date DEFAULT NULL,
  `new` text,
  `new_date` date DEFAULT NULL,
  `primaryCols` varchar(255) DEFAULT 'certID',
  `primaryVals` text,
  `testID` int(3) DEFAULT NULL,
  `visit_label` varchar(255) DEFAULT NULL,
  `changeDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userID` varchar(255) NOT NULL DEFAULT '',
  `type` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `files_intermediary`
--

DROP TABLE IF EXISTS `files_intermediary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `files_intermediary` (
  `IntermedID` int(11) NOT NULL AUTO_INCREMENT,
  `Output_FileID` int(10) unsigned NOT NULL,
  `Input_FileID` int(10) unsigned NOT NULL,
  `Tool` varchar(255) NOT NULL,
  PRIMARY KEY (`IntermedID`),
  KEY `FK_files_intermediary_1` (`Output_FileID`),
  KEY `FK_files_intermediary_2` (`Input_FileID`),
  CONSTRAINT `FK_files_intermediary_1` FOREIGN KEY (`Output_FileID`) REFERENCES `files` (`FileID`),
  CONSTRAINT `FK_files_intermediary_2` FOREIGN KEY (`Input_FileID`) REFERENCES `files` (`FileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `project_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_rel` (
  `ProjectID` int(2) DEFAULT NULL,
  `SubprojectID` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_account_history` (
ID int(10) unsigned NOT NULL AUTO_INCREMENT,
UserID varchar(255) NOT NULL DEFAULT '',
PermID int(10) unsigned DEFAULT NULL,
PermAction enum('I','D') DEFAULT NULL,
ChangeDate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `help` VALUES (1,-1,NULL,'LORIS HELP: Using the Database','Welcome to LORIS database. The help section provides you with guidelines for adding and updating information in the database.\r\n\r\nUpon logging on to the Loris Database on the home page the user’s information can automatically be seen at the top of the screen, indicating the User’s Name, the site from which the user belongs to, and the current date.\r\n\r\nThe tabs spanning horizontally along the page represent different features within the database that allow data acquisition and storage to processing and dissemination using the web based interface. ','0000-00-00 00:00:00','2013-04-17 03:37:39'),(2,-1,NULL,'HOW TO - Guide','Under Construction.Please visit us later','0000-00-00 00:00:00',NULL),(3,-1,NULL,'Guidelines','Under Construction.Please visit us later','0000-00-00 00:00:00',NULL),(5,-1,NULL,'Instruments - Guide','For a given time-point a list of study-specific measures are administered to recruited candidates. The instrument list is automatically populated for candidates based on pre-defined battery. \r\n\r\nThe instrument list page for every candidate provides information such:\r\n\r\nData Entry status: this shows whether all mandatory fields for the instrument have been entered or not \r\nAdministration status : this shows whether or not the instrument was administered to the candidate. \r\nDouble Data Entry: clicking on the Double Data Entry allows staff to enter the same data second time to ensure no mistakes occur while data entry. Any conflicts between the first entry and Double Data Entry can be resolved in the Conflict Resolver Module. \r\nDouble Data Entry Status: this shows whether the data entry for Double Data Entry was entered or not.  ','0000-00-00 00:00:00','2013-08-15 01:39:04'),(6,-1,'7292dd87f9a200f21bf40ded779a582c','Hand Preference','Under Construction.Please visit us later','2013-04-05 00:00:00',NULL),(7,-1,'360c8799d4ab4968ca39eea832db7907','New Profile','The New Profile tab allows the authorized user to register a new candidate at a specific site.  The Date of Birth field is mandatory and it is required to be entered twice in-order to minimize error in data entry. Other fields are custom to the project and can be configured to be drop down fields or user input fields. Once all the required data is entered, users can click on the “Create” button to finish registration. It is crucial that no mistakes in data entry are made at this point, as this information cannot be modified after clicking the “Create” button.\r\n\r\nEach new candidate will then be assigned two identifiers: a 6-digit DCC-ID and an alphanumeric PSC-ID typically comprised of a site-specific code, followed by a numeric code (e.g., AAA0000). These two IDs will always be used to identify this candidate. From there, new time-points can be added to the candidate, also referred to as “Visit labels”.','2013-04-05 00:00:00','2013-04-17 03:38:33'),(8,-1,'dd972565b83f01e75be0344d0f0777c7','Access Profile','The Access Profile tab allows the user to efficiently search for a candidate and access the related data. There are several ways to search for a candidate: \r\n\r\n<u>Option 1:</u>  Using DCCID and PSCID\r\nA specific profile can be accessed by entering both the DCCID and PSCID in the white boxes at the top of the screen and clicking the button “Open Profile”.\r\n\r\n<u>Option2:</u> Using Selection Filter\r\nCandidates can be segregated by using various dropdown options such as Site, Project, Subprojects, Gender etc and then clicking the button “Show Data”. A list of profiles will appear below the Selection Filter box based on the user’s selection criteria. If a \"No candidates found\" message appears, this means that no profiles matched the information specified by the selection filter. Depending on the magnitude of the search, there may be more than one page of search results that the user can look through.\r\n\r\n<b>To Access a Profile:</b>\r\nA candidate’s profile can be accessed by clicking on the PSCID outlined in blue text. The form remembers previously selected data so that when the user returns to the Access Profile menu, the selection filter will automatically select profiles according to the last selection settings.  ','2013-04-05 00:00:00','2013-04-17 03:41:33'),(9,-1,'464fe4ea0557b9c34b4ef33c135f6a08','Reliability Module','The Reliability Coding Module was designed to allow users across and within sites to be confident in the scoring of data, thus improving the integrity of the data within the database on an on-going basis. Reliability immediately brings forward any discrepancies in instrument administration or data reports, as well as helping reduce human-error within data reports. Under the Reliability Coding tab, the user can apply the selection filter to narrow down candidates of interest. A list of log entries will appear that organizes candidates by PSCID, the site of reliability, cohort, DCCID, gender, visit label, instrument, reliability score and an indication of whether the chosen candidate has reliable data.\r\n\r\nOnce the user has completed a search within the Reliability Module, the user can click on the PSCID of the candidate for the instrument in question. The data entry screen for that selected candidate and timepoint will appear, and the second rater can enter his/her data. The database will automatically compare the newly entered data to that entered by the first rater and calculate a reliability score. This score can then be viewed on the main reliability page under the “Reliability Score” Column. The “Reliable” Column shows the user whether the reliability score surpasses the established threshold for reliability by being marked as “Yes” in green if the candidate is reliable or “No” in red if the candidate did not pass reliability. If the candidate had been flagged as invalid, the user will see a note in red text beside the PSCID.\r\n \r\nFor each instrument configured under the module, the user will see a table listing the reliability status of each rater (e.g. “Yes” or “In progress”), as well as the date at which reliability was established, date at which the tape was sent, date at which Feedback was received, whether the rater is outside the research group and Administration status (e.g., “Current” or “No”). The criteria required for a candidate to be considered reliable is outlined below the heading of each instrument.\r\n','2013-04-05 00:00:00','2013-04-17 03:47:57'),(10,-1,'c0383bfcc0ed053e2efe63c79a68976a','Conflict Resolver Module','The “Conflict Resolver” tool allows users to view and keep track of any discrepancies that may arise between initial data entry and double data entry forms. The Conflicts Resolver Module has a Selection Filter function to allow users to search for a particular subject and/or instrument. By clicking the button “Show Data” after selecting certain search options, a grey box will appear containing all the search results, which are  organized by the blue headers “Instrument”, “DCCID”, “PSCID”, “Visit Label”, “Question”, and “Correct Answer”. If the user is confident that the data for the particular question of interest is consistent among the two data entry forms, the user can select the appropriate answer from the drop-down menu under the “Correct Answer” column to resolve the issue. Otherwise, the drop-down menu is left as “Unresolved”, serving as a message to other users that an issue still exists.','2013-04-05 00:00:00','2013-04-17 03:48:29'),(11,-1,'2a522424a48073dcf12e783d7210513c','Radiological Reviews Module','The user can view the radiological review status for each candidate and corresponding visit label through the “Radiological Reviews” tab.\r\n\r\n<b>To Access Reviews:</b>\r\n Set appropriate filters in the Selection Filter box and click the “Show Data” button to retrieve a list of the search results. The results are categorized by column by the candidate’s IDs, date of birth, visit label, review completion status, results (e.g., normal, atypical), exclusionary status and custom fields such as subarachnoid spaces (SAS) status (e.g., none, mild, minimal), perivascular spaces (PVS) and any further comments. There is a column addressing whether any conflict exists between final and extra reviews, which can be found under the blue heading “Conflict”. Next to this column, the user will find whether the review was finalized. The user may click on any of the blue titles to sort the column in ascending or descending order.\r\n\r\nBy clicking on a PSCID and opening that candidate’s file, the user can access the radiological review. If a conflict exists between the original and final review, a warning will appear at the top of the screen in red text. General Information, such as PSCID, DCCID, visit label, and DICOM folder can be easily viewed from the Final Radiological Review page. The user can directly access this candidate’s MRI Browser page or Final Radiological Review by following the links next to “Go to:” under the General Information section. Details of the candidate’s radiological review at that particular time-point can be viewed in the box under the navy blue heading “Review Values”. Any changes made to the record will be documented in the box following the heading “Change Log”. ','2013-04-05 00:00:00','2013-04-17 03:47:09'),(12,-1,'9278907d66342544ba6e9e0aeb48d1b8','Data Dictionary','Designed to allow users to edit description for each of the fields of an instrument. ','2013-04-05 00:00:00','2013-04-26 11:23:49'),(13,-1,'b22de5be7bedb9ffc170dab37e178a38','Data Team Helper','Designed to allow users to see percentage completion status for each instrument. ','2013-04-05 00:00:00','2013-04-26 05:09:58'),(14,-1,'f1fd1913c968a1c383c88631e335a7ca','Certification Module','This module allows users to certify examiners on a per instrument basis. Only certified examiner are allowed to administer instruments to recruited candidates. ','2013-04-05 00:00:00','2013-04-26 05:13:28'),(15,-1,'d1e9a0eccc522c82d0d18ccef27b2ef2','Instrument Builder','Under Construction.Please visit us later','2013-04-05 00:00:00',NULL),(16,-1,'7a98aa2b5edd0984895a20f875207ce9','Candidate Profile','The database facilitates data collection of longitudinal studies, so each candidate may have several time-points or “visit labels”. The time-points refer to data collection on different visits for the same candidate. Every time-point contains a subset of data collected at a given point of time with the intention to keep this subset in a tightly related group. \r\n\r\n\r\n<b>Creating a Candidate Time-point:</b>\r\nA new candidate time-point can be created by an authorized user by opening a specific profile and clicking “Create Time Point” under the “Actions” menu on the left-hand side of the screen. The user can then define the candidate’s subproject from the drop-down menu and the visit label. Examples of Subproject: Subject, Control; Visit Labels: V01, V02. It is also possible to have a Supplementary Time-point.\r\n\r\nIt is important to note that visit labels must be input in CAPITAL CASE. Once the user is ready to proceed, click the “Create Time Point” button. If the time point is successfully created, the user can go to the “Click here to continue” link, which will direct the user to the list of visits for this candidate. If the time-point has already been created for a candidate, a warning in red text will appear stating, “This visit label is not unique.”\r\n\r\n\r\n<b>Accessing a Time-point</b>\r\nOnce a candidate’s profile has been opened, the PSCID and DCCID will remain at the top of the screen in white text on a navy banner for the user’s convenience. Below the candidate’s information, the user will find a list of time points. As indicated on the screen, the profile for the candidate at a certain time point can be opened by clicking on the visit label itself in navy text. \r\n\r\nThe user will see some general information about the candidate near the top of the screen, such as gender, visit label, subproject and grant status. The status and date of each particular stage or visit can be viewed directly below, where status can be marked as either “Pass”, “Fail” or “Withdrawal”. Each candidate also has a specific battery of instruments, with the appropriate instruments for that time point. For each instrument, the user can see the progress that has been made with data entry, where the data entry can be marked as “Complete”, “In Progress” or left blank (indicating data entry has not been started yet). For the instruments that have double data entry, the status can likewise be marked as “Complete”, “In Progress” or left blank. The user can also view the administration status for a particular instrument, where administration can be marked as “All”, “Partial” or “Complete”.\r\n\r\nThe user can access a particular instrument by clicking on the test name to view or modify the candidate’s data. In order for data entry to be completed, Administration must be marked as “Complete”, “Partial” or “None” on the left-hand side bar. If the instrument includes a Validity measure, it will appear under the Administration information, where Validity can be marked as “Valid”, “Questionable” or “Invalid”. To complete the visit stage, data for every assigned instrument must be entered and saved. Once data for an instrument have been fully entered, Data Entry will be marked as “Complete” under the Data Entry heading in the Navigation panel. It is important to enter data in all required fields, otherwise the database will not allow the user to proceed with completing data entry.','0000-00-00 00:00:00','2013-04-17 03:46:13'),(20,-1,'md5(data_team_helper)','Data Completion','','0000-00-00 00:00:00',NULL),(18,9,NULL,'Swap Candidates','The reliability module takes a random sample of candidates, but the user can replace a candidate from the random sampling using the \"Swap Candidates\" function. The user enters the PSCID of the candidate and Visit to discard with the PSCID and visit label of the candidate chosen. Once the swap is completed, the candidate can be identified by word \'Manual\' in red on the reliability main page. \r\n','2013-04-18 11:54:07','2013-08-15 12:51:33'),(19,12,NULL,'Put the topic here','Put the content here','2013-04-22 05:19:48',NULL),(21,-1,'md5(data_integrity_flag)','Instrument Verification Status','','0000-00-00 00:00:00',NULL),(22,-1,'md5(statistics)','Database Statistics','','0000-00-00 00:00:00',NULL),(23,-1,'a912a94d79b5124d876951f96ebb256f','Database Statistics','The Database statistics module calculates and displays statistics related to data acquisition, data processing, and data entry for both behavioural and imaging data collections. A brief description of demographics, MRI, and behavioural statistics can be found under the “General Description” tab.\r\n\r\n<b>Demographic Statistics</b>\r\n\r\nGeneral statistics can be retrieved from each site by using the drop-down menu under the first smaller navy heading “General Statistics” and clicking on the button “Submit”. Under General Statistics, the user will find the heading “Breakdown of Registered Candidates”, where a table outlines gender breakdowns per site, time-point and subproject ID. “Data Entry Completion Status” can be viewed for each instrument by selecting from the dropdown menu and clicking the button “Submit”. \r\n\r\n<b>Behavioural Statistics</b>\r\n\r\nThe user will first see a table labeled “Data Entry Statistics”, where each site and timepoint includes the headings “Completed”, “Created”, and “% Completion”. “Completed” refers to the total number of instruments that have been marked “Data Entry= Complete” and “Administration= None/Partial/All”. This column has its percentage counterpart under “% Completion”. “Created” refers to the total number of instruments that have been populated requiring data entry. The “Double Data Entry Statistics” table underneath rests on a similar premise as the “Data Entry Statistics” Table, but with regards to double data entry. In both of these tables, the user has the option of viewing “Per Instrument Stats” in the last column, by following the “Please Click Here” link. The user can then view which candidates have not completed data entry in each site. \r\n\r\nBy following the link, Completion Statistics for each site are displayed, and are organized by instrument and visit label. The “Completion Count” column displays the number of completed entries per instrument. From this column, the user has the option to follow the “View list” link to see a complete list of the candidates with completed data entry. Each PSCID that comes up in the list was designed to be a link itself to that particular candidate’s page for the selected instrument.\r\n\r\n<b>MRI Statistics</b>\r\n\r\nThe MRI Statistics tab opens with a “General MRI Statistics” table including information on acquired scans at each site. Within this table, the column “Scans on the Workstation” refers to the number of candidates that have scans on the study workstation at each site, whereas “Scans Claimed” refers to the candidates where the field “MR Scan Done” on the database has been marked as “Y”. \r\n\r\nThe following table refers to candidates with completed scans for all three timepoints, organized by site. The table holds statistics for the number of candidates with each type of scan completed.\r\n\r\nThe third table within the MRI Statistics Module allows the user to get a breakdown of statistics for candidates by time-point, based on the scan selected. The user can choose from T1, T2, T1 & T2, DTI, BOLD, and Spectroscopy scans to show the relative number of candidates with scans marked as “Complete”, “Partial”, or “None”. Under the column “Percent Complete”, the user can view the percentage of candidates for the scan of interest that have completed scans.\r\n\r\nAt the bottom of the page, there is a table listing “MRI Integrity Statistics” by site. The user can view the number of candidates that have “No Parameter Form Completed”, “Nothing in MRI Browser for Form” (the MRI Parameter form has been completed in this case but the MRI Browser is not populated), and “No t-archive Entry for form”. The user can go to the “Breakdown of Problems” column and select their site of interest to view candidates with incomplete MRI instrument data. By clicking on the candidate IDs, the user is then redirected to the appropriate MRI instrument for that candidate.  \r\n','0000-00-00 00:00:00','2013-04-26 11:35:17'),(24,-1,'244e3ba086ba825fdc1ba7f51f7b8f51','Instrument Verification Status','This module is designed to track the status for every instrument on a per visit basis. Users are allowed to set different time points for each instrument to indicate if an instrument is ready for review, review completion, feedback and finalization. \r\nClicking on the instrument takes you to the Data Completion Module that shows the percentage completion status for that instrument. ','0000-00-00 00:00:00','2013-04-26 11:38:57'),(25,-1,'2558562564eeb5bb2f741b35f94329ab','Document Repository','Allows users to add any type of document related to the project. ','0000-00-00 00:00:00','2013-04-26 11:40:27');

