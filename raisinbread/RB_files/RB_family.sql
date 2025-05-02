/*!999999\- enable the sandbox mode */ 
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `family`;
LOCK TABLES `family` WRITE;
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type`) VALUES (21,1,1004,'full_sibling');
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type`) VALUES (24,1,1005,'full_sibling');
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type`) VALUES (26,2,166,'half_sibling');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
