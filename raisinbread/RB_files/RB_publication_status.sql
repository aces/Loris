SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `publication_status`;
LOCK TABLES `publication_status` WRITE;
INSERT INTO `publication_status` (`PublicationStatusID`, `Label`) VALUES (2,'Approved');
INSERT INTO `publication_status` (`PublicationStatusID`, `Label`) VALUES (1,'Pending');
INSERT INTO `publication_status` (`PublicationStatusID`, `Label`) VALUES (3,'Rejected');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
