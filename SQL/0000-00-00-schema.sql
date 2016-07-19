
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
-- Table structure for table `acknowledgements`
--

DROP TABLE IF EXISTS `acknowledgements`;
CREATE TABLE `acknowledgements` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ordering` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `citation_name` varchar(255) DEFAULT NULL,
  `title` enum('') DEFAULT NULL,
  `affiliations` varchar(255) DEFAULT NULL,
  `degrees` varchar(255) DEFAULT NULL,
  `roles` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `present` enum('Yes', 'No') DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `acknowledgements`
-- 

LOCK TABLES `acknowledgements` WRITE;
/*!40000 ALTER TABLE `acknowledgements` DISABLE KEYS */;
/*!40000 ALTER TABLE `acknowledgements` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Table structure for table `caveat_options`
--

DROP TABLE IF EXISTS `caveat_options`;
CREATE TABLE `caveat_options` (
  `ID` int(6),
  `Description` varchar(255),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- Dumping data for table `caveat_options`
-- 

LOCK TABLES `caveat_options` WRITE;
/*!40000 ALTER TABLE `caveat_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `caveat_options` ENABLE KEYS */;
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
    (1,'Geometric distortion','volume','a:2:{s:5:\"field\";s:20:\"Geometric_distortion\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}'),
    (2,'Intensity artifact','volume','a:2:{s:5:\"field\";s:18:\"Intensity_artifact\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}'),
    (3,'Movement artifact','volume','a:2:{s:5:\"field\";s:30:\"Movement_artifacts_within_scan\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:15:\"Slight Movement\";i:3;s:12:\"Poor Quality\";i:4;s:12:\"Unacceptable\";}}'),
    (4,'Packet movement artifact','volume','a:2:{s:5:\"field\";s:31:\"Movement_artifacts_between_packets\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:15:\"Slight Movement\";i:3;s:12:\"Poor Quality\";i:4;s:12:\"Unacceptable\";}}'),
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
	(38,3,"gradient wise artifact (DWI ONLY)"),
    (39,2,"susceptibility artifact due to anatomy");

