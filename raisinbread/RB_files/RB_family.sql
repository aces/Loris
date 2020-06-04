SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `family`;
LOCK TABLES `family` WRITE;
INSERT INTO `family` (`ID`, `FamilyID`, `CandID`, `Relationship_type`) VALUES (21,1,587630,'full_sibling');
INSERT INTO `family` (`ID`, `FamilyID`, `CandID`, `Relationship_type`) VALUES (24,1,284119,'full_sibling');
INSERT INTO `family` (`ID`, `FamilyID`, `CandID`, `Relationship_type`) VALUES (26,2,300005,'half_sibling');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
