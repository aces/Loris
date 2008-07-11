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
  `Ethnicity` varchar(255) default NULL,
  `ZIP` varchar(12) default NULL,
  `FamilyID` int(6) default NULL,
  `Sibling1` int(6) default NULL,
  `Sibling2` int(6) default NULL,
  `Sibling3` int(6) default NULL,
  `Active` enum('Y','N') NOT NULL default 'Y',
  `Date_active` date default NULL,
  `Cancelled` enum('N','Y') NOT NULL default 'N',
  `Date_cancelled` date default NULL,
  `RegisteredBy` varchar(255) default NULL,
  `UserID` varchar(255) NOT NULL default '',
  `Date_registered` date default NULL,
  `Testdate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `Entity_type` enum('Human','Scanner') NOT NULL default 'Human',
  PRIMARY KEY  (`CandID`),
  UNIQUE KEY `ID` (`ID`),
  KEY `FK_candidate_1` (`CenterID`),
  CONSTRAINT `FK_candidate_1` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `candidate`
--

LOCK TABLES `candidate` WRITE;
/*!40000 ALTER TABLE `candidate` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cert_details`
--

DROP TABLE IF EXISTS `cert_details`;
CREATE TABLE `cert_details` (
  `certID` int(10) unsigned NOT NULL default '0',
  `testID` int(10) unsigned NOT NULL default '0',
  `pass` enum('Invalid','Invalid scoring','Valid') default NULL,
  `comment` text,
  PRIMARY KEY  (`certID`,`testID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cert_details`
--

LOCK TABLES `cert_details` WRITE;
/*!40000 ALTER TABLE `cert_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `cert_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cert_events`
--

DROP TABLE IF EXISTS `cert_events`;
CREATE TABLE `cert_events` (
  `certID` int(10) unsigned NOT NULL auto_increment,
  `examinerID` int(10) unsigned NOT NULL default '0',
  `date_cert` date NOT NULL default '0000-00-00',
  `candID` int(10) unsigned default NULL,
  `visit_label` varchar(255) default NULL,
  PRIMARY KEY  (`certID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cert_events`
--

LOCK TABLES `cert_events` WRITE;
/*!40000 ALTER TABLE `cert_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `cert_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ethnic`
--

DROP TABLE IF EXISTS `ethnic`;
CREATE TABLE `ethnic` (
  `EthnicID` tinyint(1) unsigned NOT NULL auto_increment,
  `Hispanic` varchar(100) NOT NULL default '',
  `Alias` varchar(100) NOT NULL default '',
  `Race` varchar(100) NOT NULL default '',
  PRIMARY KEY  (`EthnicID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ethnic`
--

LOCK TABLES `ethnic` WRITE;
/*!40000 ALTER TABLE `ethnic` DISABLE KEYS */;
/*!40000 ALTER TABLE `ethnic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examiners`
--

DROP TABLE IF EXISTS `examiners`;
CREATE TABLE `examiners` (
  `examinerID` int(10) unsigned NOT NULL auto_increment,
  `full_name` varchar(255) default NULL,
  `centerID` tinyint(2) unsigned default NULL,
  PRIMARY KEY  (`examinerID`),
  UNIQUE KEY `full_name` (`full_name`,`centerID`),
  KEY `FK_examiners_1` (`centerID`),
  CONSTRAINT `FK_examiners_1` FOREIGN KEY (`centerID`) REFERENCES `psc` (`CenterID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `examiners`
--

LOCK TABLES `examiners` WRITE;
/*!40000 ALTER TABLE `examiners` DISABLE KEYS */;
/*!40000 ALTER TABLE `examiners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `example_instrument`
--

DROP TABLE IF EXISTS `example_instrument`;
CREATE TABLE `example_instrument` (
  `CommentID` char(255) NOT NULL default '',
  `UserID` char(255) default NULL,
  `Examiner` int(11) unsigned default NULL,
  `Date_taken` date default NULL,
  `Testdate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL default 'Incomplete',
  `MenstruationCheck` enum('N','Y','NA') default NULL,
  `QuickVueDate` date default NULL,
  `QuickVueResult` enum('Positive','Negative','NA') default NULL,
  `LaboratoryDate` date default NULL,
  `LaboratoryResult` enum('Positive','Negative','NA') default NULL,
  PRIMARY KEY  (`CommentID`),
  KEY `FK_example_instrument_2` (`UserID`),
  KEY `FK_example_instrument_3` (`Examiner`),
  CONSTRAINT `FK_example_instrument_3` FOREIGN KEY (`Examiner`) REFERENCES `examiners` (`examinerID`),
  CONSTRAINT `FK_example_instrument_1` FOREIGN KEY (`CommentID`) REFERENCES `flag` (`CommentID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_example_instrument_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `example_instrument`
--

LOCK TABLES `example_instrument` WRITE;
/*!40000 ALTER TABLE `example_instrument` DISABLE KEYS */;
/*!40000 ALTER TABLE `example_instrument` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  PRIMARY KEY  (`FeedbackID`),
  KEY `FK_feedback_bvl_thread_1` (`Feedback_type`),
  CONSTRAINT `FK_feedback_bvl_thread_1` FOREIGN KEY (`Feedback_type`) REFERENCES `feedback_bvl_type` (`Feedback_type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

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
  `CoordinateSpace` varchar(255) default NULL,
  `Algorithm` varchar(255) default NULL,
  `OutputType` varchar(255) NOT NULL default '',
  `AcquisitionProtocolID` int(10) unsigned default NULL,
  `FileType` enum('mnc','obj','xfm','xfmmnc','imp','vertstat') default NULL,
  `PendingStaging` tinyint(1) NOT NULL default '0',
  `QCStatus` enum('Pass','Fail') default NULL,
  `QCFirstChangeTime` int(10) unsigned default NULL,
  `QCLastChangeTime` int(10) unsigned default NULL,
  `InsertedByUserID` varchar(255) NOT NULL default '',
  `InsertTime` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`FileID`),
  KEY `file` (`File`),
  KEY `sessionid` (`SessionID`),
  KEY `outputtype` (`OutputType`),
  KEY `filetype_outputtype` (`FileType`,`OutputType`),
  KEY `staging_filetype_outputtype` (`PendingStaging`,`FileType`,`OutputType`),
  KEY `AcquiIndex` (`AcquisitionProtocolID`,`SessionID`),
  CONSTRAINT `FK_files_2` FOREIGN KEY (`AcquisitionProtocolID`) REFERENCES `mri_scan_type` (`ID`),
  CONSTRAINT `FK_files_1` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `flag`
--

LOCK TABLES `flag` WRITE;
/*!40000 ALTER TABLE `flag` DISABLE KEYS */;
/*!40000 ALTER TABLE `flag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hardcopy_requests`
--

DROP TABLE IF EXISTS `hardcopy_requests`;
CREATE TABLE `hardcopy_requests` (
  `CenterID` tinyint(2) unsigned NOT NULL default '0',
  `Last_checked` tinyint(2) unsigned NOT NULL default '0',
  `Next_selection` tinyint(2) unsigned NOT NULL default '0',
  `Group_size` tinyint(2) unsigned NOT NULL default '0',
  PRIMARY KEY  (`CenterID`),
  CONSTRAINT `FK_hardcopy_requests_1` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `hardcopy_requests`
--

LOCK TABLES `hardcopy_requests` WRITE;
/*!40000 ALTER TABLE `hardcopy_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `hardcopy_requests` ENABLE KEYS */;
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
  PRIMARY KEY  (`id`),
  KEY `FK_history_1` (`userID`),
  CONSTRAINT `FK_history_1` FOREIGN KEY (`userID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table keeps track of ongoing changes in the database. ';

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mri_acquisition_dates`
--

LOCK TABLES `mri_acquisition_dates` WRITE;
/*!40000 ALTER TABLE `mri_acquisition_dates` DISABLE KEYS */;
/*!40000 ALTER TABLE `mri_acquisition_dates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mri_efax_deleted_pages`
--

DROP TABLE IF EXISTS `mri_efax_deleted_pages`;
CREATE TABLE `mri_efax_deleted_pages` (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `File_name` varchar(255) NOT NULL default '',
  `Date` date NOT NULL default '0000-00-00',
  PRIMARY KEY  (`File_name`,`Date`),
  UNIQUE KEY `ID` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mri_efax_deleted_pages`
--

LOCK TABLES `mri_efax_deleted_pages` WRITE;
/*!40000 ALTER TABLE `mri_efax_deleted_pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `mri_efax_deleted_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mri_efax_parameter_form`
--

DROP TABLE IF EXISTS `mri_efax_parameter_form`;
CREATE TABLE `mri_efax_parameter_form` (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `CenterID` tinyint(2) unsigned NOT NULL default '1',
  `Scan_category` enum('subject','ACRQC','living_phantom','mritest') NOT NULL default 'subject',
  `CandID` int(6) NOT NULL default '0',
  `VisitNo` tinyint(1) NOT NULL default '0',
  `Visit_label` varchar(255) default NULL,
  `SessionID` int(10) unsigned default NULL,
  `Acquisition_date` date default NULL,
  `File_name` varchar(255) NOT NULL default '',
  `Page` char(3) NOT NULL default '',
  `UserID` varchar(255) NOT NULL default '',
  `Date_taken` date default NULL,
  `Testdate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `Comment` varchar(255) default NULL,
  PRIMARY KEY  (`File_name`,`Page`),
  UNIQUE KEY `ID` (`ID`),
  KEY `CenterID` (`CenterID`),
  KEY `Scan_category` (`Scan_category`),
  KEY `VisitNo` (`VisitNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mri_efax_parameter_form`
--

LOCK TABLES `mri_efax_parameter_form` WRITE;
/*!40000 ALTER TABLE `mri_efax_parameter_form` DISABLE KEYS */;
/*!40000 ALTER TABLE `mri_efax_parameter_form` ENABLE KEYS */;
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
  `series_description_regex` varchar(255) default NULL,
  PRIMARY KEY  (`ID`),
  KEY `FK_mri_protocol_1` (`ScannerID`),
  CONSTRAINT `FK_mri_protocol_1` FOREIGN KEY (`ScannerID`) REFERENCES `mri_scanner` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mri_protocol`
--

LOCK TABLES `mri_protocol` WRITE;
/*!40000 ALTER TABLE `mri_protocol` DISABLE KEYS */;
INSERT INTO `mri_protocol` VALUES (124,'ZZZZ',0,0,44,'1-50','1-15','','','','','','11-10000','11-10000','11-10000','','','',NULL),(125,'ZZZZ',0,0,44,'350-650','1-40','','','','','','11-10000','11-10000','11-10000','','','',NULL),(126,'ZZZZ',0,0,45,'2000-4000','100-180','','','','','','11-10000','11-10000','11-10000','','','',NULL),(127,'ZZZZ',0,0,46,'2000-4000','12-30','','','','','','11-10000','11-10000','11-10000','','','',NULL),(128,'ZZZZ',0,0,47,'1400-1600','100-150','','','','','','','','','','','',NULL),(129,'ZZZZ',0,0,48,'3000-9999','60-100','','','','','','11-10000','11-10000','11-10000','2.5-3.5','2.5-3.5','2.5-3.5',NULL),(130,'ZZZZ',0,0,49,'0,9000-100000','34-60','0-10000','','','','','11-10000','11-10000','11-10000','','','',NULL),(131,'ZZZZ',0,0,50,'2000-4000','80-90','','','','','','11-10000','11-10000','11-10000','','','',NULL),(132,'ZZZZ',0,0,51,'2000-4000','151-180','','','','','','11-10000','11-10000','11-10000','','','',NULL),(133,'ZZZZ',0,0,52,'','','','','','','','0-10','','','','','',NULL),(134,'ZZZZ',0,0,52,'','','','','','','','','0-10','','','','',NULL),(135,'ZZZZ',0,0,52,'','','','','','','','','','0-10','','',NULL,NULL),(136,'AAAA',0,0,47,'99999.12345',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'mrs'),(137,'AAAA',0,0,48,'99999.12345',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'dti'),(138,'AAAA',0,0,49,'99999.12345',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'relax'),(139,'AAAA',0,0,52,'99999.12345',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'scout|localizer'),(999,'',0,0,999,'','','','','','','','','','','','','','');
/*!40000 ALTER TABLE `mri_protocol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mri_safety`
--

DROP TABLE IF EXISTS `mri_safety`;
CREATE TABLE `mri_safety` (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `SessionID` int(11) NOT NULL default '0',
  `Acquisition_date` date NOT NULL default '0000-00-00',
  `Date_review` date default NULL,
  `Check_adverse` enum('N','Y') default NULL,
  `Check_incidental` enum('N','Y') default NULL,
  `Findings_confirmed` enum('In Progress','Included','Included_flagged','Excluded') default NULL,
  `Findings_comment` text,
  `Comment` text,
  PRIMARY KEY  (`SessionID`,`Acquisition_date`),
  UNIQUE KEY `ID` (`ID`),
  KEY `Acquisition_date` (`Acquisition_date`),
  KEY `Date_review` (`Date_review`),
  KEY `Check_adverse` (`Check_adverse`),
  KEY `Check_incidental` (`Check_incidental`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mri_safety`
--

LOCK TABLES `mri_safety` WRITE;
/*!40000 ALTER TABLE `mri_safety` DISABLE KEYS */;
/*!40000 ALTER TABLE `mri_safety` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mri_scan_type`
--

DROP TABLE IF EXISTS `mri_scan_type`;
CREATE TABLE `mri_scan_type` (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `Scan_type` text NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mri_scanner`
--

LOCK TABLES `mri_scanner` WRITE;
/*!40000 ALTER TABLE `mri_scanner` DISABLE KEYS */;
INSERT INTO `mri_scanner` VALUES (0,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `mri_scanner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mri_staging`
--

DROP TABLE IF EXISTS `mri_staging`;
CREATE TABLE `mri_staging` (
  `StagingID` int(10) unsigned NOT NULL auto_increment,
  `SessionID` int(10) unsigned NOT NULL default '0',
  `PatientName` varchar(255) default NULL,
  `StudyDate` int(10) unsigned default NULL,
  `Resolution` enum('accepted','to delete','deleted') default NULL,
  `ResolvedBy` varchar(255) default NULL,
  `ResolvedTime` int(10) unsigned default NULL,
  PRIMARY KEY  (`StagingID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Table will be used in the future';

--
-- Dumping data for table `mri_staging`
--

LOCK TABLES `mri_staging` WRITE;
/*!40000 ALTER TABLE `mri_staging` DISABLE KEYS */;
/*!40000 ALTER TABLE `mri_staging` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='per-candidate equivalent of parameter_session';

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  PRIMARY KEY  (`ParameterTypeID`),
  KEY `name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1 COMMENT='dictionary of all the variables in the project';

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `parameter_type_category_rel`
--

LOCK TABLES `parameter_type_category_rel` WRITE;
/*!40000 ALTER TABLE `parameter_type_category_rel` DISABLE KEYS */;
/*!40000 ALTER TABLE `parameter_type_category_rel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `permID` int(10) unsigned NOT NULL auto_increment,
  `code` varchar(255) NOT NULL default '',
  `description` varchar(255) NOT NULL default '',
  `type` enum('role','permission') NOT NULL default 'permission',
  PRIMARY KEY  (`permID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'superuser','There can be only one Highlander','role'),(2,'user_accounts','User management','permission'),(3,'user_accounts_multisite','Across all sites create and edit users','permission'),(4,'context_help','Edit help documentation','permission'),(5,'bvl_feedback','Behavioural QC','role'),(6,'mri_feedback','Edit MRI feedback threads','permission'),(7,'mri_efax','Edit MRI Efax files','permission'),(8,'send_to_dcc','Send to DCC','permission'),(9,'unsend_to_dcc','Reverse Send from DCC','permission'),(10,'access_all_profiles','Across all sites access candidate profiles','permission'),(11,'data_entry','Data entry','role'),(12,'certification','Certify examiners','permission'),(13,'certification_multisite','Across all sites certify examiners','permission'),(14,'timepoint_flag','Edit exclusion flags','permission'),(15,'timepoint_flag_evaluate','Evaluate overall exclusionary criteria for the timepoint','permission'),(16,'mri_safety','Review MRI safety form for accidental findings','permission');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `psc`
--

LOCK TABLES `psc` WRITE;
/*!40000 ALTER TABLE `psc` DISABLE KEYS */;
INSERT INTO `psc` VALUES (1,'Data Coordinating Center','','','',0,'','','','','','DCC','','','N');
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `query_gui_stored_queries`
--

LOCK TABLES `query_gui_stored_queries` WRITE;
/*!40000 ALTER TABLE `query_gui_stored_queries` DISABLE KEYS */;
/*!40000 ALTER TABLE `query_gui_stored_queries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `CandID` int(6) NOT NULL default '0',
  `PSCID` varchar(255) NOT NULL default '',
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
  `Cancelled` enum('N','Y') NOT NULL default 'N',
  `Date_cancelled` date default NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Table holding session information';

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
  PRIMARY KEY  (`TarchiveID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  PRIMARY KEY  (`ID`),
  KEY `age_test` (`AgeMinDays`,`AgeMaxDays`,`Test_name`),
  KEY `FK_test_battery_1` (`Test_name`),
  CONSTRAINT `FK_test_battery_1` FOREIGN KEY (`Test_name`) REFERENCES `test_names` (`Test_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `LimitAge` smallint(5) unsigned NOT NULL default '0',
  `Sub_group` int(11) unsigned default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Test_name` (`Test_name`),
  KEY `FK_test_names_1` (`Sub_group`),
  CONSTRAINT `FK_test_names_1` FOREIGN KEY (`Sub_group`) REFERENCES `test_subgroups` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `ID` int(11) unsigned NOT NULL default '0',
  `Subgroup_name` varchar(255) default NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `test_subgroups`
--

LOCK TABLES `test_subgroups` WRITE;
/*!40000 ALTER TABLE `test_subgroups` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_subgroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracking_logs`
--

DROP TABLE IF EXISTS `tracking_logs`;
CREATE TABLE `tracking_logs` (
  `Tracking_log_ID` int(11) NOT NULL auto_increment,
  `Subproject_ID` int(11) default NULL,
  `CenterID` int(11) unsigned default NULL,
  `CandID` int(11) default NULL,
  `PSCID` varchar(255) default NULL,
  `Visit_label` varchar(255) default NULL,
  `aMRI_date` date default NULL,
  `Relaxometry_done` tinyint(1) default NULL,
  `DTI_done` tinyint(1) default NULL,
  `Second_DC_done` tinyint(1) default NULL,
  `MRS_done` tinyint(1) default NULL,
  `MRSI_done` tinyint(1) default NULL,
  `eDTI_done` tinyint(1) default NULL,
  `Lock_record` enum('','Locked','Unlocked') default NULL,
  `Comments` text,
  PRIMARY KEY  (`Tracking_log_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tracking_logs`
--

LOCK TABLES `tracking_logs` WRITE;
/*!40000 ALTER TABLE `tracking_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `tracking_logs` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_perm_rel`
--

LOCK TABLES `user_perm_rel` WRITE;
/*!40000 ALTER TABLE `user_perm_rel` DISABLE KEYS */;
INSERT INTO `user_perm_rel` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16);
/*!40000 ALTER TABLE `user_perm_rel` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'SiteMin',NULL,'Admin account',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',1,0,'N','','Y','N','4817577f267cc8bb20c3e58b48a311b9f6','2006-11-27',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
