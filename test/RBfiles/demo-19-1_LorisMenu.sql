-- MySQL dump 10.16  Distrib 10.1.32-MariaDB, for Linux (x86_64)
--
-- Host: 192.168.122.1    Database: Demo
-- ------------------------------------------------------
-- Server version	5.1.73

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `LorisMenu`
--

LOCK TABLES `LorisMenu` WRITE;
/*!40000 ALTER TABLE `LorisMenu` DISABLE KEYS */;
TRUNCATE TABLE `LorisMenu`; INSERT INTO `LorisMenu` (`ID`, `Parent`, `Label`, `Link`, `Visible`, `OrderNumber`) VALUES (1,NULL,'Candidate',NULL,NULL,1),(2,NULL,'Clinical',NULL,NULL,2),(3,NULL,'Imaging',NULL,NULL,3),(4,NULL,'Reports',NULL,NULL,4),(5,NULL,'Tools',NULL,NULL,5),(6,NULL,'Admin',NULL,NULL,6),(7,1,'New Profile','new_profile/',NULL,1),(8,1,'Access Profile','candidate_list/',NULL,2),(9,2,'Reliability','reliability/',NULL,1),(10,2,'Conflict Resolver','conflict_resolver/',NULL,2),(11,2,'Examiner','examiner/',NULL,3),(12,2,'Training','training/',NULL,4),(13,2,'Media','media/',NULL,5),(14,3,'DICOM Archive','dicom_archive/',NULL,1),(15,3,'Imaging Browser','imaging_browser/',NULL,2),(16,3,'MRI Violated Scans','mri_violations/',NULL,3),(17,3,'Imaging Uploader','imaging_uploader/',NULL,4),(18,4,'Statistics','statistics/',NULL,1),(19,4,'Data Query Tool','dataquery/',NULL,2),(20,5,'Data Dictionary','datadict/',NULL,1),(21,5,'Document Repository','document_repository/',NULL,2),(22,5,'Data Integrity Flag','data_integrity_flag/',NULL,3),(23,5,'Data Team Helper','data_team_helper/',NULL,4),(24,5,'Instrument Builder','instrument_builder/',NULL,5),(25,5,'Genomic Browser','genomic_browser/',NULL,6),(26,5,'Data Release','data_release/',NULL,7),(27,5,'Acknowledgements','acknowledgements/',NULL,8),(28,5,'Issue Tracker','issue_tracker/',NULL,9),(29,6,'User Accounts','user_accounts/',NULL,1),(30,6,'Survey Module','survey_accounts/',NULL,2),(31,6,'Help Editor','help_editor/',NULL,3),(32,6,'Instrument Manager','instrument_manager/',NULL,4),(33,6,'Configuration','configuration/',NULL,5),(34,6,'Server Processes Manager','server_processes_manager/',NULL,6);
/*!40000 ALTER TABLE `LorisMenu` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-07 13:31:35
