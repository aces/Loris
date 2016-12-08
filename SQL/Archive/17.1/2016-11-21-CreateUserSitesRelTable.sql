DROP TABLE IF EXISTS `user_psc_rel`;
CREATE TABLE `user_psc_rel` (
  `UserID` int(10) unsigned NOT NULL default '0',
  `CenterID` tinyint(2) unsigned default NULL,
  PRIMARY KEY  (`UserID`,`CenterID`),
  KEY `FK_user_psc_rel_2` (`CenterID`),
  CONSTRAINT `FK_user_psc_rel_2` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_psc_rel_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_psc_site`
--
SET foreign_key_checks = 0;
LOCK TABLES `user_psc_rel` WRITE, `psc` READ, `users` READ;
/*!40000 ALTER TABLE `user_psc_rel` DISABLE KEYS */;
INSERT INTO `user_psc_rel` (UserID, CenterID) SELECT ID, CenterID FROM users;
-- Add admin to the user_psc_rel
INSERT INTO `user_psc_rel` (1,1);
/*!40000 ALTER TABLE `user_psc_rel` ENABLE KEYS */;
UNLOCK TABLES;
SET foreign_key_checks = 1;

-- DROP column CenterID from the users table
-- ALTER TABLE users DROP foreign key FK_users_1;
-- ALTER TABLE users DROP column `CenterID`;
