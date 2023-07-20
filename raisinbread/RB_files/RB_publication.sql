SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `publication`;
LOCK TABLES `publication` WRITE;
INSERT INTO `publication` (`PublicationID`, `PublicationStatusID`, `LeadInvestigatorID`, `UserID`, `RatedBy`, `DateProposed`, `DateRated`, `Title`, `RejectedReason`, `Description`, `journal`, `doi`, `datePublication`, `link`, `publishingStatus`, `project`) VALUES (1,1,1,1,NULL,'2023-01-25',NULL,'test',NULL,'test',NULL,NULL,NULL,NULL,NULL,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
