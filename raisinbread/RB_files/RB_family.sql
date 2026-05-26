/*M!999999\- enable the sandbox mode */ 
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `family`;
LOCK TABLES `family` WRITE;
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type`, `RelationshipLabel`) VALUES (21,1,1004,'full_sibling','Full Sibling');
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type`, `RelationshipLabel`) VALUES (24,1,1005,'full_sibling','Full Sibling');
INSERT INTO `family` (`ID`, `FamilyID`, `CandidateID`, `Relationship_type`, `RelationshipLabel`) VALUES (26,2,166,'half_sibling','Half Sibling');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
