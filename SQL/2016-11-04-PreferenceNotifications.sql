DROP TABLE IF EXISTS `notification_methods`;
CREATE TABLE `notification_methods` (
	`NotificationMethodID` int(10) NOT NULL,
    `Method` varchar(255) NOT NULL,
	PRIMARY KEY (`NotificationMethodID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `notification_methods` VALUES (1, "Within Loris");
INSERT INTO `notification_methods` VALUES (2, "Email");
INSERT INTO `notification_methods` VALUES (3, "Text Message");

DROP TABLE IF EXISTS `database_events`;
CREATE TABLE `database_events` (
	`EventID` int(10) unsigned NOT NULL auto_increment,
    `TableName` varchar(255) NOT NULL,
    `ColumnName` varchar(255),
    `Description` varchar(255) NOT NULL,
    `PermID` int(10) unsigned,
    PRIMARY KEY (`EventID`),
    KEY `FK_database_events_1` (`PermID`),
    CONSTRAINT `FK_database_events_1` FOREIGN KEY (`PermID`) REFERENCES `permissions` (`permID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `database_events` (`EventID`, `TableName`, `Description`, `PermID`) VALUES (1, 'document_repository', 'Document Repository - New Document', 37);
INSERT INTO `database_events` (`EventID`, `TableName`, `Description`, `PermID`) VALUES (2, 'feedback_bvl_entry', 'Behavioural Feedback - New BVL Feedback', 5);
INSERT INTO `database_events` (`EventID`, `TableName`, `Description`, `PermID`) VALUES (3, 'users', 'User Accounts - New User', 2);

DROP TABLE IF EXISTS `user_notification_rel`;
CREATE TABLE `user_notification_rel` (
	`UserID` int(10) unsigned NOT NULL auto_increment,
    `NotificationMethodID` int(10) NOT NULL default '0',
    `EventID` int(10) unsigned NOT NULL default '1',
    PRIMARY KEY  (`UserID`,`NotificationMethodID`,`EventID`),
    KEY `FK_user_notification_rel_3` (`EventID`),
    KEY `FK_user_notification_rel_2` (`NotificationMethodID`),
    KEY `FK_user_notification_rel_1` (`UserID`),
    CONSTRAINT `FK_user_notification_rel_3` FOREIGN KEY (`EventID`) REFERENCES `database_events` (`EventID`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `FK_user_notification_rel_2` FOREIGN KEY (`NotificationMethodID`) REFERENCES `notification_methods` (`NotificationMethodID`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `FK_user_notification_rel_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
