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
-- Dumping data for table `issues_comments`
--

LOCK TABLES `issues_comments` WRITE;
/*!40000 ALTER TABLE `issues_comments` DISABLE KEYS */;
TRUNCATE TABLE `issues_comments`; INSERT INTO `issues_comments` (`issueCommentID`, `issueID`, `dateAdded`, `addedBy`, `issueComment`) VALUES (1,14,'2016-09-01 18:49:36','admin','Feedback'),(2,15,'2016-09-01 18:52:32','admin','Description'),(3,15,'2016-09-02 20:24:09','tester','comment for stella. '),(4,15,'2016-09-02 20:27:13','admin','update'),(5,15,'2016-09-02 20:28:38','tester','another comment for stella. '),(6,16,'2016-09-02 20:30:39','tester','blah blah blah'),(7,17,'2016-09-02 20:32:21','tester','adding a new comment, i only have reporter permissions. '),(8,18,'2016-09-02 20:33:48','tester','assigned to: admin\r\nwatching; no\r\nothers watching: admin'),(9,18,'2016-09-02 20:34:17','tester','adding comment.  '),(10,19,'2016-09-02 21:59:56','tester','hey stella do you see this?  did Admin get an Assignee notification?  Did Test User also get a watching notification? '),(11,20,'2016-09-02 22:02:30','tester','no one should get a notification for this new ticket. '),(12,20,'2016-09-02 22:04:38','tester','with this update, Admin should get an email notification saying that they\'ve been assigned to this [PRE-EXISTING] ticket'),(13,20,'2016-09-02 22:11:17','tester','user can add comment if they reported it. '),(14,15,'2016-09-02 22:12:32','tester','reporter-level user can add comment if they are neither assignee nor reporter'),(15,17,'2016-09-02 22:18:44','tester','verifying that a second comment doesn\'t get stored in the description'),(16,21,'2016-09-02 23:45:40','tester','i can\'t write another description'),(17,22,'2016-09-02 23:46:33','tester','i can\'t write another description'),(18,23,'2016-09-02 23:46:49','tester','i can\'t write another description'),(19,24,'2016-09-02 23:46:57','tester','i can\'t write another description'),(20,25,'2016-09-02 23:47:01','tester','i can\'t write another description'),(21,26,'2016-09-07 01:19:22','admin','aaaaaa'),(22,27,'2016-09-07 01:38:07','admin','aaaaa');
/*!40000 ALTER TABLE `issues_comments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