/*!40000 ALTER TABLE `feedback_mri_predefined_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_mri_comments`
--

DROP TABLE IF EXISTS `feedback_mri_comments`;
CREATE TABLE `feedback_mri_comments` (
  `CommentID` int(11) unsigned NOT NULL auto_increment,
  `FileID` int(10) unsigned default NULL,
  `SeriesUID` varchar(64) default NULL,
  `EchoTime` double default NULL,
  `SessionID` int(10) unsigned default NULL,
  `CommentTypeID` int(11) unsigned NOT NULL default '0',
  `PredefinedCommentID` int(11) unsigned default NULL,
  `Comment` text,
  `ChangeTime` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`CommentID`),
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
    QCLastChangeTime int(10) unsigned,
    Selected VARCHAR(255)
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
  PRIMARY KEY  (`id`)
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
INSERT INTO mri_protocol (Center_name,Scan_type,TR_range,TE_range,time_range) VALUES ('ZZZZ',48,'8000-14000','80-130','0-200');
INSERT INTO mri_protocol (Center_name,Scan_type,TR_range,TE_range,time_range) VALUES ('ZZZZ',40,'1900-2700','10-30','0-500');
INSERT INTO mri_protocol (Center_name,Scan_type,TR_range,TE_range,time_range) VALUES ('ZZZZ',44,'2000-2500','2-5',NULL);
INSERT INTO mri_protocol (Center_name,Scan_type,TR_range,TE_range,time_range) VALUES ('ZZZZ',45,'3000-9000','100-550',NULL);


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
  `ProcessID` int(11) NOT NULL DEFAULT '0',
  `TimeSpooled` datetime DEFAULT NULL,
  `Message` text,
  `Error` enum('Y','N') default NULL,
  `Verbose` enum('Y','N') NOT NULL DEFAULT 'N',
  `Sent` enum('N','Y') NOT NULL default 'N',
  `CenterID` tinyint(2) unsigned default NULL,
  `Origin` varchar(255) DEFAULT NULL,
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
INSERT INTO `notification_types` (Type,private,Description) VALUES 
    ('mri new study',0,'New studies processed by the MRI upload handler'),
    ('mri new series',0,'New series processed by the MRI upload handler'),
    ('mri upload handler emergency',1,'MRI upload handler emergencies'),
    ('mri staging required',1,'New studies received by the MRI upload handler that require staging'),
    ('mri invalid study',0,'Incorrectly labelled studies received by the MRI upload handler'),
    ('hardcopy request',0,'Hardcopy requests'),
    ('visual bvl qc',0,'Timepoints selected for visual QC'),
    ('mri qc status',0,'MRI QC Status change');

INSERT INTO notification_types (Type,private,Description) VALUES 
    ('minc insertion',1,'Insertion of the mincs into the mri-table'),
    ('tarchive loader',1,'calls specific Insertion Scripts'),
    ('tarchive validation',1,'Validation of the dicoms After uploading'),
    ('mri upload runner',1,'Validation of DICOMS before uploading'),
    ('mri upload processing class',1,'Validation and execution of DicomTar.pl and TarchiveLoader');
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
	(2,'Geometric_distortion','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0,0),
	(3,'Intensity_artifact','text',NULL,NULL,NULL,NULL,'parameter_file',NULL,NULL,0,0),
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
  `Modality` ENUM ('MR', 'PT') default NULL,
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
-- Table structure for table `tarchive_files`
--

DROP TABLE IF EXISTS `tarchive_files`;
CREATE TABLE `tarchive_files` (
  `TarchiveFileID` int(11) NOT NULL auto_increment,
  `TarchiveID` int(11) NOT NULL default '0',
  `TarchiveSeriesID` INT(11) DEFAULT NULL,
  `SeriesNumber` int(11) default NULL,
  `FileNumber` int(11) default NULL,
  `EchoNumber` int(11) default NULL,
  `SeriesDescription` varchar(255) default NULL,
  `Md5Sum` varchar(255) NOT NULL,
  `FileName` varchar(255) NOT NULL,
  PRIMARY KEY  (`TarchiveFileID`),
  KEY `TarchiveID` (`TarchiveID`),
  KEY `TarchiveSeriesID` (`TarchiveSeriesID`),
  CONSTRAINT `tarchive_files_ibfk_1` FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`) ON DELETE CASCADE,
  CONSTRAINT `tarchive_files_TarchiveSeriesID_fk` FOREIGN KEY (`TarchiveSeriesID`) REFERENCES `tarchive_series` (`TarchiveSeriesID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tarchive_files`
--

LOCK TABLES `tarchive_files` WRITE;
/*!40000 ALTER TABLE `tarchive_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarchive_files` ENABLE KEYS */;
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
  `instr_order` tinyint(4) default NULL,
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
  `group_order` tinyint(4) default NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `test_subgroups`
--

LOCK TABLES `test_subgroups` WRITE;
/*!40000 ALTER TABLE `test_subgroups` DISABLE KEYS */;
INSERT INTO test_subgroups VALUES (1, 'Instruments', NULL);
/*!40000 ALTER TABLE `test_subgroups` ENABLE KEYS */;
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
  `Password_md5` varchar(34) default NULL,
  `Password_hash` varchar(255) default NULL,
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
INSERT INTO `users` (ID,UserID,Real_name,First_name,Last_name,Email,CenterID,Privilege,PSCPI,DBAccess,Active,Password_md5,Pending_approval,Password_expiry)
VALUES (1,'admin','Admin account','Admin','account','admin@localhost',1,0,'N','','Y','4817577f267cc8bb20c3e58b48a311b9f6','N','2016-03-30');
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
      `Value1` text DEFAULT NULL,
      `CommentId2` varchar(255) NOT NULL,
      `Value2` text DEFAULT NULL,
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
      `OldValue1` text DEFAULT NULL,
      `OldValue2` text DEFAULT NULL,
      `NewValue` text DEFAULT NULL,
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
      `Review_Done2` enum('yes','no','not_answered') DEFAULT NULL,
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


