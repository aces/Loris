
CREATE TABLE `user_project_rel` (
  `UserID` int(10) unsigned NOT NULL,
  `ProjectID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`UserID`,`ProjectID`),
  CONSTRAINT `FK_user_project_rel_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_project_rel_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- To maintain status quo, add all projects to all users since users had access to all data before projects were added.
INSERT IGNORE INTO user_project_rel
SELECT ID,ProjectID FROM users JOIN Project;
