WARNINGS;
CREATE TABLE `user_psc_rel` (
  `UserID` int(10) unsigned NOT NULL,
  `CenterID` tinyint(2) unsigned NOT NULL,
  PRIMARY KEY  (`UserID`,`CenterID`),
  KEY `FK_user_psc_rel_2` (`CenterID`),
  CONSTRAINT `FK_user_psc_rel_2` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_psc_rel_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_psc_site`
--

INSERT IGNORE INTO `user_psc_rel` (UserID, CenterID) SELECT ID, CenterID FROM users;
-- Add admin to the user_psc_rel
INSERT IGNORE INTO `user_psc_rel` (UserID, CenterID) SELECT 1, CenterID FROM psc;

-- ** WARNING: The next 2 lines will DROP column CenterID from the users table ** 
-- ALTER TABLE users DROP foreign key FK_users_1;
-- ALTER TABLE users DROP column `CenterID`;
