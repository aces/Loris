DROP TABLE IF EXISTS `password_recovery`;
CREATE TABLE `password_recovery` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ip` int(10) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` varchar(65) NOT NULL,
  `time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  CONSTRAINT `fk_password_recovery_users_1` FOREIGN KEY (`email`) REFERENCES `users` (`Email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE users DROP COLUMN `password_expiry`;