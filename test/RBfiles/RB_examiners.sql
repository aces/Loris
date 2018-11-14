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
-- Dumping data for table `examiners`
--

TRUNCATE TABLE `examiners`;
LOCK TABLES `examiners` WRITE;
/*!40000 ALTER TABLE `examiners` DISABLE KEYS */;
INSERT INTO `examiners` (`examinerID`, `full_name`, `radiologist`, `userID`) VALUES (1,'Katrina Cane',1,NULL),(2,'Marcel Getter',1,NULL),(4,'Brad Bitt',0,NULL),(5,'Rosie Oh',0,NULL),(6,'Kimmy Ellis',1,NULL),(7,'Angelina Joe',1,NULL),(8,'DCC Examiner',0,NULL),(9,'Christina Smith',0,NULL),(10,'Dave MacDonald',0,NULL),(16,'John Smith',0,NULL),(17,'Jane Doe',0,NULL),(18,'Alex Li',0,NULL),(19,'Leigh Mac',0,NULL),(20,'Rid Ah',0,NULL),(21,'Hazel Hurr',0,NULL),(22,'Sarah Lo',0,NULL),(23,'Ray Sin',0,NULL),(24,'Harvey Cohen',0,NULL),(25,'Ellie Richman',0,NULL),(26,'Christine Brose',0,NULL),(27,'Rosie Lee',0,NULL);
/*!40000 ALTER TABLE `examiners` ENABLE KEYS */;
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
