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
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
TRUNCATE TABLE `media`; INSERT INTO `media` (`id`, `session_id`, `instrument`, `date_taken`, `comments`, `file_name`, `file_type`, `data_dir`, `uploaded_by`, `hide_file`, `date_uploaded`) VALUES (1,2,NULL,'1001-01-01',NULL,'MTL002_V1.py','text/x-python-script','/data/uploads/','admin',0,'2016-08-11 18:10:57'),(2,2,NULL,'2016-12-31',NULL,'MTL002_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-11 18:06:43'),(3,181,NULL,NULL,NULL,'OTT181_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-15 18:21:15'),(4,1216,NULL,NULL,NULL,'OTT181_V2.txt','text/plain','/data/uploads/','admin',0,'2016-08-15 18:24:34'),(5,10,NULL,NULL,NULL,'MTL010_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:04:07'),(6,13,NULL,NULL,NULL,'MTL013_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:04:33'),(7,18,NULL,NULL,NULL,'MTL018_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:05:08'),(8,20,NULL,NULL,NULL,'MTL020_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:05:28'),(9,30,NULL,NULL,NULL,'MTL030_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:06:15'),(10,31,NULL,NULL,NULL,'MTL031_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:06:32'),(11,48,NULL,NULL,NULL,'MTL048_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:06:46'),(12,61,NULL,NULL,NULL,'MTL061_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:07:08'),(13,68,NULL,NULL,NULL,'MTL068_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:07:25'),(14,95,NULL,NULL,NULL,'MTL095_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:07:46'),(15,1079,NULL,NULL,NULL,'OTT187_V3.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:08:08'),(16,1912,NULL,NULL,NULL,'OTT188_V2.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:08:49'),(17,192,'bmi',NULL,NULL,'OTT192_V1_bmi.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:09:13'),(18,260,NULL,'2016-05-05',NULL,'OTT260_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:09:47'),(19,285,'bmi',NULL,NULL,'OTT285_V1_bmi.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:10:24'),(20,311,'bmi','2016-06-05',NULL,'OTT311_V1_bmi.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:11:11'),(21,323,NULL,NULL,NULL,'OTT323_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:11:34'),(22,324,NULL,NULL,NULL,'OTT324_V1.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:11:50'),(23,1359,NULL,NULL,NULL,'ROM474_V2.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:12:33'),(24,854,NULL,NULL,NULL,'ROM474_V3.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:12:50'),(25,862,NULL,NULL,NULL,'ROM482_V6.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:13:13'),(26,1257,'medical_history',NULL,NULL,'ROM489_V3_medical_history.txt','text/plain','/data/uploads/','admin',0,'2016-08-16 21:13:31'),(27,1053,'bmi','2017-01-01',NULL,'DCC090_V1_bmi.txt','text/plain','/data/uploads/','admin',0,'2018-04-20 22:11:02');
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-07 13:31:39
