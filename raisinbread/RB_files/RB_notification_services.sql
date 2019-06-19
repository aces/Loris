SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `notification_services`;
LOCK TABLES `notification_services` WRITE;
INSERT INTO `notification_services` (`id`, `service`) VALUES (2,'email_text');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
