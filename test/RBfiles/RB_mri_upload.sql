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
-- Dumping data for table `mri_upload`
--

TRUNCATE TABLE `mri_upload`;
LOCK TABLES `mri_upload` WRITE;
/*!40000 ALTER TABLE `mri_upload` DISABLE KEYS */;
INSERT INTO `mri_upload` (`UploadID`, `UploadedBy`, `UploadDate`, `UploadLocation`, `DecompressedLocation`, `InsertionComplete`, `Inserting`, `PatientName`, `number_of_mincInserted`, `number_of_mincCreated`, `TarchiveID`, `SessionID`, `IsCandidateInfoValidated`, `IsTarchiveValidated`, `IsPhantom`) VALUES (45,'admin','2016-08-09 09:49:11','/data/incoming//ROM168_400168_V2.zip','/tmp/ImagingUpload-9-49-c2kcyU',1,0,'ROM168_400168_V2',1,1,2,22,1,1,'N'),(46,'admin','2016-08-09 09:53:44','/data/incoming//ROM179_400179_V4.zip','/tmp/ImagingUpload-9-53-28LFxd',0,0,'ROM179_400179_V4',NULL,NULL,4,559,1,1,'N'),(47,'admin','2016-08-09 09:58:13','/data/incoming//ROM184_400184_V3.zip','/tmp/ImagingUpload-9-58-AG83Sy',1,0,'ROM184_400184_V3',3,3,5,680,1,1,'N'),(48,'admin','2016-08-09 09:58:52','/data/incoming//ROM199_400199_V5.zip','/tmp/ImagingUpload-9-58-fadMZ0',0,0,'ROM199_400199_V5',NULL,NULL,16,579,1,1,'N'),(49,'admin','2016-08-09 10:04:00','/data/incoming//ROM240_400240_V6.zip','/tmp/ImagingUpload-10-4-XYeisQ',0,0,'ROM240_400240_V6',NULL,NULL,10,620,1,1,'N'),(50,'admin','2016-08-09 10:07:20','/data/incoming//ROM280_400280_V3.zip','/tmp/ImagingUpload-10-7-Td1UFY',1,0,'ROM280_400280_V3',3,3,5,680,1,1,'N'),(51,'admin','2016-08-09 10:11:52','/data/incoming//ROM300_400300_V1.zip','/tmp/ImagingUpload-10-11-IgBrKC',1,0,'ROM300_400300_V1',3,3,5,680,1,1,'N'),(52,'admin','2016-08-09 14:14:58','/data/incoming//MTL022_300022_V1.zip','/tmp/ImagingUpload-14-14-qM69wJ',1,0,'MTL022_300022_V1',1,1,2,22,1,1,'N'),(53,'admin','2016-08-09 14:21:28','/data/incoming//MTL023_300023_V3.zip','/tmp/ImagingUpload-14-37-udS3wK',0,0,'MTL023_300023_V3',NULL,NULL,NULL,1098,1,0,'N');
/*!40000 ALTER TABLE `mri_upload` ENABLE KEYS */;
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
