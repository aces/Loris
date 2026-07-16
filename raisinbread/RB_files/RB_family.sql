SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `family`;
LOCK TABLES `family` WRITE;
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type_id`) VALUES (21,1,1004,1);
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type_id`) VALUES (24,1,1005,1);
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type_id`) VALUES (26,2,166,2);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;