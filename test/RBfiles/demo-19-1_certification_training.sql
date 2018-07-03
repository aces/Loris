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
-- Dumping data for table `certification_training`
--

LOCK TABLES `certification_training` WRITE;
/*!40000 ALTER TABLE `certification_training` DISABLE KEYS */;
TRUNCATE TABLE `certification_training`; INSERT INTO `certification_training` (`ID`, `TestID`, `Title`, `Content`, `TrainingType`, `OrderNumber`) VALUES (1,2,'Description','<p>Participants are asked to enter BMI data.</p>','text',1),(2,2,'Test and Score Sheets','<object data=\"AjaxHelper.php?Module=training&script=getTrainingDoc.php&file=bmi.pdf\" type=\"application/pdf\" width=\"100%\" height=\"500\">alt : <a href=\"AjaxHelper.php?Module=training&script=GetTrainingDoc.php&file=bmi.pdf\">bmi.pdf</a></object>','pdf',2),(3,2,'Quiz',NULL,'quiz',3);
/*!40000 ALTER TABLE `certification_training` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
