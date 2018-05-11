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
-- Dumping data for table `certification_history`
--

LOCK TABLES `certification_history` WRITE;
/*!40000 ALTER TABLE `certification_history` DISABLE KEYS */;
TRUNCATE TABLE `certification_history`; INSERT INTO `certification_history` (`id`, `col`, `old`, `old_date`, `new`, `new_date`, `primaryCols`, `primaryVals`, `testID`, `visit_label`, `changeDate`, `userID`, `type`) VALUES (8,'certified',NULL,NULL,NULL,NULL,'certID',NULL,NULL,NULL,'2016-06-29 17:34:44','admin','D'),(9,'certified',NULL,NULL,NULL,NULL,'certID',NULL,NULL,NULL,'2016-06-29 17:34:44','admin','D'),(10,'pass',NULL,NULL,'certified','2016-06-29','certID','8',2,NULL,'2016-06-29 17:38:27','admin','I'),(11,'pass','certified','2016-06-29','not_certified','2016-06-29','certID','8',2,NULL,'2016-06-29 17:38:42','admin','U'),(12,'pass','not_certified','2016-06-29','in_training','2016-06-14','certID','8',2,NULL,'2016-06-29 17:40:07','admin','U'),(13,'pass','in_training','2016-06-14','certified','2016-06-14','certID','8',2,NULL,'2016-06-29 17:44:40','admin','U'),(14,'pass',NULL,NULL,'certified','2016-06-29','certID','9',2,NULL,'2016-06-29 17:44:57','admin','I'),(15,'pass',NULL,NULL,'certified','2016-06-22','certID','10',2,NULL,'2016-06-29 17:45:19','admin','I'),(16,'certified',NULL,NULL,NULL,NULL,'certID',NULL,NULL,NULL,'2016-06-29 17:45:42','slee@loris-hackathon.cbrain.mcgill.ca','D'),(17,'pass',NULL,NULL,'certified','2016-12-31','certID','11',2,NULL,'2016-07-27 17:24:35','admin','I'),(18,'pass','certified','2016-12-31','','1001-01-01','certID','11',2,NULL,'2016-07-27 17:24:44','admin','U'),(19,'pass','','1001-01-01','certified','2016-12-31','certID','11',2,NULL,'2016-07-27 17:25:11','admin','U'),(20,'pass',NULL,NULL,'certified','2008-01-04','certID','12',2,NULL,'2016-08-15 19:50:00','admin','I'),(21,'pass',NULL,NULL,'certified','2003-03-03','certID','13',2,NULL,'2016-08-16 22:41:50','admin','I'),(22,'pass',NULL,NULL,'certified','2003-04-05','certID','14',1,NULL,'2016-08-16 22:41:50','admin','I'),(23,'pass',NULL,NULL,'in_training','2004-05-06','certID','15',2,NULL,'2016-08-16 22:42:18','admin','I'),(24,'pass',NULL,NULL,'in_training','2016-05-05','certID','16',2,NULL,'2016-08-16 22:42:31','admin','I'),(25,'pass',NULL,NULL,'in_training','2016-05-05','certID','17',1,NULL,'2016-08-16 22:42:31','admin','I'),(26,'pass',NULL,NULL,'certified','2008-09-08','certID','18',2,NULL,'2016-08-16 22:42:43','admin','I'),(27,'pass',NULL,NULL,'certified','2009-09-08','certID','19',1,NULL,'2016-08-16 22:42:43','admin','I'),(28,'pass',NULL,NULL,'certified','2011-09-01','certID','20',1,NULL,'2016-08-16 22:42:51','admin','I'),(29,'pass',NULL,NULL,'certified','2005-09-07','certID','21',2,NULL,'2016-08-16 22:43:07','admin','I'),(30,'pass',NULL,NULL,'in_training','2016-05-05','certID','22',1,NULL,'2016-08-16 22:43:08','admin','I'),(31,'pass',NULL,NULL,'certified','2014-04-04','certID','23',2,NULL,'2016-08-16 22:43:36','admin','I'),(32,'pass',NULL,NULL,'certified','2016-05-01','certID','24',1,NULL,'2016-08-16 22:43:36','admin','I'),(33,'pass',NULL,NULL,'in_training','2016-05-06','certID','25',2,NULL,'2016-08-16 22:43:48','admin','I'),(34,'pass',NULL,NULL,'in_training','2016-05-09','certID','26',1,NULL,'2016-08-16 22:43:49','admin','I'),(35,'pass',NULL,NULL,'certified','2006-09-01','certID','27',2,NULL,'2016-08-16 22:44:00','admin','I'),(36,'pass',NULL,NULL,'certified','2011-11-11','certID','28',1,NULL,'2016-08-16 22:44:00','admin','I'),(37,'pass',NULL,NULL,'in_training','2016-05-04','certID','29',2,NULL,'2016-08-16 22:44:29','admin','I'),(38,'pass',NULL,NULL,'certified','2016-04-03','certID','30',1,NULL,'2016-08-16 22:44:37','admin','I'),(39,'pass',NULL,NULL,'certified','2009-08-05','certID','31',2,NULL,'2016-08-16 22:44:51','admin','I'),(40,'pass',NULL,NULL,'certified','2000-02-01','certID','32',1,NULL,'2016-08-16 22:44:52','admin','I'),(41,'pass',NULL,NULL,'in_training','2016-05-09','certID','33',2,NULL,'2016-08-16 22:45:09','admin','I'),(42,'pass',NULL,NULL,'certified','2005-09-04','certID','34',1,NULL,'2016-08-16 22:45:09','admin','I'),(43,'pass',NULL,NULL,'certified','2009-09-08','certID','35',1,NULL,'2016-08-16 22:45:19','admin','I'),(44,'pass',NULL,NULL,'certified','2000-01-01','certID','36',2,NULL,'2016-08-16 22:45:35','admin','I'),(45,'pass',NULL,NULL,'certified','2000-01-01','certID','37',1,NULL,'2016-08-16 22:45:36','admin','I');
/*!40000 ALTER TABLE `certification_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-11 10:31:40
