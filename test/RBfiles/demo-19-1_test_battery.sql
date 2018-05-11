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
-- Dumping data for table `test_battery`
--

LOCK TABLES `test_battery` WRITE;
/*!40000 ALTER TABLE `test_battery` DISABLE KEYS */;
TRUNCATE TABLE `test_battery`; INSERT INTO `test_battery` (`ID`, `Test_name`, `AgeMinDays`, `AgeMaxDays`, `Active`, `Stage`, `SubprojectID`, `Visit_label`, `CenterID`, `firstVisit`, `instr_order`) VALUES (131,'aosi',1,2147483647,'Y','Visit',NULL,'V1',NULL,NULL,NULL),(132,'aosi',1,2147483647,'Y','Visit',NULL,'V2',NULL,NULL,NULL),(133,'aosi',1,2147483647,'Y','Visit',NULL,'V3',NULL,NULL,NULL),(134,'radiology_review',1,2147483647,'Y','Visit',1,'V1',NULL,NULL,NULL),(135,'radiology_review',1,2147483647,'Y','Visit',2,'V1',NULL,NULL,NULL),(136,'radiology_review',1,2147483647,'Y','Visit',1,'V2',NULL,NULL,NULL),(137,'radiology_review',1,2147483647,'Y','Visit',2,'V2',NULL,NULL,NULL),(138,'mri_parameter_form',1,2147483647,'Y','Visit',1,'V1',NULL,NULL,NULL),(139,'mri_parameter_form',1,2147483647,'Y','Visit',2,'V1',NULL,NULL,NULL),(140,'mri_parameter_form',1,2147483647,'Y','Visit',3,'V1',NULL,NULL,NULL),(141,'mri_parameter_form',1,2147483647,'Y','Visit',4,'V1',NULL,NULL,NULL),(142,'mri_parameter_form',1,2147483647,'Y','Visit',1,'V2',NULL,NULL,NULL),(143,'mri_parameter_form',1,2147483647,'Y','Visit',2,'V2',NULL,NULL,NULL),(144,'mri_parameter_form',1,2147483647,'Y','Visit',3,'V2',NULL,NULL,NULL),(145,'mri_parameter_form',1,2147483647,'Y','Visit',4,'V2',NULL,NULL,NULL),(146,'mri_parameter_form',1,2147483647,'Y','Visit',1,'V3',NULL,NULL,NULL),(147,'mri_parameter_form',1,2147483647,'Y','Visit',2,'V3',NULL,NULL,NULL),(148,'mri_parameter_form',1,2147483647,'Y','Visit',3,'V3',NULL,NULL,NULL),(149,'mri_parameter_form',1,2147483647,'Y','Visit',4,'V3',NULL,NULL,NULL),(150,'mri_parameter_form',1,2147483647,'Y','Visit',3,'V4',NULL,NULL,NULL),(151,'mri_parameter_form',1,2147483647,'Y','Visit',4,'V4',NULL,NULL,NULL),(152,'mri_parameter_form',1,2147483647,'Y','Visit',3,'V5',NULL,NULL,NULL),(153,'mri_parameter_form',1,2147483647,'Y','Visit',4,'V5',NULL,NULL,NULL),(154,'mri_parameter_form',1,2147483647,'Y','Visit',3,'V6',NULL,NULL,NULL),(155,'mri_parameter_form',1,2147483647,'Y','Visit',4,'V6',NULL,NULL,NULL),(156,'medical_history',1,2147483647,'Y','Visit',NULL,'V1',NULL,NULL,NULL),(157,'medical_history',1,2147483647,'Y','Visit',NULL,'V2',NULL,NULL,NULL),(158,'medical_history',1,2147483647,'Y','Visit',NULL,'V3',NULL,NULL,NULL),(159,'medical_history',1,2147483647,'Y','Visit',NULL,'V4',NULL,NULL,NULL),(160,'medical_history',1,2147483647,'Y','Visit',NULL,'V5',NULL,NULL,NULL),(161,'medical_history',1,2147483647,'Y','Visit',NULL,'V6',NULL,NULL,NULL),(162,'bmi',1,2147483647,'Y','Visit',1,'V1',NULL,NULL,NULL),(163,'bmi',1,2147483647,'Y','Visit',2,'V1',NULL,NULL,NULL);
/*!40000 ALTER TABLE `test_battery` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-11 10:31:47
