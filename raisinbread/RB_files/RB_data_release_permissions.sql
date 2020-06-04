SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `data_release_permissions`;
LOCK TABLES `data_release_permissions` WRITE;
INSERT INTO `data_release_permissions` (`userid`, `data_release_id`) VALUES (1,1);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
