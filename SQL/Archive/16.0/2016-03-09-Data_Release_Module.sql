INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Data Release', '/data_release/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 7);

DROP TABLE IF EXISTS `data_release`;
CREATE TABLE `data_release` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `file_name` varchar(255),
 `version` varchar(255),
 `upload_date` date,
 PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `data_release_permissions`;
CREATE TABLE `data_release_permissions` (
 `userid` int(10) unsigned NOT NULL,
 `data_release_id` int(10) unsigned NOT NULL,
 PRIMARY KEY (`userid`, `data_release_id`),
 KEY `FK_userid` (`userid`),
 KEY `FK_data_release_id` (`data_release_id`),
 CONSTRAINT `FK_userid` FOREIGN KEY (`userid`) REFERENCES `users` (`ID`),
 CONSTRAINT `FK_data_release_id` FOREIGN KEY (`data_release_id`) REFERENCES `data_release` (`id`)
);
