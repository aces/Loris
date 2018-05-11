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
-- Dumping data for table `feedback_mri_predefined_comments`
--

LOCK TABLES `feedback_mri_predefined_comments` WRITE;
/*!40000 ALTER TABLE `feedback_mri_predefined_comments` DISABLE KEYS */;
TRUNCATE TABLE `feedback_mri_predefined_comments`; INSERT INTO `feedback_mri_predefined_comments` (`PredefinedCommentID`, `CommentTypeID`, `Comment`) VALUES (40,2,'missing slices'),(41,2,'reduced dynamic range due to bright artifact/pixel'),(42,2,'slice to slice intensity differences'),(43,2,'noisy scan'),(44,2,'susceptibilty artifact above the ear canals.'),(45,2,'susceptibilty artifact due to dental work'),(46,2,'sagittal ghosts'),(47,3,'slight ringing artefacts'),(48,3,'severe ringing artefacts'),(49,3,'movement artefact due to eyes'),(50,3,'movement artefact due to carotid flow'),(51,4,'slight movement between packets'),(52,4,'large movement between packets'),(53,5,'Large AP wrap around, affecting brain'),(54,5,'Medium AP wrap around, no affect on brain'),(55,5,'Small AP wrap around, no affect on brain'),(56,5,'Too tight LR, cutting into scalp'),(57,5,'Too tight LR, affecting brain'),(58,5,'Top of scalp cut off'),(59,5,'Top of brain cut off'),(60,5,'Base of cerebellum cut off'),(61,5,'missing top third - minc conversion?'),(62,6,'copy of prev data'),(63,2,'checkerboard artifact'),(64,2,'horizontal intensity striping (Venetian blind effect, DWI ONLY)'),(65,2,'diagonal striping (NRRD artifact, DWI ONLY)'),(66,2,'high intensity in direction of acquisition'),(67,2,'signal loss (dark patches)'),(68,8,'red artifact'),(69,8,'green artifact'),(70,8,'blue artifact'),(71,6,'Too few remaining gradients (DWI ONLY)'),(72,6,'No b0 remaining after DWIPrep (DWI ONLY)'),(73,6,'No gradient information available from scanner (DWI ONLY)'),(74,6,'Incorrect diffusion direction (DWI ONLY)'),(75,6,'Duplicate series'),(76,3,'slice wise artifact (DWI ONLY)'),(77,3,'gradient wise artifact (DWI ONLY)'),(78,2,'susceptibility artifact due to anatomy');
/*!40000 ALTER TABLE `feedback_mri_predefined_comments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
