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
-- Dumping data for table `data_integrity_flag`
--

TRUNCATE TABLE `data_integrity_flag`;
LOCK TABLES `data_integrity_flag` WRITE;
/*!40000 ALTER TABLE `data_integrity_flag` DISABLE KEYS */;
INSERT INTO `data_integrity_flag` (`dataflag_id`, `dataflag_visitlabel`, `dataflag_instrument`, `dataflag_date`, `dataflag_status`, `dataflag_comment`, `latest_entry`, `dataflag_fbcreated`, `dataflag_fbclosed`, `dataflag_fbcomment`, `dataflag_fbdeleted`, `dataflag_userid`) VALUES (1,'V1','bmi','2016-05-05',1,'',1,0,0,0,0,'admin'),(2,'V2','medical_history','2016-09-08',1,'',0,0,0,0,0,'admin'),(3,'V2','medical_history','2016-08-08',1,'',1,0,0,0,0,'admin'),(4,'V3','medical_history','2016-08-08',1,'',0,0,0,0,0,'admin'),(5,'V3','medical_history','2016-08-10',2,'',0,0,0,0,0,'admin'),(6,'V3','medical_history','2016-08-15',3,'',0,0,0,0,0,'admin'),(7,'V3','medical_history','2016-08-16',4,'',1,0,0,0,0,'admin'),(8,'V6','mri_parameter_form','2016-04-08',1,'',1,0,0,0,0,'admin');
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

-- Dump completed
