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
-- Dumping data for table `document_repository`
--

LOCK TABLES `document_repository` WRITE;
/*!40000 ALTER TABLE `document_repository` DISABLE KEYS */;
TRUNCATE TABLE `document_repository`; INSERT INTO `document_repository` (`record_id`, `PSCID`, `Instrument`, `visitLabel`, `Date_taken`, `Date_uploaded`, `Data_dir`, `File_name`, `File_type`, `version`, `File_size`, `uploaded_by`, `For_site`, `comments`, `multipart`, `EARLI`, `hide_video`, `File_category`) VALUES (1,'','','',NULL,'2016-07-27 22:00:10','admin/bread-breakfast-knife.jpg','bread-breakfast-knife.jpg','jpg','1',439412,'admin',2,' ',NULL,0,0,2),(2,'','','',NULL,'2016-07-27 22:00:47','admin/bread-food-healthy-breakfast.jpg','bread-food-healthy-breakfast.jpg','jpg','2',1336341,'admin',2,' ',NULL,0,0,2),(3,'','','',NULL,'2016-07-27 22:02:58','admin/bread-food-healthy-breakfast.jpg','bread-food-healthy-breakfast.jpg','jpg','1',1336341,'admin',2,' ',NULL,0,0,2),(4,'','','',NULL,'2016-07-27 22:04:00','admin/test.txt','test.txt','txt','',29,'admin',3,' ',NULL,0,0,1),(5,'','','',NULL,'2016-07-27 22:04:53','admin/test.pdf','test.pdf','pdf','',7581,'admin',4,' ',NULL,0,0,3),(6,'','radiology_review','',NULL,'2016-07-27 22:05:36','admin/test.pdf','test.pdf','pdf','',7581,'admin',2,' ',NULL,0,0,3),(7,'','medical_history','',NULL,'2016-07-27 22:05:59','admin/test.pdf','test.pdf','pdf','',7581,'admin',3,' ',NULL,0,0,3),(8,'MTL003','bmi','V1',NULL,'2016-07-27 22:06:43','admin/test.txt','test.txt','txt','',29,'admin',2,' ',NULL,0,0,1),(10,NULL,NULL,NULL,NULL,'2018-04-20 18:29:00','admin/test_test.txt','test_test.txt','txt',NULL,353,'admin',1,NULL,NULL,0,0,1),(11,NULL,NULL,NULL,NULL,'2018-04-20 18:29:27','admin/test_test.txt','test_test.txt','txt',NULL,353,'admin',1,NULL,NULL,0,0,1),(12,NULL,NULL,NULL,NULL,'2018-04-20 18:29:58','admin/test_test.txt','test_test.txt','txt',NULL,353,'admin',1,NULL,NULL,0,0,3);
/*!40000 ALTER TABLE `document_repository` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
