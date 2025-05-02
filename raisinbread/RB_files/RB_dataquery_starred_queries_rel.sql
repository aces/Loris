/*!999999\- enable the sandbox mode */ 
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `dataquery_starred_queries_rel`;
LOCK TABLES `dataquery_starred_queries_rel` WRITE;
INSERT INTO `dataquery_starred_queries_rel` (`QueryID`, `StarredBy`) VALUES (8,10);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
