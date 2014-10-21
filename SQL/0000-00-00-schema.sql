
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
  `ExternalID` varchar(255) default NULL,
  `DoB` date default NULL,
  `EDC` date default NULL,
  `Gender` enum('Male','Female') default NULL,
  `CenterID` tinyint(2) unsigned NOT NULL default '0',
  `ProjectID` int(11) default NULL,
  `Ethnicity` varchar(255) default NULL,
  `Active` enum('Y','N') NOT NULL default 'Y',
  `Date_active` date default NULL,
  `RegisteredBy` varchar(255) default NULL,
  `UserID` varchar(255) NOT NULL default '',
  `Date_registered` date default NULL,
  `flagged_caveatemptor` enum('true','false') default 'false',
  `flagged_reason` int(6),
  `flagged_other` varchar(255) default NULL,
  `flagged_other_status` enum('not_answered') default NULL,
  `Testdate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `Entity_type` enum('Human','Scanner') NOT NULL default 'Human',
  `ProbandGender` enum('Male','Female') DEFAULT NULL,
  `ProbandDoB` date DEFAULT NULL,
  PRIMARY KEY  (`CandID`),
  UNIQUE KEY `ID` (`ID`),
  UNIQUE KEY `ExternalID` (`ExternalID`),
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

--
-- Table structure for table `document_repository`
--

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
  `File_category` int(3) DEFAULT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `document_repository`
--

LOCK TABLES `document_repository` WRITE;
/*!40000 ALTER TABLE `document_repository` DISABLE KEYS */;
/*!40000 ALTER TABLE `document_repository` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_repository_categories`
--

DROP TABLE IF EXISTS `document_repository_categories`;
CREATE TABLE `document_repository_categories` (
  `id` int(3) unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) DEFAULT NULL,
  `parent_id` int(3) DEFAULT '0',
  `comments` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

LOCK TABLES `document_repository_categories` WRITE;
/*!40000 ALTER TABLE `document_repository_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `document_repository_categories` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `feedback_bvl_type` VALUES 
    (1,'Input','Input Errors'),
    (2,'Scoring','Scoring Errors');
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
INSERT INTO `feedback_mri_comment_types` VALUES 
    (1,'Geometric intensity','volume','a:2:{s:5:\"field\";s:19:\"Geometric_intensity\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}'),
    (2,'Intensity','volume','a:2:{s:5:\"field\";s:9:\"Intensity\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}'),
    (3,'Movement artifact','volume','a:2:{s:5:\"field\";s:30:\"Movement_artifacts_within_scan\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:6:\"Slight\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}'),
    (4,'Packet movement artifact','volume','a:2:{s:5:\"field\";s:34:\"Movement_artifacts_between_packets\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:6:\"Slight\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}'),
    (5,'Coverage','volume','a:2:{s:5:\"field\";s:8:\"Coverage\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:5:\"Limit\";i:4;s:12:\"Unacceptable\";}}'),	    (6,'Overall','volume',''),
    (7,'Subject','visit',''),	
    (8,'Dominant Direction Artifact (DWI ONLY)','volume','a:2:{s:5:"field";s:14:"Color_Artifact";s:6:"values";a:5:{i:0;s:0:"";i:1;s:4:"Good";i:2;s:4:"Fair";i:3;s:4:"Poor";i:4;s:12:"Unacceptable";}}'),
    (9,'Entropy Rating (DWI ONLY)','volume','a:2:{s:5:"field";s:7:"Entropy";s:6:"values";a:5:{i:0;s:0:"";i:1;s:10:"Acceptable";i:2;s:10:"Suspicious";i:3;s:12:"Unacceptable";i:4;s:13:"Not Available";}}');
/*!40000 ALTER TABLE `feedback_mri_comment_types` ENABLE KEYS */;
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
INSERT INTO `feedback_mri_predefined_comments` VALUES 
	(1,2,'missing slices'),
	(2,2,'reduced dynamic range due to bright artifact/pixel'),
	(3,2,'slice to slice intensity differences'),
	(4,2,'noisy scan'),
	(5,2,'susceptibilty artifact above the ear canals.'),
	(6,2,'susceptibilty artifact due to dental work'),
	(7,2,'sagittal ghosts'),
	(8,3,'slight ringing artefacts'),
	(9,3,'severe ringing artefacts'),
	(10,3,'movement artefact due to eyes'),
	(11,3,'movement artefact due to carotid flow'),
	(12,4,'slight movement between packets'),
	(13,4,'large movement between packets'),
	(14,5,'Large AP wrap around, affecting brain'),
	(15,5,'Medium AP wrap around, no affect on brain'),
	(16,5,'Small AP wrap around, no affect on brain'),
	(17,5,'Too tight LR, cutting into scalp'),
	(18,5,'Too tight LR, affecting brain'),
	(19,5,'Top of scalp cut off'),
	(20,5,'Top of brain cut off'),
	(21,5,'Base of cerebellum cut off'),
	(22,5,'missing top third - minc conversion?'),
	(23,6,'copy of prev data'),
	(24,2,"checkerboard artifact"),
	(25,2,"horizontal intensity striping (Venetian blind effect, DWI ONLY)"),
	(26,2,"diagonal striping (NRRD artifact, DWI ONLY)"),
	(27,2,"high intensity in direction of acquisition"),
	(28,2,"signal loss (dark patches)"),
	(29,8,"red artifact"),
	(30,8,"green artifact"),
	(31,8,"blue artifact"),
	(32,6,"Too few remaining gradients (DWI ONLY)"),
	(33,6,"No b0 remaining after DWIPrep (DWI ONLY)"),
	(34,6,"No gradient information available from scanner (DWI ONLY)"),
	(35,6,"Incorrect diffusion direction (DWI ONLY)"),
	(36,6,"Duplicate series"),
	(37,3,"slice wise artifact (DWI ONLY)"),
	(38,3,"gradient wise artifact (DWI ONLY)");
/*!40000 ALTER TABLE `feedback_mri_predefined_comments` ENABLE KEYS */;
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
-- Table structure for table `mri_processing_protocol`
--

