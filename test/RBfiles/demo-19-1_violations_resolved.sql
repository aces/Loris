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
-- Dumping data for table `violations_resolved`
--

LOCK TABLES `violations_resolved` WRITE;
/*!40000 ALTER TABLE `violations_resolved` DISABLE KEYS */;
TRUNCATE TABLE `violations_resolved`; INSERT INTO `violations_resolved` (`ID`, `hash`, `ExtID`, `TypeTable`, `User`, `ChangeDate`, `Resolved`) VALUES (1,'1419c4074f9a90b215bea32af330f3ed',24,'MRICandidateErrors','admin','2016-08-09 10:13:25','emailed'),(2,'b4a92c3aa1fec4dcb9fc0f681d4f83ee',23,'MRICandidateErrors','admin','2016-08-09 10:13:26','emailed'),(3,'1f6490b7929143cdbce7a7eb3990474e',22,'MRICandidateErrors','admin','2016-08-09 10:13:52','rejected'),(4,'540c72b3241b82e21e673dedcdfdcb37',21,'MRICandidateErrors','admin','2016-08-09 10:13:52','rejected'),(5,'b08de7255e26654eeff2ddd98d9cac0f',20,'MRICandidateErrors','admin','2016-08-09 10:13:52','other'),(6,'f54ff31c91b8802c12e23288208e96cb',19,'MRICandidateErrors','admin','2016-08-09 10:13:53','other'),(7,'080bb9823db445648f90ab0ce9b7b5e0',18,'MRICandidateErrors','admin','2016-08-09 10:14:16','inserted_flag'),(8,'7b778599fbdcc48e37ba71aa3ca4bced',17,'MRICandidateErrors','admin','2016-08-09 10:14:16','inserted'),(9,'fabf6964630649ef31410290f6c77490',16,'MRICandidateErrors','admin','2016-08-09 10:14:16','reran'),(10,'92f96b5fecb2cfa7485b24b91119a414',15,'MRICandidateErrors','admin','2016-08-15 10:46:18','inserted');
/*!40000 ALTER TABLE `violations_resolved` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-11 10:31:47
