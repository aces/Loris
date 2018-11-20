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
-- Dumping data for table `issues_history`
--

TRUNCATE TABLE `issues_history`;
LOCK TABLES `issues_history` WRITE;
/*!40000 ALTER TABLE `issues_history` DISABLE KEYS */;
INSERT INTO `issues_history` (`issueHistoryID`, `newValue`, `dateAdded`, `fieldChanged`, `issueID`, `addedBy`) VALUES (1,'admin','2016-09-01 18:47:54','assignee',14,'admin'),(2,'normal','2016-09-01 18:47:54','priority',14,'admin'),(3,'2','2016-09-01 18:47:55','centerID',14,'admin'),(4,'Need form added','2016-09-01 18:47:55','title',14,'admin'),(5,'Behavioural Instruments','2016-09-01 18:47:55','category',14,'admin'),(6,'300001','2016-09-01 18:47:55','comment',14,'admin'),(7,'admin','2016-09-01 18:47:55','comment',14,'admin'),(8,'2016-09-01 10:47:54','2016-09-01 18:47:56','comment',14,'admin'),(9,'high','2016-09-01 18:49:25','priority',14,'admin'),(10,'feedback','2016-09-01 18:49:36','status',14,'admin'),(11,'closed','2016-09-01 18:49:55','status',14,'admin'),(12,'admin','2016-09-01 18:51:46','assignee',15,'admin'),(13,'2','2016-09-01 18:51:46','centerID',15,'admin'),(14,'Need form added','2016-09-01 18:51:47','title',15,'admin'),(15,'Behavioural Instruments','2016-09-01 18:51:47','category',15,'admin'),(16,'300002','2016-09-01 18:51:47','comment',15,'admin'),(17,'admin','2016-09-01 18:51:47','comment',15,'admin'),(18,'2016-09-01 10:51:46','2016-09-01 18:51:47','comment',15,'admin'),(19,'admin','2016-09-02 20:30:38','assignee',16,'tester'),(20,'new issue to test assignee notification','2016-09-02 20:30:38','title',16,'tester'),(21,'Examiners','2016-09-02 20:30:38','category',16,'tester'),(22,'21','2016-09-02 20:30:39','module',16,'tester'),(23,'tester','2016-09-02 20:30:39','comment',16,'tester'),(24,'2016-09-02 12:30:38','2016-09-02 20:30:39','comment',16,'tester'),(25,'tester','2016-09-02 20:31:45','assignee',17,'tester'),(26,'another ticket to test assignment notification','2016-09-02 20:31:46','title',17,'tester'),(27,'tester','2016-09-02 20:31:46','comment',17,'tester'),(28,'2016-09-02 12:31:45','2016-09-02 20:31:46','comment',17,'tester'),(29,'admin','2016-09-02 20:33:47','assignee',18,'tester'),(30,'ticket 3 testing email','2016-09-02 20:33:47','title',18,'tester'),(31,'tester','2016-09-02 20:33:48','comment',18,'tester'),(32,'2016-09-02 12:33:47','2016-09-02 20:33:48','comment',18,'tester'),(33,'admin','2016-09-02 21:59:55','assignee',19,'tester'),(34,'feedback','2016-09-02 21:59:55','status',19,'tester'),(35,'urgent','2016-09-02 21:59:55','priority',19,'tester'),(36,'3','2016-09-02 21:59:56','centerID',19,'tester'),(37,'testing if assignee gets email  - new ticket','2016-09-02 21:59:56','title',19,'tester'),(38,'Examiners','2016-09-02 21:59:56','category',19,'tester'),(39,'11','2016-09-02 21:59:56','module',19,'tester'),(40,'tester','2016-09-02 22:02:29','assignee',20,'tester'),(41,'feedback','2016-09-02 22:02:29','status',20,'tester'),(42,'urgent','2016-09-02 22:02:30','priority',20,'tester'),(43,'testing if assignee gets email upon ticket update+re-assign','2016-09-02 22:02:30','title',20,'tester'),(44,'Imaging','2016-09-02 22:02:30','category',20,'tester'),(45,'12','2016-09-02 22:02:30','module',20,'tester'),(46,'admin','2016-09-02 22:04:38','assignee',20,'tester'),(47,'tester','2016-09-02 23:45:40','assignee',21,'tester'),(48,'ticket to end all tickets ','2016-09-02 23:45:40','title',21,'tester'),(49,'tester','2016-09-02 23:46:33','assignee',22,'tester'),(50,'ticket to end all tickets ','2016-09-02 23:46:33','title',22,'tester'),(51,'tester','2016-09-02 23:46:49','assignee',23,'tester'),(52,'3','2016-09-02 23:46:49','centerID',23,'tester'),(53,'ticket to end all tickets ','2016-09-02 23:46:49','title',23,'tester'),(54,'tester','2016-09-02 23:46:56','assignee',24,'tester'),(55,'ticket to end all tickets ','2016-09-02 23:46:57','title',24,'tester'),(56,'tester','2016-09-02 23:47:01','assignee',25,'tester'),(57,'ticket to end all tickets ','2016-09-02 23:47:01','title',25,'tester'),(58,'tester','2016-09-07 01:19:21','assignee',26,'admin'),(59,'2','2016-09-07 01:19:21','centerID',26,'admin'),(60,'testing site population','2016-09-07 01:19:21','title',26,'admin'),(61,'Behavioural Battery','2016-09-07 01:19:21','category',26,'admin'),(62,'11','2016-09-07 01:19:21','module',26,'admin'),(63,'test','2016-09-07 01:38:06','assignee',27,'admin'),(64,'3','2016-09-07 01:38:06','centerID',27,'admin'),(65,'test ticket with visit label','2016-09-07 01:38:06','title',27,'admin'),(66,'Behavioural Instruments','2016-09-07 01:38:06','category',27,'admin'),(67,'10','2016-09-07 01:38:07','module',27,'admin'),(68,'300002','2016-09-07 01:38:07','comment',27,'admin'),(69,'2','2016-09-07 01:39:23','sessionID',27,'admin'),(70,'2','2016-09-07 02:19:59','sessionID',27,'admin');
/*!40000 ALTER TABLE `issues_history` ENABLE KEYS */;
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
