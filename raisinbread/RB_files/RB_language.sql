SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `language`;
LOCK TABLES `language` WRITE;
INSERT INTO `language` (`language_id`, `language_code`, `language_label`) VALUES (1,'en-CA','English');
INSERT INTO `language` (`language_id`, `language_code`, `language_label`) VALUES (2,'fr-CA','French');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
