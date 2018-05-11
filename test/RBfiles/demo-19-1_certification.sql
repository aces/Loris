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
-- Dumping data for table `certification`
--

LOCK TABLES `certification` WRITE;
/*!40000 ALTER TABLE `certification` DISABLE KEYS */;
TRUNCATE TABLE `certification`; INSERT INTO `certification` (`certID`, `examinerID`, `date_cert`, `visit_label`, `testID`, `pass`, `comment`) VALUES (8,1,'2016-06-14',NULL,2,'certified',''),(9,3,'2016-06-29',NULL,2,'certified',''),(11,4,'2016-12-31',NULL,2,'certified',''),(12,2,'2008-01-04',NULL,2,'certified',''),(13,18,'2003-03-03',NULL,2,'certified',''),(14,18,'2003-04-05',NULL,1,'certified',''),(15,25,'2004-05-06',NULL,2,'in_training',''),(16,21,'2016-05-05',NULL,2,'in_training',''),(17,21,'2016-05-05',NULL,1,'in_training',''),(18,16,'2008-09-08',NULL,2,'certified',''),(19,16,'2009-09-08',NULL,1,'certified',''),(20,14,'2011-09-01',NULL,1,'certified',''),(21,22,'2005-09-07',NULL,2,'certified',''),(22,22,'2016-05-05',NULL,1,'in_training',''),(23,10,'2014-04-04',NULL,2,'certified',''),(24,10,'2016-05-01',NULL,1,'certified',''),(25,24,'2016-05-06',NULL,2,'in_training',''),(26,24,'2016-05-09',NULL,1,'in_training',''),(27,17,'2006-09-01',NULL,2,'certified',''),(28,17,'2011-11-11',NULL,1,'certified',''),(29,26,'2016-05-04',NULL,2,'in_training',''),(30,26,'2016-04-03',NULL,1,'certified',''),(31,23,'2009-08-05',NULL,2,'certified',''),(32,23,'2000-02-01',NULL,1,'certified',''),(33,27,'2016-05-09',NULL,2,'in_training',''),(34,27,'2005-09-04',NULL,1,'certified',''),(35,11,'2009-09-08',NULL,1,'certified',''),(36,8,'2000-01-01',NULL,2,'certified',''),(37,8,'2000-01-01',NULL,1,'certified','');
/*!40000 ALTER TABLE `certification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-11 10:31:40
