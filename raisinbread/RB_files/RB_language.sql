SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `language`;
LOCK TABLES `language` WRITE;
INSERT INTO `language` (`language_id`, `language_code`, `language_label`) VALUES (1,'en-CA','English');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