DROP TABLE IF EXISTS `mri_processing_protocol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mri_processing_protocol` (
  `ProcessProtocolID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ProtocolFile` varchar(255) NOT NULL DEFAULT '',
  `FileType` enum('xml','txt') DEFAULT NULL,
  `Tool` varchar(255) NOT NULL DEFAULT '',
  `InsertTime` int(10) unsigned NOT NULL DEFAULT '0',
  `md5sum` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`ProcessProtocolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


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
  `FileType` enum('mnc','obj','xfm','xfmmnc','imp','vertstat','xml','txt','nii','nii.gz') default NULL,
  `PendingStaging` tinyint(1) NOT NULL default '0',
  `InsertedByUserID` varchar(255) NOT NULL default '',
  `InsertTime` int(10) unsigned NOT NULL default '0',
  `SourcePipeline` varchar(255),
  `PipelineDate` date,
  `SourceFileID` int(10) unsigned DEFAULT '0',
  `ProcessProtocolID` int(11) unsigned, 
  `Caveat` tinyint(1) default NULL,
  `TarchiveSource` int(11) default NULL,
  PRIMARY KEY  (`FileID`),
  KEY `file` (`File`),
  KEY `sessionid` (`SessionID`),
  KEY `outputtype` (`OutputType`),
  KEY `filetype_outputtype` (`FileType`,`OutputType`),
  KEY `staging_filetype_outputtype` (`PendingStaging`,`FileType`,`OutputType`),
  KEY `AcquiIndex` (`AcquisitionProtocolID`,`SessionID`),
  CONSTRAINT `FK_files_2` FOREIGN KEY (`AcquisitionProtocolID`) REFERENCES `mri_scan_type` (`ID`),
  CONSTRAINT `FK_files_1` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
  CONSTRAINT `FK_files_3` FOREIGN KEY (`SourceFileID`) REFERENCES `files` (`FileID`),
  CONSTRAINT `FK_files_4` FOREIGN KEY (`ProcessProtocolID`) REFERENCES `mri_processing_protocol` (`ProcessProtocolID`)
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
INSERT INTO `mri_scan_type` VALUES 
    (40,'fMRI'),
    (41,'flair'),
    (44,'t1'),
    (45,'t2'),
    (46,'pd'),
    (47,'mrs'),
    (48,'dti'),
    (49,'t1relx'),
    (50,'dct2e1'),
    (51,'dct2e2'),
    (52,'scout'),
    (53,'tal_msk'),
    (54,'cocosco_cls'),
    (55,'clean_cls'),
    (56,'em_cls'),
    (57,'seg'),	
    (58,'white_matter'),
    (59,'gray_matter'),
    (60,'csf_matter'),
    (61,'nlr_masked'),
    (62,'pve'),
    (999,'unknown'),
    (1000,'NA');
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
INSERT INTO `notification_types` VALUES 
	(1,'mri new study',0,'New studies processed by the MRI upload handler'),
	(2,'mri new series',0,'New series processed by the MRI upload handler'),
	(3,'mri upload handler emergency',1,'MRI upload handler emergencies'),
	(4,'mri staging required',1,'New studies received by the MRI upload handler that require staging'),
	(5,'mri invalid study',0,'Incorrectly labelled studies received by the MRI upload handler'),
	(7,'hardcopy request',0,'Hardcopy requests'),
	(9,'visual bvl qc',0,'Timepoints selected for visual QC'),
	(10,'mri qc status',0,'MRI QC Status change');
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
INSERT INTO `parameter_type` VALUES 
	(1,'Selected','varchar(10)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0),
	(2,'Geometric_intensity','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0,0),
	(3,'Intensity','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0,0),
	(4,'Movement_artifacts_within_scan','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0,0),
	(5,'Movement_artifacts_between_packets','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0,0),
	(6,'Coverage','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0,0),
	(7,'md5hash','varchar(255)','md5hash magically created by NeuroDB::File',NULL,NULL,'parameter_file.Value','parameter_file',NULL,'quat_table_1',1,0),
	(8,'Color_Artifact','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0,0),
	(9,'Entropy','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0,0);
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

INSERT INTO parameter_type (Name, Type, Description, RangeMin, RangeMax, SourceField, SourceFrom, CurrentGUITable, Queryable, SourceCondition) 
VALUES ('candidate_label','text','Identifier_of_candidate',null,null,'PSCID','candidate',null,1,null);
INSERT INTO parameter_type (Name, Type, Description, RangeMin, RangeMax, SourceField, SourceFrom, CurrentGUITable, Queryable, SourceCondition) 
VALUES ('Visit_label','varchar(255)','Visit_label',null,null,'visit_label','session',null,1,null);
INSERT INTO parameter_type (Name, Type, Description, RangeMin, RangeMax, SourceField, SourceFrom, CurrentGUITable, Queryable, SourceCondition) 
VALUES  ('candidate_dob','date','Candidate_Dob',null,null,'DoB','candidate',null,1,null);

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
INSERT INTO `permissions` VALUES 
	(1,'superuser','There can be only one Highlander','1'),
	(2,'user_accounts','User management','2'),
	(3,'user_accounts_multisite','Across all sites create and edit users','2'),
	(4,'context_help','Edit help documentation','2'),
	(5,'bvl_feedback','Behavioural QC','1'),
	(6,'mri_feedback','Edit MRI feedback threads','2'),
	(7,'mri_efax','Edit MRI Efax files','2'),
	(8,'send_to_dcc','Send to DCC','2'),
	(9,'unsend_to_dcc','Reverse Send from DCC','2'),
	(10,'access_all_profiles','Across all sites access candidate profiles','2'),
	(11,'data_entry','Data entry','1'),
	(12,'certification','Certify examiners','2'),
	(13,'certification_multisite','Across all sites certify examiners','2'),
	(14,'timepoint_flag','Edit exclusion flags','2'),
	(15,'timepoint_flag_evaluate','Evaluate overall exclusionary criteria for the timepoint','2'),
	(16,'mri_safety','Review MRI safety form for accidental findings','2'),
	(17,'conflict_resolver','Resolving conflicts','2'),
	(18,'data_dict','Parameter Type description','2'),
	(19,'violated_scans','Violated Scans','2'),
	(20,'violated_scans_modifications','Editing the MRI protocol table (Violated Scans module)','2'),
	(21,'data_integrity_flag','Data Integrity Flag','2'),
	(22,'config','Edit configuration settings','2'),
	(23,'edit_final_radiological_review','Can edit final radiological reviews','2'),
	(24,'view_final_radiological_review','Can see final radiological reviews','2');

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
  `PSCArea` varchar(150),
  `Address` varchar(150),
  `City` varchar(150),
  `StateID` tinyint(2) unsigned,
  `ZIP` varchar(12),
  `Phone1` varchar(12),
  `Phone2` varchar(12),
  `Contact1` varchar(150),
  `Contact2` varchar(150),
  `Alias` char(3) NOT NULL default '',
  `MRI_alias` varchar(4) NOT NULL default '',
  `Account` varchar(8),
  `Study_site` enum('N','Y') default 'Y',
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
  `firstVisit` enum('Y','N') default NULL,
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
  `IsDirectEntry` boolean default NULL,
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

LOCK TABLES `user_perm_rel` WRITE, `permissions` READ;
/*!40000 ALTER TABLE `user_perm_rel` DISABLE KEYS */;
INSERT INTO `user_perm_rel` (userID, permID) SELECT DISTINCT 1, permID FROM permissions;
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
  `CenterID` tinyint(2) unsigned default NULL,
  `Privilege` tinyint(1) NOT NULL default '0',
  `PSCPI` enum('Y','N') NOT NULL default 'N',
  `DBAccess` varchar(10) NOT NULL default '',
  `Active` enum('Y','N') NOT NULL default 'Y',
  `Examiner` enum('Y','N') NOT NULL default 'N',
  `Password_md5` varchar(34) default NULL,
  `Password_expiry` date NOT NULL default '0000-00-00',
  `Pending_approval` enum('Y','N') default 'Y',
  `Doc_Repo_Notifications` enum('Y','N') default 'N',
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
INSERT INTO `users` (ID,UserID,Real_name,First_name,Last_name,Email,CenterID,Privilege,PSCPI,DBAccess,Active,Examiner,Password_md5,Password_expiry) 
VALUES (1,'admin','Admin account','Admin','account','admin@localhost',1,0,'N','','Y','N','4817577f267cc8bb20c3e58b48a311b9f6','2015-03-30');
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
    `projectContent` text DEFAULT NULL,
    `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
    `updated` datetime DEFAULT NULL, PRIMARY KEY (`helpID`), 
    UNIQUE KEY `hash` (`hash`), 
    FULLTEXT KEY `topic` (`topic`), 
    FULLTEXT KEY `content` (`content`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;


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
        parentID int(10) default NULL,
        PRIMARY KEY  (ID),
        UNIQUE KEY ID (ID) 
);
INSERT INTO `participant_status_options` VALUES 
	(1,'Active',0,NULL),
	(2,'Refused/Not Enrolled',0,NULL),
	(3,'Ineligible',0,NULL),
	(4,'Excluded',0,NULL),
	(5,'Inactive',1,NULL),
	(6,'Incomplete',1,NULL),
	(7,'Complete',0,NULL),
	(8,'Unsure',NULL,5),
	(9,'Requiring Further Investigation',NULL,5),
	(10,'Not Responding',NULL,5),
	(11,'Death',NULL,6),
	(12,'Lost to Followup',NULL,6);

CREATE TABLE participant_status (
        ID int(10) unsigned NOT NULL auto_increment,
        CandID int(6) UNIQUE NOT NULL default '0',
        UserID varchar(255) default NULL,
        Examiner varchar(255) default NULL,
        entry_staff varchar(255) default NULL,
        data_entry_date timestamp NOT NULL,
        participant_status integer DEFAULT NULL REFERENCES participant_status_options(ID),
        participant_suboptions integer DEFAULT NULL REFERENCES participant_status_options(ID),
        reason_specify text default NULL,
        reason_specify_status enum('dnk','not_applicable','refusal','not_answered') default NULL,
        study_consent enum('yes','no','not_answered') default NULL,
        study_consent_date date default NULL,
        study_consent_withdrawal date default NULL,
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

INSERT INTO `help` (helpID, parentID, hash, topic, content, created, updated) VALUES  (1,-1,md5('dashboard'),'LORIS HELP: Using the Database','Welcome to the LORIS database. \r\nThis Help section provides you with guidelines for adding and updating information in the database. On each page, click on the question-mark icon in the Menu Bar across the top of the screen to access detailed information specific to the page.\r\n\r\nUpon logging into the LORIS database, the user will come to the home page. Here, key user information can automatically be seen at the right-hand side of the Menu Bar at the top of the screen indicating the user’s name and the site to which the user belongs. To return to the home page at any time, the user can click on the “LORIS” button at the far left corner of the Menu Bar.\r\nThe menus spanning horizontally across the Menu Bar represent different categories of features within the database that allow data acquisition, storage, processing and dissemination using the web based interface. Please note that when accessing LORIS via tablet, mobile device, or in a narrow-width desktop browser window, these main menus will be hidden under the downward-pointing arrow icon in the Menu Bar. Clicking on this button will show or hide all main menus in a vertical list.\r\nThere are five main drop-down menus: Candidate, Clinical, Imaging, Reports and Admin. Hover over on each menu to display a list of features or modules, organized by category:\r\n- Candidate: New Profile, Access Profile\r\n- Clinical: Reliability Coding, Conflict Resolver, Certification, Document Repository\r\n- Imaging: Radiological Review, DICOM Archive, Imaging Browser, Imaging Uploader\r\n- Reports: Database Statistics, Data Dictionary, Data Querying Tool, Data Team Helper, Data Integrity Tool\r\n- Admin: User Accounts, Instrument Builder\r\n\r\nOn the right side of the Menu Bar there are two icons linking to the Feedback Module, a pencil on paper icon , and Help, a question mark icon. Each of these modules will open in a new pop-up window, or new tab on a mobile browser.\r\n\r\nAll five main menus, the two icons listed above, the user’s site and the user’s name are accessible from any page in LORIS, via the Menu Bar at the top of the screen. \r\n\r\nTo log out of the database, click on the username displayed at the right edge of the Menu Bar, and select the “Log Out” option from the drop-down menu. \r\n\r\nThe “My Preferences” feature, also listed in this menu, can be used to update certain user profile settings and change the user’s password. \r\n','2014-09-01 00:00:00',NULL),
(2,-1,NULL,'HOW TO - Guide','Under Construction. Please visit us later','0000-00-00 00:00:00',NULL),
(3,-1,NULL,'Guidelines','Under Construction. Please visit us later','0000-00-00 00:00:00',NULL),
(5,-1,NULL,'Instruments - Guide', 'For each instrument in a visit, the user needs to mark Administration as “All”, “Partial” or “None” and mark Data Entry as “Complete” in order to save the form. If the instrument includes a Validity flag, Validity needs to be marked as “Valid”, “Questionable” or “Invalid”. \r\nNote the administration status is an indication of whether a particular instrument was conducted at the given time point. Administration, Data Entry status (and Validity, if applicable) can be found within the far left panel. Data Entry is automatically marked as “In Progress” once the user opens an instrument form. \r\n\r\nThe “Top” or first page of each instrument requires the user to enter the “Date of Administration” and “Examiner”. “Date of administration” refers to the date the testing was performed. “Examiner” refers to the name of the person that performed the testing.\r\nSome instruments include all fields for data entry in one page, whereas other instruments include questions that have been organized onto different pages. These additional pages can be accessed through the far left panel under the heading “Subtests”. In order to mark Data Entry as “Complete”, all items across all pages need to be filled out. After completing data entry for a page, please click the button “Save Data”, found at the bottom of the page. Any items for which no data is entered in the paper form should be marked as “Not Answered” in the database. If this option is selected for any field, a note in golden text will appear indicating “Any entered data will not be saved”. Additional data entry for fields already marked with “not_answered” will also be disabled. \r\n\r\nAfter saving all data for a specific instrument, certain values specific to the instrument will be automatically calculated by the database and will appear on the first page of the form. For instance, “Candidate Age” is automatically calculated based on the amount of time that has passed between the “Date of Administration” and the Candidate’s Date of Birth (entered when the candidate’s profile was first created).\r\n\r\nOnce data for an instrument have been fully entered, and the “Administration” and “Validity” have been selected, Data Entry can be marked as “Complete” as previously mentioned. It is important to enter data in all required fields, otherwise the database will not allow the user to proceed with data entry completion. When viewing an Instrument Form in a narrow browser window or on a mobile device, the navigation panel typically found to the left is hidden. The instrument navigation panel contains the Administration Menu, the Validity Menu, the Data Entry Menu, and the Subtest Menu. Similar to the visit panel, it can be accessed and hidden by selecting the list icon at the left edge of the Menu Bar.\r\nLastly, the user can return to the visit through the white banner near the top of the screen and clicking “TimePoint <i>visit</i> Details”. ','2014-09-01 00:00:00',NULL),
(6,-1,'7292dd87f9a200f21bf40ded779a582c','Hand Preference','Under Construction. Please visit us later','2014-09-01 00:00:00',NULL),
(7,-1,md5('new_profile'),'New Profile','By clicking on “New Profile” under the Candidate Menu, users with appropriate permissions can register a new candidate for their study site. Once inside the “New Profile” page, the “Date of Birth” field must be entered twice, in order to minimize error in data entry. \r\nThe PSCID refers to an alphanumeric identifier entered by the user. This identifier is typically comprised of a site-specific code (e.g., AAA), followed by a numeric code specific to the candidate at that site (e.g., AAA0000). Other fields are customized for specific projects and can be configured as drop-down fields or user input fields. \r\n\r\nOnce all the required data fields are completed, the user can click on the “Create” button to finish registering the candidate. It is crucial that no mistakes in data entry are made at this point, as information cannot be modified after clicking the “Create” button. \r\n\r\nEach new candidate will then be assigned a 6 digit numerical DCC-ID. The DCCID, along with the previously entered PSCID, will always be used to identify this candidate.\r\n' ,'2014-09-01 00:00:00', NULL),
(8,-1,md5('candidate_list'),'Access Profile','In many cases, the candidate`s profile will already be created. The Access Profile module, also found under the Candidate menu, allows the user to efficiently search for an existing candidate and access the related data. \r\n\r\nThere are 3 main ways to search for a candidate:\r\n\r\n<u>Option 1:</u> Using PSC-ID and DCC-ID\r\nA specific candidate profile can be accessed directly by entering both the PSC-ID and the DCC-ID in the white boxes to the right of the screen and then clicking the button “Open Profile”. In a narrow browser window or mobile device the PSC-ID and DCC-ID fields are found below the selection filter.\r\n\r\n<u>Option 2:</u> Basic Filter Options\r\nUsers may search for particular candidates by selecting from the “Basic” filter options. Users may select from drop-down select boxes, and then click “Show Data” to view a list of candidates. If only a fragment of the candidate ID is known, the user may search for the profile by entering the known fragment, and then click show data to find the appropriate profile. For example, searching with “531” under “DCCID” will retrieve the profile of candidate DCC1107 (with full DCCID 531861).\r\n\r\n<u>Option 3:</u> Advanced Filter Options\r\nMore detailed filter options can be accessed by clicking on the “Advanced” button. Users will select from a number of drop-down select boxes including Site, Project, Subproject, Gender etc., and then click “Show Data” to view a list of candidates. To return to “Basic” selection filters please select “Basic”.\r\n\r\nTo view a specific candidate’s dataset, click on the candidate’s PSCID found in blue text under the “PSCID” column. At the top of the table, column headings will appear underlined and show a click icon when the user hovers over the heading title. Data can be sorted in ascending order according to a given column by clicking on the column heading (i.e. DCCID, Site, PSCID etc.), and by clicking again, in descending order. In both standard and mobile view, the selection filter can be hidden by selecting the upward arrow icon, allowing easier viewing of the data. Once in this view, users can click on the downward arrow icon to display the features of the selection filter once again. This feature applies to all pages that include a Selection Filter.\r\nNote that the form remembers previously selected data such that when the user returns to the “Access Profile” page, the selection filter will automatically select profiles according to the last selection settings. Depending on the magnitude of the search, there may be several pages of search results for the user to look through. If “No candidates found” appears, this indicates no profiles matched the information specified by the selection filter(s). \r\nWhen on a mobile device or narrow browser window, the table will have a slider at the bottom of the table, facilitating scrolling of the data. The user may also hover or click the arrows that flank the table to see the remainder of the table. When scrolling through search results, the PSC-ID column will freeze and remain displayed on the lefthand side, to allow for easy reference and access to relevant information.','2014-09-01 00:00:00',NULL),
(9,-1,md5('timepoint_list'),'Candidate Profile','The database facilitates data collection of longitudinal studies; following the same candidates at various intervals for long periods of time. Each candidate may have several time-points stretching the duration of the study. Each time-point will be given a name called a “Visit Label”. The time-points refer to data collection on different visits for the same candidate. Every time-point contains a subset of data collected in a given time frame with the intention of keeping this subset in a tightly related group. \r\n\r\nA new candidate time-point can be created from the Candidate Profile page by opening a specific profile and clicking “Create Time Point” among the Actions buttons visible above the “List of Visits” table. Authorized users may also edit general information about the candidate, such as adding comments and updating participant status, by clicking the “Edit Candidate Info” button.\r\n\r\nOnce a candidate’s profile has been opened, the PSC-ID and DCC-ID will remain at the top of the screen in white text on a banner for reference. Clicking on the candidate’s IDs in white will return the user to the Candidate Profile. \r\nBelow the candidate’s information, the user will find a list of time points under “Visit Label (Click to Open)”. Clicking on the time point itself in navy text can open the profile for the candidate at that time point.\r\n','2014-09-01 00:00:00',NULL),
(10,-1,md5('candidate_parameters'),'Candidate Parameters','The Candidate Parameters Page provides users an opportunity to add important general information about the candidate. There are three sections of the Candidate Parameters Page that can be updated as required by authorized users: “Candidate Information”, “Participant Status”, and “Participation Consent Status”. To return to the Candidate Profile, please click the “Return to timepoint list” button.','2014-09-01 00:00:00',NULL),
(11,10,md5('update_candidate_info'), 'Update Candidate Information', 'The Update Candidate Information Page allows users to document any additional comments about the candidate that may be important for analysis, as well as external identifiers. Please note the caveat emptor flag is set to “False” by default. A candidate with a unique case for data analysis should have the caveat emptor flag marked as “True”, with a reason for the flag specified through the drop-down option(s) provided, outlining the most common flagged cases for the study at hand, or through the text box field. Additional comments can also be entered. The user must “Save” the updates before navigating back to the Candidate Parameters page via the “Return to Candidate Info” button.','2014-09-01 00:00:00',NULL),
(12,10,md5('update_participant_status'), 'Participant Status', 'All candidates are marked as “Active” in the database by default. The participant status can be updated to one of the following options: Active, Refused/Not Enrolled, Ineligible, Excluded, Inactive, Incomplete, Complete.\r\n• Active: Candidate active in the study\r\n• Refused/Not Enrolled: Candidate recruited for the study but opted out\r\n• Ineligible: Candidate met exclusionary criterion/criteria during screening and was never scheduled for a visit\r\n• Excluded: Candidate was enrolled but met exclusionary criterion/criteria after starting the study (e.g. scan was reviewed as exclusionary by radiologist)\r\n• Inactive: Candidate continues to be part of the study but currently is inactive (e.g. Candidate is \"Unsure\" about continuing, \"Requiring further investigation\", or \"Not responding\")\r\n• Incomplete: Candidate has withdrawn.\r\n• Complete: Candidate has completed the study \r\nIf the candidate is listed as Inactive or Incomplete, a reason for the chosen status is required. Additional comments regarding the status can also be entered. The user must “Save” the updates before navigating back to the Candidate Parameters page via the button “Return to Candidate Info”.','2014-09-01 00:00:00',NULL),
(13,10,md5('update_consent_info'), 'Participation Consent Status', 'Updates can be made on the following participant consent status items:\r\n• Consent to Study: Users may choose from options “Yes/No”, based on whether written consent was obtained for the study\r\n• Date of Consent to Study: This field is required if Consent to Study=Yes. Users are required to enter the date to consent twice, to minimize error in data entry.\r\n• Date of Withdrawal of Consent to Study: Users are not required to enter anything in this field if the candidate did not retract their consent.\r\nSpecific projects require additional consent for collaborative projects and/or for specific procedures (i.e. consent to draw blood). The same consent status fields apply to any additional consent items pertaining to the study.\r\nPlease note that written consent is required prior to data entry in the database.','2014-09-01 00:00:00',NULL),
(14,-1,md5('instrument_list'), 'Time-Point Instrument List','Once inside a time point, the user will see some general information about the candidate across the top of the screen, such as gender, visit label, and subproject. The status of each particular visit can be viewed in the far left panel, where status can be marked as “Pass”, “Failure”, “Withdrawal”, or “In Progress”. “Send Time Point” is selected by the user to “Send to DCC”, and is the final step in completing data entry for a visit. \r\nThe “BVL QC Type” is used to record whether the Behavioural quality control was done on an electronic device or as a hard copy, and the “BVL QC Status” records if quality control has been completed. When viewing a visit in a narrow browser window or mobile device, this panel is hidden. The visit panel contains the Actions Menu, the Visit Stage, the Send Time Point, and QC Information. This menu can be opened for viewing or hidden by selecting the list icon at the top lefthand menu. \r\n\r\nEach time point carries a unique set of tests, also known as instruments. In addition to seeing the names of the instruments contained within each behavioural battery, users can view Administration and Data Entry Status, as well as whether any feedback exists for that particular instrument. Information about Double Data Entry progress can also be found within the behavioural battery table.  Click on any instrument name to open the instrument form and perform data entry. Double data entry can be performed by clicking on the \"Double Data Entry\" link for a given instrument.' ,'2014-09-01 00:00:00', NULL),
(15,-1,md5('reliability'), 'Reliability Coding','The Reliability Coding module was designed to allow users across and within sites to be confident in the scoring of data, thus improving the integrity of the data wit\r\nhin the database on an on-going basis. This module may not be employed by your study if it does not require inter-rater agreement. Reliability immediately brings forw\r\nard any discrepancies in instrument administration or data reports, as well as helping reduce human error within data reports. Under the Reliability Coding module, the user can apply the selection filter to narrow down candidates of interest. \r\nA list of entries will appear that organizes candidates by PSCID, the site of reliability, cohort, DCCID, gender, visit label, instrument, reliability score and an indication of whether the chosen candidate has reliable data. Note that certain headings (i.e. DCCID, Site, PSCID etc.) at the top of the table will become underlined and show a click icon when the user hovers over the heading title. These titles can be clicked to sort the table data; clicking more than once will toggle the sort order between ascending and descending order. On a narrow browser window or mobile device, this table has a slider bar at the bottom, as well as arrows flanking the sides for easy scrolling. In this tab, both the selection filter and the “Swap Candidates” feature (explained below) can be hidden by selecting the upward arrow icon to the right of the table title and reopened using the downward arrow icon. \r\n\r\nSwap Candidates: The candidates for whom reliability is available are selected at random by the database. However, in the case that a particular candidate lacks adequate data for reliability (e.g. poor quality video), another candidate can be manually selected using the ”Swap Candidates” feature. Upon clicking the “Swap Candidates” button next to the Selection Filter, users can input the information of the “Original Candidate” with insufficient data for reliability, and input a desired “Replacement Candidate”. The user can indicate the instrument in question and proceed to clicking “Swap Candidates”. \r\n\r\nOnce the user has completed a search within the Reliability Module, the user can click on the PSCID of the candidate for the instrument in question. The “Reliable” column shows the user whether the reliability score surpasses the established threshold for reliability by being marked as “Yes” in green if the candidate is reliable or “No” in red if the candidate did not pass reliability. If the candidate had been flagged as invalid, the user will see a note in red text beside the PSCID.\r\n \r\nFor each instrument configured under the module, the user will see a table listing the reliability status of each rater (e.g. “Yes” or “In progress”), as well as the date at which reliability was established, date at which the tape was sent, date at which Feedback was received, whether the rater is outside the research group and Administration status (e.g., “Current” or “No”). The criteria required for a candidate to be considered reliable is outlined below the heading of each instrument.\r\n\r\n<b>Entering Reliability Data</b>\r\nAfter clicking on a PSCID, a data entry screen will appear for second raters to enter data for the selected candidate and time point. The database will automatically compare the newly entered data to that entered by the first rater and calculate a reliability score. This score can then be viewed on the main reliability page under the “Reliability Score” Column.\r\n\r\n<b>After saving Reliability form</b>\r\nThis page displays all data that was previously entered in the reliability form. These are static and cannot be altered from this page. Users can directly access the initial data entry form through the Comment ID link in blue text under “Scoring”. Please use the Clinical Menu to navigate back to the Reliability Coding page.','2014-09-01 00:00:00',NULL),
(16,-1,md5('conflict_resolver'), 'Conflict Resolver','The Conflict Resolver tool allows users to view and keep track of any discrepancies that may arise between initial data entry and double data entry forms. Unresolved and Resolved conflicts are found on two separate tabs of the module. The Unresolved conflicts are displayed first upon accessing the Conflict Resolver module. The Conflict Resolver has a selection filter function to allow users to search for a particular subject and/or instrument. By clicking the button “Show Data” after selecting certain search options, the search results will be updated to reflect the selection filter criteria. The search results table is organized by the blue headers “Instrument”, “DCCID”, “PSCID”, “Visit Label”, “Question”, and “Correct Answer”. \r\nIf the user is confident that the data for the particular question of interest is consistent across the two data entry forms, the user can select the appropriate answer from the drop-down menu under the “Correct Answer” column and then click “Save” at the bottom of the table to resolve the issue. After refreshing the page, this newly resolved conflict will no longer appear under the Unresolved Conflicts tab, and will appear among the list of resolved conflicts on the second tab of the module. Similar to other pages of the database, the selection filter can be hidden by selecting upward arrow icon and reopened using the downward arrow icon.','2014-09-01 00:00:00',NULL),
(17,-1,md5('certification'), 'Certification','The Certification module allows the user to access and input information regarding examiners’ credentials. To view existing credentials, the user must select the examiner’s name outlined in navy text. \r\nThe Certification module also has a selection filter to allow users to search for a particular examiner or measure. The user may also create new credentials first by clicking “Add Certification”. Similar to other pages of the database, the selection filter can be hidden by selecting upward arrow icon and reopened using the downward arrow icon.','2014-09-01 00:00:00',NULL),
(18,17,md5('edit_event'), 'Add Certification','To add certification, the user must select an examiner from the drop down menu. The status of his/her training for various instruments must be selected as “Not Certified”, “In Training” or “Certified” and the date that the certification has been updated must be input. In order to store changes in certification the user must click “Save” after updating the examiner’s information. Note that certification updates for each examiner are recorded in a “Change Log”, just below the “Edit Certification Event” box.','2014-09-01 00:00:00',NULL),
(19,-1,md5('document_repository'), 'Document Repository', 'The Document Repository is a useful tool that provides multiple users with a centralized location for important documents relevant to the project. Files may be uploaded and organized under any user-defined category. Subcategories can also be defined by the user to be nested under parent categories. To view the previously uploaded files, the user must click on the appropriate category title to reveal a complete list of subcategories, and subsequently its files. Clicking on the file name outlined in blue will open these files. Various metadata at the file level may also be edited by selecting the corresponding “Edit” link and files can be deleted with the “Delete” link to the right of the desired file. Categories and uploaded files can have comments attached to them to provide additional information. To edit the comments of a specific category, hover over the ellipsis beside the title and click the text to make any necessary changes.\r\n\r\nSimilar to other modules in the LORIS database, the Document Repository has a Selection Filter with which the user may input search criteria, and select “Show Data” to locate specific documents. Clicking on the column headers serves to sort the data, consistent with other pages of the LORIS database. Clicking “Upload File” in the Selection Filter window enables the user to upload new and/or revised documents. Clicking \"Add Category\" allows a user to create a new category or subcategory to an existing parent category.','2014-09-01 00:00:00',NULL),
(20,-1,md5('final_radiological_review'), 'Radiological Review','The user can view the radiological review status for each candidate and corresponding visit label through the Radiological Review module.\r\n\r\n<b>To Access Reviews:</b>\r\nSet appropriate filters in the Selection Filter box and click the “Show Data” button to retrieve a list of the search results. The results are categorized by column by the candidate’s IDs, date of birth, visit label, review completion status, results (e.g., normal, atypical), exclusionary status and custom fields such as subarachnoid spaces (SAS) status (e.g., none, mild, minimal), perivascular spaces (PVS) and any further comments. This filter can be hidden by selecting the upward arrow icon and reopened using the downward arrow icon. In a narrow browser window or mobile device the table of search results will be displayed below the selection filter. \r\nIn the data table there is a column addressing whether any conflict exists between final and extra reviews, which can be found under the blue heading “Conflict”. Next to this column, the user will find whether the review was finalized. The user will see that hovering over each of the blue headings displays a click icon; if selected, the columns will sort in ascending or descending order. Note that clicking several times will reverse/change the sorting pattern. In addition, the table will fit to the browser size, and display a slide bar at the bottom as well as arrows flanking the table to ease data viewing. By clicking on a PSCID, the candidate’s file will be opened and the user can access the radiological review. \r\n<b>Within a Radiological Review</b> \r\nIf a conflict exists between the original and final review, a warning will appear at the top of the screen in red text. General Information, such as PSCID, DCCID, Visit Label, and DICOM folder can be easily viewed from the Final Radiological Review page. The user can directly access this candidate’s Imaging Browser page or Final Radiological Review by following the links next to “Go to:” under the General Information section. Details of the candidate’s radiological review at that particular time-point can be viewed in the box under the navy blue heading “Review Values”. Any changes made to the record will be documented in the table following the heading “Change Log”.','2014-09-01 00:00:00',NULL),
(22,-1,md5('dicom_archive'),'Dicom Archive','The user can access all DICOM files through the DICOM Archive under the “Imaging” menu. By default, all fields in the Selection Filter will appear to be null and no search results will be listed. Users can click “Submit” to view all imaging data. A more detailed search can be executed using selected fields from the Selection Filter. This includes filtering by “Patient ID”, “Patient Name”, “Gender”, “Date of Birth”, “Acquisition” date, and/or “Archive Location”. This Selection Filter can be hidden using the upward arrow icon and re-opened by selecting the downward arrow icon. After submitting a search, the user will be able to see how many results their search has retrieved. The user can organize the results in ascending or descending order by clicking on any of the blue headers of the table, consistent with other pages on the LORIS database.\r\n\r\nLinks to a particular patient’s DICOM archive can be accessed through the Metadata column by clicking “View Details”. Direct links to neuroimaging data can also be accessed through the Imaging Browser column.','2014-09-01 00:00:00',NULL),
(23,22,md5('viewDetails'),'Dicom Archive - View Details','Within a particular candidate’s DICOM archive, specific information about the patient can be found, as well as details about imaging data acquisition. Specifics of the DICOM Series can be found in the table, located near the bottom of the DICOM archive page, and can provide information as to whether there was a protocol violation.Under the specifics of the Series, two links to “Show/Hide files” and “Show/Hide metadata” can be clicked to expand the table and reveal additional information. \r\n\r\nNote the DICOM archive for a particular candidate can also be accessed directly from their corresponding Imaging Browser page.','2014-09-01 00:00:00',NULL),
(24,-1,md5('imaging_browser'),'Imaging Browser ','By default, all fields in the Selection Filter will appear to be null and no search results will be listed. Users can click “Submit” to view all imaging data. A more detailed search can be executed using selected fields from the Selection Filter. After submitting a search, the Imaging browser will organize the results by time-point and the user will be able to see how many results their search has retrieved. \r\nThe user can organize the results in ascending or descending order by clicking on any of the blue headers of the table. The date of first acquisition for the imaging dataset is indicated under “First Acq Date” column. The date on which the data was last QC’ed can be found under “Last QC”. Any data that was recently inserted will be indicated via the label “NEW” under “New Data”. \r\n\r\nTo view the imaging datasets for a specific candidate\'s timepoint, select a dataset type from under the 3 \"Links\" columns: “native”, “selected”, and “all types”. “Native” will show only raw imaging datasets, “Selected” displays only scans on which QC has flagged as optimal, and “all types” displays all data, including analyzed outputs. By clicking on any of these links, the user will be able to see details for that specific subject’s dataset from a given scanning session. \r\n\r\nNote that the Imaging Browser may also be accessed from the DICOM Archive module.','2014-09-01 00:00:00',NULL),
(25,24,md5('viewSession'),'Imaging Browser: View Session','At the top of the page is a box with grey headings, listing general information about the candidate, including subject IDs, demographic information, key parameters (e.g. scannerID) and QC status. \r\n\r\nIn the left side panel, QC status flags can be set at the bottom under \"Visit QC\", and detailed QC information can be entered for the entire timepoint dataset via “Visit-level feedback”, under “Visit Controls”. Clicking on “Visit-level feedback” will open a new window with the candidate’s information (e.g.CandID, PSCID, Visit Label and Subproject ID), as well as any additional QC comments and/or existing Mantis bug reports.\r\n\r\nThe files for the selected candidate’s dataset are displayed below the general information box. Horizontal, sagittal and coronal views of each scan volume are grouped together. Each set of images for each file also has a list of scan parameters listed on the right, including protocol, the date at which the image was acquired, the date the images were put on the database, and other details regarding scan acquisition. \r\n\r\nTo the left of the images, there is a panel displaying the QC status of the scan, and if any “caveat emptor” flags exist. If a specific acquisition has been \"selected\" as the optimal scan of its type or modality (e.g. t1) for this dataset, the modality will be displayed as the selected option in the \"Selected\" dropdown box found within the left-hand panel of each scan. Detailed QC information about a specific scan can be entered by clicking “Link to comments”, which will open a separate smaller window with a summary of the candidate’s information and the filename, followed by comments, if any exist, regarding intensity, movement artifacts, coverage and overall feedback on the selected scan. After saving any changes, the user can either close the pop-up window or use the link at the top: “Click here to close this window”.\r\n\r\n<b>Visualization</b>\r\nTo use visualization tools BrainBrowser and the JIV viewer. The user can also access 3D images through the navy blue links “3D+Overlay” and “3D Only” for both the JIV Panel and BrainBrowser in the left sidebar. \r\n\r\nIn the left sidebar, Links are also displayed to direct the user to the MRI parameter form, Radiological Review, DICOM Archive module, and Mantis issue-tracking tool. \r\nAt the top of the left sidebar, the user can click on \"Next\" to move to the next time-point for the candidate of interest.','2014-09-01 00:00:00',NULL),
(26,-1,md5('mri_upload'), 'Imaging Uploader', 'The Imaging Uploader allows users to upload imaging files, typically for an entire imaging session at a time. Please note that files should be in a compressed format (.tgz, .tar.gz, or .zip) and must be labeled properly in order to be uploaded successfully into the database. \r\n\r\nAfter choosing the file to upload, users must input the CandID, PSCID, and Visit Label for this dataset, and then click the “Upload” button. The newly uploaded file will be displayed in the table below. \r\n\r\nUsers will be able to search for datasets uploaded in the past, by entering the ID or Visit Label and then clicking “Show Data”. Results from the upload logs will be displayed in the table below, which can be sorted by columns “CandID”, “Visit Label”, “Source Location”, “Upload Date” and “Uploaded By”, as well as by number of Minc files inserted, and number of Minc files created.\r\n\r\nNote that the “Tarchive Info” column contains links to the corresponding DICOM header information for a given imaging dataset, via the DICOM Archive module.','2014-09-01 00:00:00',NULL),
(27,-1,md5('statistics'), 'Database Statistics', 'The Database statistics module calculates and displays statistics related to data acquisition, data processing, and data entry for both behavioural and imaging data collections. A brief description of “Demographic”, “Imaging”, and “Behavioural Statistics” can be found under the “General Description” tab. In addition to these tabs, the user can also view “Reliability Statistics”. These statistics categories will condense into a drop-down menu in a narrow browser view or mobile device, but can be opened using the downward arrow icon and hidden using the upward arrow icon.\r\n\r\n<b>Demographic Statistics</b>\r\nGeneral statistics can be retrieved from each site by using the drop-down select box under the first smaller heading “General Statistics” and clicking on the button “Submit Query”. Under General Statistics, the user will find the heading “Breakdown of Registered Candidates”, where a table outlines gender breakdowns per site, time-point and subproject ID. Data Entry Completion Status can be viewed for each instrument by selecting from the dropdown menu under “Breakdown of Registered Candidates”. Click “Submit Query” to view statistics specific to the selected instrument. \r\n\r\n<b>Behavioural Statistics</b>\r\nThe user will first see a table labeled “Data Entry Statistics”, where each site is listed in blue headers horizontally and includes the headings “Completed”, “Created”, and “% Completion”. “Completed” refers to the total number of instruments that have been marked “Data Entry= Complete” and “Administration= None/Partial/All”. This column has its percentage counterpart under “% Completion”. “Created” refers to the total number of instruments that have been populated requiring data entry. Another feature allows all site information to be reversibly hidden except “% Completion” by a single click on the Site Name (i.e. AAA, DCC etc.). The “Double Data Entry Statistics” table underneath rests on a similar premise as the “Data Entry Statistics” Table, but with regards to double data entry. In both of these tables, the visits are listed in rows with the data sorted by site. Depending on the study and number of sites involved, the user will need to navigate horizontally through the table using the slider or the arrows flanking the table. When using a desktop the user must hover the mouse over the arrows, whereas on a mobile device the user must click on the arrows. The user also has the option of viewing “Per Instrument Stats” at the bottom of each site’s column, by following the “Please Click Here” link. The user can then view which candidates have not completed data entry in each site. \r\n\r\n<b>Reliability Statistics</b>\r\nThe Reliability Statistics module currently sorts each instrument by visit label and shows the number of flagged, completed, and reliable cases, in addition to expressing reliability and completion in terms of percentages. “Total Flagged” cases refer to the number of candidates with levels consistently falling below a given threshold, thus they have been ‘flagged’ for reliability review. The “Total Complete” column contains the number of candidates for whom a reliability review has been completed. The “Total Reliable” column adds to the information in “Total Complete”, but includes only those candidates whose information is now reliable. The Reliability Statistics Table also includes “Percent Complete” and “Percent Reliable” columns. Under the smaller navy heading “Reliability Statistics”, the user can search for specific statistics for their site of interest by using the dropdown menu and clicking the button “Submit Query”.\r\n\r\n<b>Imaging Statistics</b>\r\nThe first table under “Imaging Integrity Statistics for” displays information regarding missing imaging data, as indicated by data entry on the MRI parameter form, and scan insertions based on records in the Imaging Browser and DICOM archive. Specific candidates with missing imaging data can be easily identified through the link “Click here for breakdown per participant” under the “Breakdown of Problems” column.\r\n\r\nThe second table within the Imaging Statistics module allows the user to get a breakdown of statistics for candidates by time-point, based on the scan selected. Depending on the project, the user can choose from T1, T2, T1 & T2, DTI, BOLD, and Spectroscopy scans, and other possible options at the top left of the second table, to show the relative number of candidates with scans marked as “Complete”, “Partial”, or “No Scan”. Under the column “% Complete”, the user can view the percentage of candidates for the scan of interest that have completed scans. The record of scans has the subprojects listed across the top of the table horizontally, with each site encompassing all of its time points listed in rows. A breakdown of the total imaging data is also available at the bottom of the table.','2014-09-01 00:00:00',NULL),
(28,27,md5('statistics_site'), 'Per Instrument Statistics', 'Completion Statistics for each site are displayed, and are organized by instrument and visit label. The “Completion Count” column displays the number of completed entries per instrument. Each PSCID that appears in the “Incomplete Candidates” list was designed to be a link itself to that particular candidate’s page for the selected instrument.','2014-09-01 00:00:00',NULL),
(29,27,md5('statistics_mri_site'), 'Imaging Integrity Statistics Breakdown', 'This page contains a table listing various Scan Insertion Issues in the left-most column. In the “Incomplete Entries” column, clicking on the candidate IDs will redirect the user to the appropriate Imaging form or dataset for that candidate.','2014-09-01 00:00:00',NULL),
(30,-1,md5('datadict'), 'Data Dictionary', 'As the title suggests, the Data Dictionary houses definitions or descriptions for various instrument fields. In addition, like many other modules in LORIS, the Data Dictionary features a Selection Filter where the user may select from a number of drop-down select boxes and click “Show Data” to quickly locate desired information. The selection filter can be hidden using the upward arrow icon, and reopened using the downward arrow icon.','2014-09-01 00:00:00',NULL),

(31,-1,md5('data_team_helper'), 'Data Team Helper', "The 'Data Team Helper' allows the users to find out what the outstanding behaviourial feedbacks, conflicts and incompleted forms for the given candidate/field/instrument by filtering for the given visit-Label and Instrument.
This module will also display the 'Single Data_entry Completion Percentage' for the given visit and instrument, only if the instrument is selected.\n\r
The resulting table:\n
- displays all fields from the selected instrument (or All Instruments if this feature was chosen) for the specified visit. \n
- Under the column 'Names (Instrument_Fieldname)', the given field name is clickable which allows the user to download the data for the given field/instrument in the .csv format, containing the data and data_entry (i.e complete, in_pregress or null)  for every candidate for the given field and visit.\n
- The 'Link to Bvl Feedback' column contains links to pop-up feedback window, where feedback for a particular field and candidate was previously entered, based on the field-name. If such information was never entered, users will see “N/A”. \n
- For existing links to behavioural feedback, the corresponding status for this field will be listed under the column 'Feedback Status'. \n
- Any candidates with conflicts between initial and double data entry will be listed under the 'Conflicts' column. Clicking on the candidate’s link will open up a new tab, directing the user to the Conflict Resolver for the corresponding field and visit label for that candidate. \n
- A list of candidates for which data entry is incomplete for that particular instrument and visit label will be listed under 'Incomplete Candidates'. The ID of each candidate listed is a link to that candidate’s data entry page.\n",'2014-09-01 00:00:00',NULL),

(32,-1,md5('data_integrity_flag'), 'Data Integrity','The Data Integrity module provides a direct way for users to view and update behavioural feedback at-a-glance, without requiring the user to navigate to the individual instrument forms or use the behavioural feedback pop-up window. \r\n\r\nThe Selection Filter allows users to search for existing feedback for a particular Visit Label, Instrument and User. Upon clicking “Show Data”, the user can add a new flag or behavioural feedback comment within the table directly below the Selection Filter. Users can also search through existing behavioural feedback results within the third table on the page. When adding new behavioural feedback, the date on which the flag was created must be indicated, as well as the Flag Status from the dropdown menu, and any additional comments. The “Save” button must be clicked in order to save the new behavioural flag. Click “Show updated data” or refresh the page to see the most recent behavioural flag within the results table.\r\n\r\nWithin the results table (third table on the Data Integrity page), links under the “Instrument” column will redirect the user to a detailed summary of each field for that particular instrument along with links to behavioural feedback and to incomplete candidates. Users can also view the date the flag was submitted, the Flag Status, any comments, data cleaning feedback, and UserID. Note, Flag Status is based on the codes used in the dropdown of the second table, where 1=Ready for Review, 2= Review Completed, 3=Feedbacks Closed, and 4=Finalization.' ,'2014-09-01 00:00:00',NULL),
(33,-1,md5('user_accounts'), 'User Accounts', 'This feature of LORIS allows an administrator to create accounts and set the Roles and Permissions for database users. Like many modules in LORIS, User Accounts has a Selection Filter which allows the user to quickly search for desired information. The Selection Filter panel can be hidden using the upward arrow icon , and reopened using the downward arrow icon. Once the appropriate user has been found, the profile can be viewed by selecting the “Username” outlined in navy text.','2014-09-01 00:00:00',NULL),
(34,33, md5('edit_user'), 'Add or Edit User Accounts', 'On this page, the user may enter and modify detailed information including address, degree, position and password. By checking a series of boxes under “Roles” and “Permissions” an administrator-level user may add, change or remove a user’s access to areas or functions in the database. After making changes, the administrator must click “Save” to ensure the permissions are updated. Note that permissions may be “Reset” by selecting the appropriate button. The administrator may also return to the list of users by selecting “Back”.' ,'2014-09-01 00:00:00',NULL),
(35,-1,md5('instrument_builder'), 'Instrument Builder', 'The Instrument Builder module is designed to create new behavioural forms on the database. Existing instruments that were created using the instrument builder can be added under the “Load Instrument (optional)” heading. Most new instruments will be generated through the “Create Instrument” tab.\r\nThere are a series of buttons that specify the type of information each field in the form conveys.\r\n<b>Field Types, by Category :</b>\r\n<u>Information</u>\r\n• Header :: Used to specify a title for the page or section of the instrument. Text will appear in boldface at the centre of the page.\r\n• Label :: Functions as a subtitle to introduce a subset of questions\r\n• Scored Field :: Specifies any field that will have data entry. The type of scored field should be indicated under the “data entry” section\r\n<u>Data Entry</u>\r\n• Textbox :: Used for fields with free text, preferably short answers\r\n• Textarea :: Used for free text fields with longer inputs such as general comments, etc.\r\n• Dropdown :: Used for forced choice fields. The options for the dropdown menu need to be specified.  Once “Dropdown” is selected, the user will see an added row labeled as “Dropdown option”. Once the option has been entered, press “add option”. This new option should appear in the “preview” menu. The field “not_answered” will be automatically added to each dropdown menu. Once all options have been added, click “add row”. For subsequent dropdown scored fields, previous dropdown options will be preserved. If the user would like to create a new dropdown menu, click “reset”.\r\n• Multiselect :: Used for fields that have a select box where multiple options can be chosen.\r\n• Date :: Used for creating a date field such as Date of Birth\r\n• Numeric :: Used for creating a numeric field such as Height, Weight, etc.\r\n<u>Formatting</u>\r\n• Blank Line :: Can be used to separate sections within the same page of an instrument. The “Question Name” and “Question Text” can be left blank.\r\n• Page Break :: Used to add a new page within the instrument. The “Question Text” can be populated with the name of the new page, if desired.\r\n \r\n<b>Note on Question Names: </b>\r\n“Question Name” is the field name as it appears (only) in the back-end of the database. The “Question Text” will be seen by users on the database once the instrument has been uploaded. Users have the option of entering the same content into both the “Question Name” and “Question Text” boxes, but generally the “Question Name” is more brief and is formatted with the question number (ie. q1_*). Question names are unique and should not contain spaces. \r\n\r\nAfter each question entry, click “add row” to add the new field to the instrument code. \r\nThis should appear in table format at the bottom of the page. Each row can also be added to the table simply by pressing the enter key.\r\nIf a mistake was made while creating the instrument, users can directly edit the field names in the table at the bottom of the page. By clicking on the field name, a cursor should appear. The user can then make the appropriate changes and hit enter once finished. It is also possible to rearrange or delete fields using the “Options” column.\r\n \r\nOnce the user is satisfied with their instrument, it can be saved and validated.','2014-09-01 00:00:00',NULL),
(36,33,md5('my_preferences'), 'My Preferences', 'This module allows the user to modify first name, last name, email address, and current password, as well as Document Repository preferences. All changes made to the user’s preferences must be saved by clicking “Save” after completion. Information can be reset using the “Reset” button.','2014-09-01 00:00:00',NULL),
(37,30,NULL,'Put the topic here','Put the content here','2014-09-01 00:00:00',NULL),
(38, -1, md5('configuration'), 'Configuration', 'The Configuration Module allows you to edit configuration settings from the front end. The configuration values are stored in the database, instead of in the config.xml file. Any settings that are not currently in the Configuration Module can still be found and edited from the config.xml file.\r\n\r\nTo edit any configuration settings, navigate to the field that you\'d like to edit in the module, click in the form area and edit/insert a value. Pressing enter while the edited form area is selected will save any changes that you make.\r\n\r\nYou should not edit more than two fields at a time as the submit function only saves the data in the form area that you have currently selected. Therefore, if you edit two different fields, only the one that is selected at the time you press enter will be saved. It is recommended to save any changes you make in one field by pressing enter, before moving on to other fields. This will prevent losing any changes that you make.\r\n\r\nSome configuration settings can accept multiple values. For these settings, you can add additional fields by pressing the "Add Field". This will create an empty form area where you can insert new values. You must press enter while the new area is selected to save the new value. You can remove a field by pressing the remove button below the form area.\r\n\r\nCare should be taken when editing the fields as there is currently no way to revert changes.', '2014-09-01 00:00:00', NULL),
(39, -1,md5('help_editor'),'Help Editor','Help Editor module displays existing help content for various modules in LORIS. A list of entries will appear that organizes help content by Topic, Parent Topic and Content. The selection filter allows users to search by Topic or Search keyword. They search keyword returns result if the search item appears in either the Topic or Content text. At the top of the table, column headings will appear underlined and show a click icon when the user hovers over the heading title. Data can be sorted in ascending order according to a given column by clicking on the column heading (i.e. Topic, Parent Topic etc.), and by clicking again, in descending order.\r\n\r\nEditing Content : The content for any module can be edited by clicking on the Topic or Parent topic of choice. ','2014-09-01 00:00:00', NULL),
(40,39,md5('edit_help_content'),'Edit Help Content','This page will display a title and existing content for each module. Both the title and the content are editable. The text can be updated directed on the page and to save the changes click on the Save button at the bottom.','2014-09-01 00:00:00', NULL);

CREATE TABLE `mri_upload` (
  `UploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `UploadedBy` varchar(255) NOT NULL DEFAULT '',
  `UploadDate` DateTime DEFAULT NULL,
  `SourceLocation` varchar(255) NOT NULL DEFAULT '',
  `number_of_mincInserted` int(11) DEFAULT NULL,
  `number_of_mincCreated` int(11) DEFAULT NULL,
  `TarchiveID` int(11) DEFAULT NULL,
  `SessionID` int(10) unsigned DEFAULT NULL,
  `IsValidated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`UploadID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `mri_protocol_checks` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Scan_type` int(11) unsigned DEFAULT NULL,
  `Severity` enum('warning','exclude') DEFAULT NULL,
  `Header` varchar(255) DEFAULT NULL,
  `ValidRange` varchar(255) DEFAULT NULL,
  `ValidRegex` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `MRICandidateErrors` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TimeRun` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SeriesUID` varchar(64) DEFAULT NULL,
  `TarchiveID` int(11) DEFAULT NULL,
  `MincFile` varchar(255) DEFAULT NULL,
  `PatientName` varchar(255) DEFAULT NULL,
  `Reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `mri_violations_log` (
  `LogID` int(11) NOT NULL AUTO_INCREMENT,
  `TimeRun` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SeriesUID` varchar(64) DEFAULT NULL,
  `TarchiveID` int(11) DEFAULT NULL,
  `MincFile` varchar(255) DEFAULT NULL,
  `PatientName` varchar(255) DEFAULT NULL,
  `CandID` int(6) DEFAULT NULL,
  `Visit_label` varchar(255) DEFAULT NULL,
  `CheckID` int(11) DEFAULT NULL,
  `Scan_type` int(11) unsigned DEFAULT NULL,
  `Severity` enum('warning','exclude') DEFAULT NULL,
  `Header` varchar(255) DEFAULT NULL,
  `Value` varchar(255) DEFAULT NULL,
  `ValidRange` varchar(255) DEFAULT NULL,
  `ValidRegex` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`LogID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `participant_accounts` (
    `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `SessionID` int(6) DEFAULT NULL,
    `Test_name` varchar(255) DEFAULT NULL,
    `Email` varchar(255) DEFAULT NULL,
    `Status` enum('Created','Sent','In Progress','Complete') DEFAULT NULL,
    `OneTimePassword` varchar(8) DEFAULT NULL,
    `CommentID` varchar(255) DEFAULT NULL,
    `UserEaseRating` varchar(1) DEFAULT NULL,
    `UserComments` text,
    PRIMARY KEY (`ID`)
);

CREATE TABLE participant_emails(
    Test_name varchar(255) NOT NULL PRIMARY KEY REFERENCES test_names(Test_name),
    DefaultEmail TEXT NULL
);
CREATE TABLE `family` (
        `ID` int(10) NOT NULL AUTO_INCREMENT,
        `FamilyID` int(6) NOT NULL,
        `CandID` int(6) NOT NULL,
        `Relationship_type` enum('half_sibling','full_sibling','1st_cousin') DEFAULT NULL,
        PRIMARY KEY (`ID`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `participant_status_history` (
        `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
        `CandID` int(6) NOT NULL DEFAULT 0,
        `entry_staff` varchar(255) DEFAULT NULL,
        `data_entry_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `participant_status` int(11) DEFAULT NULL,
        `reason_specify` varchar(255),
        `reason_specify_status` enum('not_answered') DEFAULT NULL,
        `participant_subOptions` int(11) DEFAULT NULL,
        PRIMARY KEY (`ID`),
        UNIQUE KEY `ID` (`ID`)
        );
CREATE TABLE `consent_info_history` (
        `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
        `CandID` int(6) NOT NULL DEFAULT 0,
        `entry_staff` varchar(255) DEFAULT NULL,
        `data_entry_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `study_consent` enum('yes','no','not_answered') DEFAULT NULL,
        `study_consent_date` date DEFAULT NULL,
        `study_consent_withdrawal` date DEFAULT NULL,
        PRIMARY KEY (`ID`),
        UNIQUE KEY `ID` (`ID`)
        ) ;

CREATE TABLE `user_login_history` (
  `loginhistoryID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userID` varchar(255) NOT NULL DEFAULT '',
  `Success` enum('Y','N') NOT NULL DEFAULT 'Y',
  `Failcode` varchar(2) DEFAULT NULL,
  `Fail_detail` varchar(255) DEFAULT NULL,
  `Login_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IP_address` varchar(255) DEFAULT NULL,
  `Page_requested` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`loginhistoryID`),
  KEY `FK_user_login_history_1` (`userID`),
  CONSTRAINT `FK_user_login_history_1` FOREIGN KEY (`userID`) REFERENCES `users` (`UserID`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `reliability` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CommentID` varchar(255) DEFAULT NULL,
  `reliability_center_id` int(11) NOT NULL DEFAULT '1',
  `Instrument` varchar(255) DEFAULT NULL,
  `Reliability_score` decimal(4,2) DEFAULT NULL,
  `invalid` enum('no','yes') DEFAULT 'no',
  `Manual_Swap` enum('no','yes') DEFAULT 'no',
  `EARLI_Candidate` enum('no','yes') DEFAULT 'no',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




CREATE TABLE LorisMenu (
    ID integer unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Parent integer unsigned REFERENCES LorisMenu(ID),
    Label varchar(255),
    Link varchar(255),
    Visible enum('true', 'false'),
    OrderNumber integer
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO LorisMenu (Label, OrderNumber) VALUES 
     ('Candidate', 1), 
     ('Clinical', 2), 
     ('Imaging', 3), 
     ('Reports', 4), 
     ('Tools', 5), 
     ('Admin', 6);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES 
    ('New Profile', 'main.php?test_name=new_profile', 1, 1),
    ('Access Profile', 'main.php?test_name=candidate_list', 1, 2);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES 
    ('Reliability', 'main.php?test_name=reliability', 2, 1),
    ('Conflicts Resolver', 'main.php?test_name=conflict_resolver', 2, 2),
    ('Certification', 'main.php?test_name=certification', 2, 3);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES 
    ('Radiological Reviews', 'main.php?test_name=final_radiological_review', 3, 1),
    ('DICOM Archive', 'main.php?test_name=dicom_archive', 3, 2),
    ('Imaging Browser', 'main.php?test_name=imaging_browser', 3, 3),
    ('MRI Violated Scans', 'main.php?test_name=mri_violations', 3, 4),
    ('MRI Upload', 'main.php?test_name=mri_upload', 3, 5);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES 
    ('Statistics', 'main.php?test_name=statistics', 4, 1),
    ('Data Query Tool', '/dqt/', 4, 2);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Data Dictionary', 'main.php?test_name=datadict', 5, 1),
    ('Document Repository', 'main.php?test_name=document_repository', 5, 2),
    ('Data Team Helper', 'main.php?test_name=data_team_helper', 5, 3),
    ('Instrument Builder', 'main.php?test_name=instrument_builder', 5, 4);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES 
    ('User Accounts', 'main.php?test_name=user_accounts', 6, 1),
    ('Survey Module', 'main.php?test_name=survey_accounts', 6,2),
    ('Help Editor', 'main.php?test_name=help_editor', 6,3),
    ('Configuration', 'main.php?test_name=configuration', 6, 4);

CREATE TABLE LorisMenuPermissions (
    MenuID integer unsigned REFERENCES LorisMenu(ID),
    PermID integer unsigned REFERENCES permissions(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT="If a user has ANY of the permissions for a module it will show up in their menu bar";

-- New Profile permission
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 7, PermID FROM permissions WHERE code='data_entry';

-- Access Profile 
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 8, PermID FROM permissions WHERE code='data_entry';

-- Reliability
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 9, PermID FROM permissions WHERE code='user_accounts';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 9, PermID FROM permissions WHERE code='reliability_edit_all';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 9, PermID FROM permissions WHERE code='access_all_profiles';

-- Conflicts Resolver
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 10, PermID FROM permissions WHERE code='data_entry';

-- Certification
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 11, PermID FROM permissions WHERE code='certification';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 11, PermID FROM permissions WHERE code='certification_multisite';

-- Radiological Reviews
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 12, PermID FROM permissions WHERE code='edit_final_radiological_review';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 12, PermID FROM permissions WHERE code='view_final_radiological_review';

-- DICOM Archive -- Config file currently does not require any permission
-- Imaging Browser -- Config file currently does not require any permission
-- Statistics -- Config file currently does not require any permission 

-- Document Repository 
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT 16, PermID FROM permissions WHERE code='file_upload';

-- Data Query Tool
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 18, PermID FROM permissions WHERE code='data_dict';

-- Data Dictionary
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 19, PermID FROM permissions WHERE code='data_dict';

-- MRI Upload
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 20, PermID FROM permissions WHERE code='mri_upload';

-- Data Team Helper -- Config file currently does not require any permission
-- Instrument Builder -- Config file currently does not require any permission

-- User Accounts
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 23, PermID FROM permissions WHERE code='user_accounts';
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='user_accounts' AND m.Label='Survey Module';
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='violated_scans' AND m.Label='MRI Violated Scans';
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='context_help' AND m.Label='Help Editor';
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='config' AND m.Label='Configuration';


CREATE TABLE `ConfigSettings` (
    `ID` int(11) NOT NULL AUTO_INCREMENT,
    `Name` varchar(255) NOT NULL,
    `Description` varchar(255) DEFAULT NULL,
    `Visible` tinyint(1) DEFAULT '0',
    `AllowMultiple` tinyint(1) DEFAULT '0',
    `DataType` enum('text') DEFAULT NULL,
    `Parent` int(11) DEFAULT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Config` (
    `ID` int(11) NOT NULL AUTO_INCREMENT,
    `ConfigID` int(11) DEFAULT NULL,
    `Value` text DEFAULT NULL,
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Filling ConfigSettings table

--
-- study
--

-- study
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('study', 'Study variables', 1, 0);

-- additional_user_info
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'additional_user_info', 'Display additional user fields in User Accounts page', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- title
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'title', 'Descriptive study title', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- studylogo
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'studylogo', 'Logo of the study', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- columnThreshold
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'columnThreshold', 'Number of columns the quat table will contain', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useEDC
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useEDC', 'Use EDC (Expected Date of Confinement) - false unless the study focuses on neonatals for birthdate estimations.', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- ageMin
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'ageMin', 'Minimum candidate age in years (0+)', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- ageMax
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'ageMax', 'Maximum candidate age in years', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- multipleSites
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'multipleSites', 'More than one site in the project', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useFamilyID
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useFamilyID', 'Use family ID', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- startYear
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'startYear', "Project's start year", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- endYear
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'endYear', "Project's end year", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useExternalID
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useExternalID', "Use external ID field - false unless data is used for blind data distribution, or from external data sources", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useProband
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useProband', "Show proband section on the candidate parameter page", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useProjects
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useProjects', "Whether or not study involves more than one project where each project has multiple cohorts/subprojects", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useScreening
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useScreening', "Whether or not there is a screening stage with its own intruments done before the visit stage", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- excluded_instruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'excluded_instruments', "Instruments to be excluded from the data dictionary and the data query tool", 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- instrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'instrument', "Instrument to be excluded from the data dictionary and the data query tool", 1, 1, 'text', ID FROM ConfigSettings WHERE Name="excluded_instruments";

-- DoubleDataEntryInstruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'DoubleDataEntryInstruments', "Instruments for which double data entry should be enabled", 1, 1, 'text', ID FROM ConfigSettings WHERE Name="study";

--
-- paths
--

-- paths
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('paths', 'Path settings', 1, 0);

-- imagePath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'imagePath', 'Path to images', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- base
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'base', 'Base path', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- data
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'data', 'Path to data', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- extLibs
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'extLibs', 'Path to external libraries', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- mincPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'mincPath', 'Path to MINC files', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- DownloadPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'DownloadPath', 'Where files are downloaded', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- log
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'log', 'Path to logs', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- IncomingPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'IncomingPath', 'Path for data transferred to the project server', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- MRICodePath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'MRICodePath', 'Path to MRI code', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

--
-- gui
--

-- gui
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('gui', 'GUI settings', 1, 0);

-- css
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'css', 'CSS file used for rendering', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="gui";

-- rowsPerPage
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'rowsPerPage', 'Number of table rows to appear, per page', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="gui";

-- showTiming
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'showTiming', 'Show breakdown of timing information for page loading', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="gui";

-- showPearErrors
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'showPearErrors', 'Print PEAR errors', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="gui";

--
-- www
--

-- www
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('www', 'WWW settings', 1, 0);

-- host
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'host', 'Host', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="www";

-- url
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'url', 'Main project URL', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="www";

-- mantis_url
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'mantis_url', 'Bug tracker URL', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="www";

--
-- dashboard
--

-- dashboard
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('dashboard', 'Dashboard settings', 1, 0);

-- projectDescription
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'projectDescription', 'Description of the project that will be displayed in the top panel of the dashboard', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dashboard";

-- recruitmentTarget
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'recruitmentTarget', 'Target number of participants for the study', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dashboard";

--
-- dicom_archive
--

-- dicom_archive
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('dicom_archive', 'DICOM archive settings', 1, 0);

-- patientIDRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'patientIDRegex', 'Regex for the patient ID', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dicom_archive";

-- patientNameRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'patientNameRegex', 'Regex for the patient name', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dicom_archive";

-- LegoPhantomRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'LegoPhantomRegex', 'Regex to be used on a Lego Phantom scan', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dicom_archive";

-- LivingPhantomRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'LivingPhantomRegex', 'Regex to be used on Living Phantom scan', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dicom_archive";

-- showTransferStatus
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'showTransferStatus', 'Show transfer status in the DICOM archive table', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dicom_archive";

--
-- statistics
--

-- statistics
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('statistics', 'Statistics settings', 1, 0);

-- excludedMeasures
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'excludedMeasures', 'Excluded measures', 1, 1, 'text', ID FROM ConfigSettings WHERE Name="statistics";

--
-- mail
--

-- mail
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('mail', 'Mail settings', 1, 0);

-- headers
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'headers', 'Headers', 1, 0, ID FROM ConfigSettings WHERE Name="mail";

-- From
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'From', 'From', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="headers";

-- Reply-to
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'Reply-to', 'Reply-to', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="headers";

-- X-MimeOLE
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'X-MimeOLE', 'X-MimeOLE', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="headers";

-- Filling Config table with default values


-- default study variables

-- additional_user_info
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings WHERE Name="additional_user_info";

-- title
INSERT INTO Config (ConfigID, Value) SELECT ID, "Example Study" FROM ConfigSettings WHERE Name="title";

-- studylogo
INSERT INTO Config (ConfigID, Value) SELECT ID, "images/neuro_logo_blue.gif" FROM ConfigSettings WHERE Name="studylogo";

-- columnThreshold
INSERT INTO Config (ConfigID, Value) SELECT ID, 250 FROM ConfigSettings WHERE Name="columnThreshold";

-- useEDC
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useEDC";

-- ageMin
INSERT INTO Config (ConfigID, Value) SELECT ID, 8 FROM ConfigSettings WHERE Name="ageMin";

-- ageMax
INSERT INTO Config (ConfigID, Value) SELECT ID, 11 FROM ConfigSettings WHERE Name="ageMax";

-- multipleSites
INSERT INTO Config (ConfigID, Value) SELECT ID, "true" FROM ConfigSettings WHERE Name="multipleSites";

-- useFamilyID
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useFamilyID";

-- startYear
INSERT INTO Config (ConfigID, Value) SELECT ID, 2004 FROM ConfigSettings WHERE Name="startYear";

-- endYear
INSERT INTO Config (ConfigID, Value) SELECT ID, 2014 FROM ConfigSettings WHERE Name="endYear";

-- useExternalID
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useExternalID";

-- useProband
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useProband";

-- useProjects
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useProjects";

-- useScreening
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useScreening";

-- default path settings

-- imagePath
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/data/" FROM ConfigSettings WHERE Name="imagePath";

-- base
INSERT INTO Config (ConfigID, Value) SELECT ID, "%LORISROOT%" FROM ConfigSettings WHERE Name="base";

-- data
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/data/" FROM ConfigSettings WHERE Name="data";

-- extLibs
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/EXTERNAL/LIBRARY/" FROM ConfigSettings WHERE Name="extLibs";

-- mincPath
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/data/" FROM ConfigSettings WHERE Name="mincPath";

-- DownloadPath
INSERT INTO Config (ConfigID, Value) SELECT ID, "%LORISROOT%" FROM ConfigSettings WHERE Name="DownloadPath";

-- log
INSERT INTO Config (ConfigID, Value) SELECT ID, "tools/logs/" FROM ConfigSettings WHERE Name="log";

-- IncomingPath
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/incoming/" FROM ConfigSettings WHERE Name="IncomingPath";

-- MRICodePath
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/bin/mri/" FROM ConfigSettings WHERE Name="MRICodePath";

-- default gui settings

-- css
INSERT INTO Config (ConfigID, Value) SELECT ID, "main.css" FROM ConfigSettings WHERE Name="css";

-- rowsPerPage
INSERT INTO Config (ConfigID, Value) SELECT ID, 25 FROM ConfigSettings WHERE Name="rowsPerPage";

-- showTiming
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings WHERE Name="showTiming";

-- showPearErrors
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings WHERE Name="showPearErrors";

-- default www settings

-- host
INSERT INTO Config (ConfigID, Value) SELECT ID, "localhost" FROM ConfigSettings WHERE Name="host";

-- url
INSERT INTO Config (ConfigID, Value) SELECT ID, "https://localhost/" FROM ConfigSettings WHERE Name="url";

-- default dashboard settings

-- projectDescription
INSERT INTO Config (ConfigID, Value) SELECT ID, "This database provides an on-line mechanism to store both imaging and behavioral data collected from various locations. Within this framework, there are several tools that will make this process as efficient and simple as possible. For more detailed information regarding any aspect of the database, please click on the Help icon at the top right. Otherwise, feel free to contact us at the DCC. We strive to make data collection almost fun." FROM ConfigSettings WHERE Name="projectDescription";

-- default dicom_archive settings

-- patientIDRegex
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./" FROM ConfigSettings WHERE Name="patientIDRegex";

-- patientNameRegex
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./i" FROM ConfigSettings WHERE Name="patientNameRegex";

-- LegoPhantomRegex
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./i" FROM ConfigSettings WHERE Name="LegoPhantomRegex";

-- LivingPhantomRegex
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./i" FROM ConfigSettings WHERE Name="LivingPhantomRegex";

-- showTransferStatus
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="showTransferStatus";

-- default statistics settings

-- excludedMeasures
INSERT INTO Config (ConfigID, Value) SELECT ID, "radiology_review" FROM ConfigSettings WHERE Name="excludedMeasures";

-- excludedMeasures
INSERT INTO Config (ConfigID, Value) SELECT ID, "mri_parameter_form" FROM ConfigSettings WHERE Name="excludedMeasures";

-- default mail settings

-- From
INSERT INTO Config (ConfigID, Value) SELECT ID, "no-reply@example.com" FROM ConfigSettings WHERE Name="From";

-- Reply-to
INSERT INTO Config (ConfigID, Value) SELECT ID, "no-reply@example.com" FROM ConfigSettings WHERE Name="Reply-to";

-- X-MimeOLE
INSERT INTO Config (ConfigID, Value) SELECT ID, "Produced by LorisDB" FROM ConfigSettings WHERE Name="X-MimeOLE";
