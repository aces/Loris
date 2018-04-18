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
-- Dumping data for table `issues`
--

LOCK TABLES `issues` WRITE;
/*!40000 ALTER TABLE `issues` DISABLE KEYS */;
TRUNCATE TABLE `issues`; INSERT INTO `issues` (`issueID`, `title`, `reporter`, `assignee`, `status`, `priority`, `module`, `dateCreated`, `lastUpdate`, `lastUpdatedBy`, `sessionID`, `centerID`, `candID`, `category`) VALUES (14,'Need form added','admin','admin','closed','high',NULL,'2016-09-01 10:47:54','2016-09-01 18:49:55','admin',NULL,2,300001,NULL),(15,'Need form added','admin','admin','new','low',NULL,'2016-09-01 10:51:46','2016-09-02 20:28:38','admin',NULL,2,300002,NULL),(16,'new issue to test assignee notification','admin','admin','new','low',21,'2016-09-02 12:30:38','2016-09-02 20:30:38','admin',NULL,NULL,NULL,NULL),(17,'another ticket to test assignment notification','admin','admin','new','low',NULL,'2016-09-02 12:31:45','2016-09-02 20:31:45','admin',NULL,NULL,NULL,NULL),(18,'ticket 3 testing email','admin','admin','new','low',NULL,'2016-09-02 12:33:47','2016-09-02 20:33:47','admin',NULL,NULL,NULL,NULL),(19,'testing if assignee gets email  - new ticket','admin','admin','feedback','urgent',11,'2016-09-02 13:59:55','2016-09-02 21:59:55','admin',NULL,3,NULL,NULL),(20,'testing if assignee gets email upon ticket update+re-assign','admin','admin','feedback','urgent',12,'2016-09-02 14:02:29','2016-09-02 22:04:38','admin',NULL,NULL,NULL,NULL),(21,'ticket to end all tickets ','admin','admin','new','low',NULL,'2016-09-02 15:45:39','2016-09-02 23:45:39','admin',NULL,NULL,NULL,NULL),(22,'ticket to end all tickets ','admin','admin','new','low',NULL,'2016-09-02 15:46:32','2016-09-02 23:46:32','admin',NULL,NULL,NULL,NULL),(23,'ticket to end all tickets ','admin','admin','new','low',NULL,'2016-09-02 15:46:48','2016-09-02 23:46:48','admin',NULL,3,NULL,NULL),(24,'ticket to end all tickets ','admin','admin','new','low',NULL,'2016-09-02 15:46:56','2016-09-02 23:46:56','admin',NULL,NULL,NULL,NULL),(25,'ticket to end all tickets ','admin','admin','new','low',NULL,'2016-09-02 15:47:01','2016-09-02 23:47:01','admin',NULL,NULL,NULL,NULL),(26,'testing site population','admin','admin','new','low',11,'2016-09-06 17:19:20','2016-09-07 01:19:20','admin',NULL,2,NULL,NULL),(27,'test ticket with visit label','admin','admin','new','low',10,'2016-09-06 17:38:06','2016-09-07 01:39:23','admin',2,3,300002,NULL);
/*!40000 ALTER TABLE `issues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-07 13:31:38
