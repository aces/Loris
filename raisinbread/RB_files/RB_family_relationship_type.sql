SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `family_relationship_type`;
LOCK TABLES `family_relationship_type` WRITE;
INSERT INTO `family_relationship_type` (`ID`, `Name`, `Label`) VALUES (1,'full_sibling','Full Sibling');
INSERT INTO `family_relationship_type` (`ID`, `Name`, `Label`) VALUES (2,'half_sibling','Half Sibling');
INSERT INTO `family_relationship_type` (`ID`, `Name`, `Label`) VALUES (3,'1st_cousin','First Cousin');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;