CREATE TABLE `mri_upload` (
  `UploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `UploadedBy` varchar(255) NOT NULL DEFAULT '',
  `UploadDate` DateTime DEFAULT NULL,
  `UploadLocation` varchar(255) NOT NULL DEFAULT '',
  `DecompressedLocation` varchar(255) NOT NULL DEFAULT '',
  `InsertionComplete` tinyint(1) NOT NULL DEFAULT '0',
  `Inserting` tinyint(1) NOT NULL DEFAULT '0',
  `PatientName` varchar(255) NOT NULL DEFAULT '',
  `number_of_mincInserted` int(11) DEFAULT NULL,
  `number_of_mincCreated` int(11) DEFAULT NULL,
  `TarchiveID` int(11) DEFAULT NULL,
  `SessionID` int(10) unsigned DEFAULT NULL,
  `IsCandidateInfoValidated` tinyint(1) DEFAULT NULL,
  `IsTarchiveValidated` tinyint(1) NOT NULL DEFAULT '0',
  `IsPhantom` enum('N','Y') NOT NULL DEFAULT 'N',
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

CREATE TABLE IF NOT EXISTS `violations_resolved` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `hash` varchar(255) NOT NULL,
  `ExtID` bigint(20) NOT NULL,
  `TypeTable` varchar(255) DEFAULT NULL,
  `User` varchar(255) DEFAULT NULL,
  `ChangeDate` datetime DEFAULT NULL,
  `Resolved` enum('unresolved', 'reran', 'emailed', 'inserted', 'rejected', 'inserted_flag', 'other') DEFAULT 'unresolved',
  PRIMARY KEY (`ID`)
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
  PRIMARY KEY (`loginhistoryID`)
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




DROP TABLE IF EXISTS `subproject`;
CREATE TABLE subproject (
    SubprojectID int(10) unsigned NOT NULL auto_increment,
    title varchar(255) NOT NULL,
    useEDC boolean,
    WindowDifference enum('optimal', 'battery'),
    RecruitmentTarget int(10) unsigned,
    PRIMARY KEY (SubprojectID)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='Stores Subprojects used in Loris';
INSERT INTO subproject (SubprojectID, title, useEDC, WindowDifference) VALUES (1, 'Control', false, 'optimal');
INSERT INTO subproject (SubprojectID, title, useEDC, WindowDifference) VALUES (2, 'Experimental', false, 'optimal');

DROP TABLE IF EXISTS `Project`;
CREATE TABLE `Project` (
    `ProjectID` INT(2) NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NULL,
    `recruitmentTarget` INT(6) Default NULL,
    PRIMARY KEY (`ProjectID`)
)ENGINE = InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE StatisticsTabs(
    ID INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    ModuleName varchar(255) NOT NULL,
    SubModuleName varchar(255) NOT NULL,
    Description varchar(255),
    OrderNo INTEGER DEFAULT NULL,
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores list of tabs for the statistics module';

INSERT INTO StatisticsTabs (ModuleName, SubModuleName, Description, OrderNo) VALUES
    ('statistics', 'stats_general', 'General Description', 1),
    ('statistics', 'stats_demographic', 'Demographic Statistics', 2),
    ('statistics', 'stats_behavioural', 'Behavioural Statistics', 3),
    ('statistics', 'stats_reliability', 'Reliability Statistics', 4),
    ('statistics', 'stats_MRI', 'Imaging Statistics', 5);

CREATE TABLE `final_radiological_review_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `col` varchar(255) NOT NULL DEFAULT '',
  `old` text,
  `new` text,
  `CommentID` varchar(255),
  `changeDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userID` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Genomic Browser tables : no data included
--
-- Table structure for table `genome_loc`
DROP TABLE IF EXISTS `genome_loc`;
CREATE TABLE `genome_loc` (
  `GenomeLocID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Chromosome` varchar(255) DEFAULT NULL,
  `Strand` varchar(255) DEFAULT NULL,
  `EndLoc` int(11) DEFAULT NULL,
  `Size` int(11) DEFAULT NULL,
  `StartLoc` int(11) DEFAULT NULL,
  PRIMARY KEY (`GenomeLocID`),
  UNIQUE KEY (Chromosome, StartLoc, EndLoc),
  INDEX (Chromosome, EndLoc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for table `gene`
DROP TABLE IF EXISTS `gene`;
CREATE TABLE `gene` (
  `GeneID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Symbol` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `NCBIID` varchar(255) DEFAULT NULL,
  `OfficialSymbol` varchar(255) DEFAULT NULL,
  `OfficialName` text,
  `GenomeLocID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`GeneID`),
  KEY `geneGenomeLocID` (`GenomeLocID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for table `genotyping_platform`
DROP TABLE IF EXISTS `genotyping_platform`;
CREATE TABLE `genotyping_platform` (
  `PlatformID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Description` text,
  `TechnologyType` varchar(255) DEFAULT NULL,
  `Provider` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PlatformID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `SNP`
-- used by Genomic Browser module
--
DROP TABLE IF EXISTS `SNP`;
CREATE TABLE `SNP` (
  `SNPID` bigint(20) NOT NULL AUTO_INCREMENT,
  `rsID` varchar(20) DEFAULT NULL,
  `Description` text,
  `SNPExternalName` varchar(255) DEFAULT NULL,
  `SNPExternalSource` varchar(255) DEFAULT NULL,
  `ReferenceBase` enum('A','C','T','G') DEFAULT NULL,
  `Markers` varchar(255) DEFAULT NULL,
  `FunctionPrediction` enum('exonic','ncRNAexonic','splicing','UTR3','UTR5') DEFAULT NULL,
  `Damaging` enum('D','NA') DEFAULT NULL,
  `ExonicFunction` enum('nonsynonymous','unknown') DEFAULT NULL,
  `GenomeLocID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`SNPID`),
  CONSTRAINT `SNP_ibfk_2` FOREIGN KEY (`GenomeLocID`) REFERENCES genome_loc(`GenomeLocID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `SNP_candidate_rel`
-- used by Genomic Browser module
--
DROP TABLE IF EXISTS `SNP_candidate_rel`;
CREATE TABLE `SNP_candidate_rel` (
  `SNPID` bigint(20) NOT NULL DEFAULT '0',
  `CandID` int(6) NOT NULL DEFAULT '0',
  `ObservedBase` enum('A','C','T','G') DEFAULT NULL,
  `ArrayReport` enum('Normal','Uncertain','Pending') DEFAULT NULL,
  `ArrayReportDetail` varchar(255) DEFAULT NULL,
  `ValidationMethod` varchar(50) DEFAULT NULL,
  `Validated` enum('0','1') DEFAULT NULL,
  `GenotypeQuality` int(4) DEFAULT NULL,
  `PlatformID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`SNPID`,`CandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `CNV`
-- used by Genomic Browser module
--
DROP TABLE IF EXISTS `CNV`;
CREATE TABLE `CNV` (
  `CNVID` bigint(20) NOT NULL AUTO_INCREMENT,
  `CandID` int(6) DEFAULT NULL,
  `Description` text,
  `Type` enum('gain','loss','unknown') DEFAULT NULL,
  `EventName` varchar(255) DEFAULT NULL,
  `Common_CNV` enum('Y','N') DEFAULT NULL,
  `Characteristics` enum('Benign','Pathogenic','Unknown') DEFAULT NULL,
  `CopyNumChange` int(11) DEFAULT NULL,
  `Inheritance` enum('de novo','NA','unclassified','unknown','maternal','paternal') DEFAULT NULL,
  `ArrayReport` enum('Normal','Abnormal','Pending','Uncertain') DEFAULT NULL,
  `Markers` varchar(255) DEFAULT NULL,
  `ArrayReportDetail` varchar(255) DEFAULT NULL,
  `ValidationMethod` varchar(50) DEFAULT NULL,
  `PlatformID` bigint(20) DEFAULT NULL,
  `GenomeLocID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`CNVID`),
  FOREIGN KEY (`PlatformID`) REFERENCES genotyping_platform(`PlatformID`),
  FOREIGN KEY (`GenomeLocID`) REFERENCES genome_loc(`GenomeLocID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `GWAS`
-- Genomic Browser module
-- 
DROP TABLE IF EXISTS `GWAS`;
CREATE TABLE `GWAS` (
  `GWASID` int unsigned NOT NULL AUTO_INCREMENT,
  `SNPID` bigint(20) NOT NULL,
  `rsID` varchar(20) DEFAULT NULL,
  `MajorAllele` enum('A','C','T','G') DEFAULT NULL,
  `MinorAllele` enum('A','C','T','G') DEFAULT NULL,
  `MAF` varchar(20) DEFAULT NULL,
  `Estimate` varchar(20) DEFAULT NULL,
  `StdErr` varchar(20) DEFAULT NULL,
  `Pvalue` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`GWASID`),
  FOREIGN KEY (`SNPID`) REFERENCES SNP(`SNPID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores results of Genome-Wide Analysis Study';

DROP TABLE IF EXISTS `genomic_analysis_modality_enum`;
CREATE TABLE `genomic_analysis_modality_enum` (
  `analysis_modality` varchar(100),
  PRIMARY KEY (`analysis_modality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT '';

INSERT IGNORE INTO `genomic_analysis_modality_enum` (analysis_modality) VALUES
('Methylation beta-values'),
('Other');

--
-- Table structure for table `genomic_files`
--
DROP TABLE IF EXISTS `genomic_files`;
CREATE TABLE `genomic_files` (
  `GenomicFileID` int unsigned NOT NULL AUTO_INCREMENT,
  `FileName` varchar(255) NOT NULL,
  `FilePackage` tinyint(1) DEFAULT NULL,
  `Description` varchar(255) NOT NULL,
  `FileType` varchar(255) NOT NULL,
  `FileSize` int(20) NOT NULL,
  `Platform` varchar(255) DEFAULT NULL,
  `Batch` varchar(255) DEFAULT NULL,
  `Source` varchar(255) DEFAULT NULL,
  `Date_taken` date DEFAULT NULL,
  `Category` enum('raw','cleaned') DEFAULT NULL,
  `Pipeline` varchar(255) DEFAULT NULL,
  `Algorithm` varchar(255) DEFAULT NULL,
  `Normalization` varchar(255) DEFAULT NULL,
  `SampleID` varchar(255) DEFAULT NULL,
  `AnalysisProtocol` varchar(255) DEFAULT NULL,
  `InsertedByUserID` varchar(255) NOT NULL DEFAULT '',
  `Date_inserted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Caveat` tinyint(1) DEFAULT NULL,
  `Notes` text,
  `AnalysisModality` varchar(100),
  PRIMARY KEY (`GenomicFileID`),
  KEY `AnalysisModality` (`AnalysisModality`),
  CONSTRAINT `genomic_files_ibfk_1` FOREIGN KEY (`AnalysisModality`) REFERENCES `genomic_analysis_modality_enum` (`analysis_modality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `genomic_candidate_files_rel`;
CREATE TABLE `genomic_candidate_files_rel` (
    `CandID` int(6) NOT NULL,
    `GenomicFileID` int(10) unsigned NOT NULL,
    PRIMARY KEY (`CandID`,`GenomicFileID`),
    FOREIGN KEY (CandID)
        REFERENCES candidate (CandID),
    FOREIGN KEY (GenomicFileID)
        REFERENCES genomic_files (GenomicFileID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `genomic_sample_candidate_rel`;
CREATE TABLE `genomic_sample_candidate_rel` (
  `sample_label` varchar(100) NOT NULL,
  `CandID` int(6) NOT NULL,
  PRIMARY KEY (sample_label, CandID),
  UNIQUE KEY `sample_label` (`sample_label`),
  FOREIGN KEY (CandID)
    REFERENCES candidate(CandID)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT = '';

DROP TABLE IF EXISTS `genomic_cpg_annotation`;
CREATE TABLE `genomic_cpg_annotation` (
  `cpg_name` varchar(100) NOT NULL,
  `location_id` bigint(20) NOT NULL,
  `address_id_a` int unsigned NULL,
  `probe_seq_a` varchar(100) NULL, 
  `address_id_b` int unsigned NULL,
  `probe_seq_b` varchar(100) NULL,
  `design_type` varchar(20) NULL,
  `color_channel` enum ('Red', 'Grn') NULL,
  `genome_build` varchar(40) NULL,
  `probe_snp_10` varchar(40) NULL,
  `gene_name` text NULL,
  `gene_acc_num` text NULL,
  `gene_group` text NULL,
  `island_loc` varchar(100) NULL,
  `island_relation` enum ('island', 'n_shelf', 'n_shore', 's_shelf', 's_shore') NULL, 
  `fantom_promoter_loc`varchar(100) NULL,
  `dmr` enum ('CDMR', 'DMR', 'RDMR') NULL,
  `enhancer` tinyint(1) NULL,
  `hmm_island_loc` varchar(100) NULL,
  `reg_feature_loc` varchar(100) NULL,
  `reg_feature_group` varchar(100) NULL,
  `dhs` tinyint(1) NULL,
  `platform_id` bigint(20) NULL,
  PRIMARY KEY (cpg_name),
  FOREIGN KEY (location_id)
    REFERENCES genome_loc(`GenomeLocID`)
    ON DELETE RESTRICT,
  FOREIGN KEY (platform_id)
    REFERENCES genotyping_platform(`PlatformID`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT = '';

DROP TABLE IF EXISTS `genomic_cpg`;
CREATE TABLE `genomic_cpg` (
  `sample_label` varchar(100) NOT NULL,
  `cpg_name` varchar(100) NOT NULL,
  `beta_value` decimal(4,3) DEFAULT NULL,
  PRIMARY KEY (sample_label, cpg_name),
  FOREIGN KEY (sample_label)
    REFERENCES genomic_sample_candidate_rel(sample_label)
    ON DELETE RESTRICT,
  FOREIGN KEY (cpg_name)
    REFERENCES genomic_cpg_annotation(cpg_name)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT = '';

CREATE TABLE `certification_training` (
    `ID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `TestID` int(10) UNSIGNED NOT NULL,
    `Title` varchar(255) NOT NULL,
    `Content` text,
    `TrainingType` enum('text', 'pdf', 'video', 'quiz') NOT NULL,
    `OrderNumber` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_certification_training` FOREIGN KEY (`TestID`) REFERENCES `test_names` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `certification_training_quiz_questions` (
    `ID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `TestID` int(10) unsigned NOT NULL,
    `Question` varchar(255) NOT NULL,
    `OrderNumber` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_certification_training_quiz_questions` FOREIGN KEY (`TestID`) REFERENCES `test_names` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `certification_training_quiz_answers` (
    `ID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `QuestionID` INTEGER UNSIGNED NOT NULL,
    `Answer` varchar(255) NOT NULL,
    `Correct` boolean NOT NULL,
    `OrderNumber` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_certification_training_quiz_answers` FOREIGN KEY (`QuestionID`) REFERENCES `certification_training_quiz_questions` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- Table structure for table `server_processes`
DROP TABLE IF EXISTS `server_processes`;
CREATE TABLE `server_processes` (
  `id`                int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pid`               int(11) unsigned NOT NULL,
  `type`              enum('mri_upload') NOT NULL,
  `stdout_file`       varchar(255) DEFAULT NULL,
  `stderr_file`       varchar(255) DEFAULT NULL,
  `exit_code_file`    varchar(255) DEFAULT NULL,
  `exit_code`         varchar(255) DEFAULT NULL,
  `userid`            varchar(255) NOT NULL,
  `start_time`        timestamp NULL,
  `end_time`          timestamp NULL,
  `exit_text`         text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_task_1` (`userid`),
  CONSTRAINT `FK_task_1` FOREIGN KEY (`userid`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS ExternalLinkTypes;
CREATE TABLE ExternalLinkTypes (
    LinkTypeID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    LinkType varchar(255)
);  
INSERT INTO ExternalLinkTypes (LinkType)
    VALUES ('FooterLink'),
           ('StudyLinks'),
           ('dashboard');

DROP TABLE IF EXISTS ExternalLinks;
CREATE TABLE ExternalLinks (
    LinkID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    LinkTypeID int,
    LinkText varchar(255) NOT NULL,
    LinkURL varchar(255) NOT NULL,
    FOREIGN KEY (LinkTypeID) REFERENCES ExternalLinkTypes(LinkTypeID)
);
INSERT INTO ExternalLinks (LinkTypeID, LinkText, LinkURL) VALUES 
    (1,  'Loris Website', 'http://www.loris.ca'),
    (1,  'GitHub', 'https://github.com/aces/Loris'),
    (2,  'Loris Website', 'http://www.loris.ca'),
    (2,  'GitHub', 'https://github.com/aces/Loris'),
    (3,  'Loris Website', 'http://www.loris.ca');

DROP TABLE IF EXISTS empty_queries;
CREATE TABLE empty_queries (
 ID int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
 query text NOT NULL,
 timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `data_release`;
CREATE TABLE `data_release` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `file_name` varchar(255),
 `version` varchar(255),
 `upload_date` date,
 PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `data_release_permissions`;
CREATE TABLE `data_release_permissions` (
 `userid` int(10) unsigned NOT NULL,
 `data_release_id` int(10) unsigned NOT NULL,
 PRIMARY KEY (`userid`, `data_release_id`),
 KEY `FK_userid` (`userid`),
 KEY `FK_data_release_id` (`data_release_id`),
 CONSTRAINT `FK_userid` FOREIGN KEY (`userid`) REFERENCES `users` (`ID`),
 CONSTRAINT `FK_data_release_id` FOREIGN KEY (`data_release_id`) REFERENCES `data_release` (`id`)
);
