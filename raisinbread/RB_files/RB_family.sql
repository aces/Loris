SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `family`;
LOCK TABLES `family` WRITE;
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type_id`) VALUES (21,1,1004,2);
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type_id`) VALUES (24,1,1005,2);
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type_id`) VALUES (26,2,166,1);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
