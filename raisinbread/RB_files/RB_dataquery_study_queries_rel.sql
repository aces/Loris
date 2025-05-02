/*!999999\- enable the sandbox mode */ 
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `dataquery_study_queries_rel`;
LOCK TABLES `dataquery_study_queries_rel` WRITE;
INSERT INTO `dataquery_study_queries_rel` (`QueryID`, `PinnedBy`, `Name`, `PinType`) VALUES (1,1,'Test Pin Query','dashboard');
INSERT INTO `dataquery_study_queries_rel` (`QueryID`, `PinnedBy`, `Name`, `PinType`) VALUES (1,1,'Test Pin Query','loginpage');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
