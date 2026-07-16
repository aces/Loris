SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `family_relationship_type`;
LOCK TABLES `family_relationship_type` WRITE;
INSERT INTO `family_relationship_type` (`ID`, `Name`, `Label`) VALUES (1,'half_sibling','Half sibling');
INSERT INTO `family_relationship_type` (`ID`, `Name`, `Label`) VALUES (2,'full_sibling','Full sibling');
INSERT INTO `family_relationship_type` (`ID`, `Name`, `Label`) VALUES (3,'1st_cousin','1st cousin');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
