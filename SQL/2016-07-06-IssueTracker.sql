-- MySQL dump 10.13  Distrib 5.5.49, for debian-linux-gnu (x86_64)
--
-- Host: ace-db-1.cbrain.mcgill.ca    Database: caitrin_sandbox
-- ------------------------------------------------------
-- Server version	5.1.73

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
-- Table structure for table `issues`
--

DROP TABLE IF EXISTS `issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `issues` (
  `issueID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reporter` varchar(255) NOT NULL DEFAULT '',
  `assignee` varchar(255) DEFAULT NULL,
  `status` enum('new','acknowledged','assigned','resolved','closed') NOT NULL DEFAULT 'new',
  `comment` longtext,
  `lastUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `priority` enum('low','normal','high','urgent','immediate') NOT NULL DEFAULT 'low',
  `candID` int(6) DEFAULT NULL,
  `sessionID` int(10) unsigned DEFAULT NULL,
  `visitLabel` varchar(255) DEFAULT NULL,
  `centerID` tinyint(2) unsigned DEFAULT NULL,
  `dateCreated` datetime DEFAULT NULL,
  `title` text NOT NULL,
  `category` enum('Anonimyzer/Scheduler/ID (ASID)','API/Mobile','Behavioural QC','CBRAIN hooks','Code fixes','Configurations','Demo','DICOM archive','Documentation','DQT','Genomics','GUI/Bootstrap','Help section','Imaging Browser','Imaging preprocessing scripts','Imaging Uploader','Improvements','Install Process','Instrument Builder','LorisForm','Public Repositories','Release process tasks','Schema','Server/technical','Stand alone Scripts','Statistics','Survey accounts','Testing (Automated)','Testing (Manual)','User accounts/Permissions') DEFAULT NULL,
  `module` enum('Candidate','Clinical','Imaging','Reports','Tools','Admin','New Profile','Access Profile','Reliability','Conflicts Resolver','Examiner','Radiological Reviews','DICOM Archive','Imaging Browser','Statistics','Data Query Tool','Data Dictionary','Document Repository','Data Team Helper','Instrument Builder','User Accounts','Survey Module','Imaging Uploader','Data Integrity','MRI Violated Scans','Configuration','Data Integrity Flag','Instrument Manager','Genomic Browser','Training','Server Processes Manager','Acknowledgements','Data Release','Issue Tracker','Media') DEFAULT NULL,
  `lastUpdatedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`issueID`),
  KEY `fk_issues_1` (`reporter`),
  KEY `fk_issues_2` (`assignee`),
  KEY `fk_issues_3` (`candID`),
  KEY `fk_issues_4` (`sessionID`),
  KEY `fk_issues_5` (`centerID`),
  KEY `fk_issues_6` (`lastUpdatedBy`),
  CONSTRAINT `fk_issues_1` FOREIGN KEY (`reporter`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_issues_2` FOREIGN KEY (`assignee`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_issues_3` FOREIGN KEY (`candID`) REFERENCES `candidate` (`CandID`),
  CONSTRAINT `fk_issues_4` FOREIGN KEY (`sessionID`) REFERENCES `session` (`ID`),
  CONSTRAINT `fk_issues_5` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `fk_issues_6` FOREIGN KEY (`lastUpdatedBy`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

--
-- Table structure for table `issues_watching`
--

DROP TABLE IF EXISTS `issues_watching`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `issues_watching` (
  `userID` varchar(255) NOT NULL DEFAULT '',
  `issueID` int(11) unsigned NOT NULL,
  PRIMARY KEY (`userID`,`issueID`),
  KEY `fk_issues_watching_2` (`issueID`),
  CONSTRAINT `fk_issues_watching_2` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`),
  CONSTRAINT `fk_issues_watching_1` FOREIGN KEY (`userID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issues_watching`
--

LOCK TABLES `issues_watching` WRITE;
/*!40000 ALTER TABLE `issues_watching` DISABLE KEYS */;
/*!40000 ALTER TABLE `issues_watching` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (55,'issue_tracker_view_allsites','Can view issues across all sites',2),(56,'issue_tracker_can_assign','Can assign issues to users',2),(57,'issue_tracker_can_change_status','Can change issue status',2);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;



/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-07-06 17:46:34
