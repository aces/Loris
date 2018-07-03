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
-- Dumping data for table `Config`
--

LOCK TABLES `Config` WRITE;
/*!40000 ALTER TABLE `Config` DISABLE KEYS */;
TRUNCATE TABLE `Config`; INSERT INTO `Config` (`ID`, `ConfigID`, `Value`) VALUES (1,2,'1'),(2,3,'LORIS Demonstration Database'),(3,42,'<h3>Example Study Description</h3>\r\n <p>This is a sample description for this study, because it is a new LORIS install that has not yet customized this text.</p>\r\n <p>A LORIS administrator can customize this text in the configuration module, under the configuration option labeled \"Study Description\"</p>\r\n <h3>Useful Links</h3>\r\n <ul>\r\n <li><a href=\"https://github.com/aces/Loris\" >LORIS GitHub Repository</a></li>\r\n <li><a href=\"https://github.com/aces/Loris/wiki/Setup\" >LORIS Setup Guide</a></li>\r\n <li><a href=\"https://www.youtube.com/watch?v=2Syd_BUbl5A\" >A video of a loris on YouTube</a></li>\r\n </ul>'),(4,4,'images/LORIS_lpogo.png'),(5,5,'false'),(6,6,'5'),(7,7,'99'),(8,8,'true'),(9,9,'false'),(10,10,'2016'),(11,11,'2028'),(12,13,'false'),(13,14,'false'),(14,15,'false'),(15,16,'false'),(16,20,'false'),(17,21,'true'),(18,22,'true'),(19,23,'0'),(20,24,'Modify this to your project\'s citation policy'),(22,12,'YMd'),(23,27,'/data/demo/data/'),(24,28,'/var/www/loris/'),(25,29,'/data/'),(26,30,'/PATH/TO/EXTERNAL/LIBRARY/'),(27,31,'/data/demo/data/'),(28,32,'/data/'),(29,33,'tools/logs/'),(30,34,'/data/incoming/'),(31,35,'/data/demo/bin/mri/'),(32,36,'/data/incoming/'),(33,37,'/PATH/TO/Genomic-Data/'),(34,38,'/data/uploads/'),(35,40,'main.css'),(36,41,'25'),(37,44,'132.206.37.73'),(38,45,'http://132.206.37.73'),(39,48,'This database provides an on-line mechanism to store both imaging and behavioral data collected from various locations. Within this framework, there are several tools that will make this process as efficient and simple as possible. For more detailed information regarding any aspect of the database, please click on the Help icon at the top right. Otherwise, feel free to contact us at the DCC. We strive to make data collection almost fun.'),(40,51,'/[a-zA-Z]{3}[0-9]{4}_[0-9]{6}_[vV][0-9]+/'),(41,52,'/./i'),(42,53,'/phantom/i'),(43,54,'/phantom/i'),(44,55,'true'),(45,56,'t1'),(46,56,'t2'),(47,58,'radiology_review'),(48,58,'mri_parameter_form'),(49,60,'no-reply@example.com'),(50,61,'no-reply@example.com'),(51,62,'Produced by LorisDB'),(52,66,'S3cret'),(53,71,'project'),(54,72,'yourname@example.com'),(55,73,'/PATH/TO/get_dicom_info.pl'),(56,74,'1'),(57,75,'0'),(58,76,'dcm2mnc'),(59,77,'/PATH/TO/dicomlib/'),(60,78,'PatientName'),(61,79,'1'),(62,80,'0'),(63,81,'1'),(64,82,'65'),(65,83,'adniT1'),(66,84,'19'),(67,85,'/opt/niak-0.6.4.1/'),(68,86,'INTERLACE_outputDWIFileNameSuffix'),(69,18,'aosi'),(70,18,'bmi'),(72,18,'medical_history'),(73,18,'mri_parameter_form'),(74,18,'radiology_review');
/*!40000 ALTER TABLE `Config` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
