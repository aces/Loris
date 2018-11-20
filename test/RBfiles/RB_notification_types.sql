-- MySQL dump 10.13  Distrib 5.5.62, for debian-linux-gnu (x86_64)
--
-- Host: ace-db-1.cbrain.mcgill.ca    Database: rida_demo
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
-- Dumping data for table `notification_types`
--

TRUNCATE TABLE `notification_types`;
LOCK TABLES `notification_types` WRITE;
/*!40000 ALTER TABLE `notification_types` DISABLE KEYS */;
INSERT INTO `notification_types` (`NotificationTypeID`, `Type`, `private`, `Description`) VALUES (11,'mri new study',0,'New studies processed by the MRI upload handler'),(12,'mri new series',0,'New series processed by the MRI upload handler'),(13,'mri upload handler emergency',1,'MRI upload handler emergencies'),(14,'mri staging required',1,'New studies received by the MRI upload handler that require staging'),(15,'mri invalid study',0,'Incorrectly labelled studies received by the MRI upload handler'),(16,'hardcopy request',0,'Hardcopy requests'),(17,'visual bvl qc',0,'Timepoints selected for visual QC'),(18,'mri qc status',0,'MRI QC Status change'),(19,'minc insertion',1,'Insertion of the mincs into the mri-table'),(20,'tarchive loader',1,'calls specific Insertion Scripts'),(21,'tarchive validation',1,'Validation of the dicoms After uploading'),(22,'mri upload runner',1,'Validation of DICOMS before uploading'),(23,'mri upload processing class',1,'Validation and execution of DicomTar.pl and TarchiveLoader');
/*!40000 ALTER TABLE `notification_types` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
