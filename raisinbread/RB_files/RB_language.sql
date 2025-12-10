/*M!999999\- enable the sandbox mode */ 
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `language`;
LOCK TABLES `language` WRITE;
INSERT INTO `language` (`language_id`, `language_code`, `language_label`) VALUES (1,'en_CA','English');
INSERT INTO `language` (`language_id`, `language_code`, `language_label`) VALUES (2,'fr_CA','Français');
INSERT INTO `language` (`language_id`, `language_code`, `language_label`) VALUES (3,'ja_JP','日本語');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
