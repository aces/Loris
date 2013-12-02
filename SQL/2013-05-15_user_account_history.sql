CREATE TABLE `user_account_history` (
ID int(10) unsigned NOT NULL AUTO_INCREMENT,
UserID varchar(255) NOT NULL DEFAULT '',
PermID int(10) unsigned DEFAULT NULL,
PermAction enum('I','D') DEFAULT NULL,
DataField  varchar(255) DEFAULT NULL,
DataFieldValueOld varchar(255) DEFAULT NULL,
DataFieldValueNew varchar(255) DEFAULT NULL,
ChangeDate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
