SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `data_release`;
LOCK TABLES `data_release` WRITE;
INSERT INTO `data_release` (`id`, `file_name`, `version`, `upload_date`, `ProjectID`, `hidden_by_userid`) VALUES (1,'46-054.gif','','2018-05-07',1,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
