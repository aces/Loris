SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `test_subgroups`;
LOCK TABLES `test_subgroups` WRITE;
INSERT INTO `test_subgroups` (`ID`, `Subgroup_name`, `group_order`) VALUES (1,'Instruments',NULL);
INSERT INTO `test_subgroups` (`ID`, `Subgroup_name`, `group_order`) VALUES (2,'Imaging',NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
