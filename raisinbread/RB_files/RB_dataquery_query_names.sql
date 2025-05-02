/*!999999\- enable the sandbox mode */ 
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `dataquery_query_names`;
LOCK TABLES `dataquery_query_names` WRITE;
INSERT INTO `dataquery_query_names` (`QueryID`, `UserID`, `Name`) VALUES (7,10,'Testing query name');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
