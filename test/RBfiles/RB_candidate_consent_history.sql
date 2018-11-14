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
-- Dumping data for table `candidate_consent_history`
--

TRUNCATE TABLE `candidate_consent_history`;
LOCK TABLES `candidate_consent_history` WRITE;
/*!40000 ALTER TABLE `candidate_consent_history` DISABLE KEYS */;
INSERT INTO `candidate_consent_history` (`CandidateConsentHistoryID`, `EntryDate`, `DateGiven`, `DateWithdrawn`, `PSCID`, `ConsentName`, `ConsentLabel`, `Status`, `EntryStaff`) VALUES (1,'2016-06-21 20:29:43','1001-01-01','1001-01-01','ROM484','study_consent','Consent to Study',NULL,'admin'),(2,'2016-06-21 20:30:38','1001-01-01','1001-01-01','ROM439','study_consent','Consent to Study',NULL,'admin'),(3,'2016-06-21 20:30:52','1001-01-01','1001-01-01','OTT256','study_consent','Consent to Study',NULL,'admin'),(4,'2016-06-21 20:31:02','1001-01-01','1001-01-01','MTL126','study_consent','Consent to Study',NULL,'admin'),(5,'2016-06-21 20:31:30','1001-01-01','1001-01-01','OTT256','study_consent','Consent to Study',NULL,'admin'),(6,'2016-06-21 20:31:46','1001-01-01','1001-01-01','MTL126','study_consent','Consent to Study',NULL,'admin'),(7,'2016-06-21 20:32:14','1001-01-01','1001-01-01','ROM484','study_consent','Consent to Study',NULL,'admin'),(8,'2016-06-21 20:32:47','1001-01-01','1001-01-01','MTL126','study_consent','Consent to Study',NULL,'admin'),(9,'2016-06-21 20:33:48','1001-01-01','1001-01-01','ROM439','study_consent','Consent to Study',NULL,'admin'),(10,'2016-06-21 20:34:21','1001-01-01','1001-01-01','ROM439','study_consent','Consent to Study',NULL,'admin'),(11,'2016-09-02 17:57:55','2015-12-31','1001-01-01','DCC090','study_consent','Consent to Study','yes','admin'),(12,'2016-09-02 17:58:24','2015-12-31','1001-01-01','DCC090','study_consent','Consent to Study','yes','admin'),(13,'2016-09-09 22:36:30',NULL,'2015-12-31','DCC090','study_consent','Consent to Study','no','admin'),(14,'2016-09-24 06:13:39',NULL,NULL,'MTL001','study_consent','Consent to Study','no','admin'),(15,'2016-09-24 06:14:04',NULL,NULL,'MTL001','study_consent','Consent to Study','no','admin'),(16,'2016-09-24 06:16:54',NULL,NULL,'MTL001','study_consent','Consent to Study','no','admin'),(17,'2016-09-24 06:17:32',NULL,NULL,'MTL001','study_consent','Consent to Study','no','admin'),(18,'2016-09-24 06:17:46',NULL,NULL,'MTL001','study_consent','Consent to Study','no','admin'),(19,'2016-09-24 06:19:17','2015-12-31',NULL,'MTL001','study_consent','Consent to Study','yes','admin'),(20,'2016-10-08 01:02:40','2015-10-30',NULL,'MTL005','study_consent','Consent to Study','yes','admin');
/*!40000 ALTER TABLE `candidate_consent_history` ENABLE KEYS */;
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
