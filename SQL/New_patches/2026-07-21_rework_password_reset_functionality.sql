CREATE TABLE `user_password_reset` (
  `UserID` int(10) unsigned NOT NULL,
  `ResetToken` char(64) NOT NULL,
  `Status` enum('Used','Superseded') DEFAULT NULL, 
  `CreationDate` datetime NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`,`ResetToken`),
  UNIQUE KEY `ResetToken` (`ResetToken`),
  CONSTRAINT `FK_user_password_reset_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `users` DROP COLUMN `PasswordChangeRequired`;
