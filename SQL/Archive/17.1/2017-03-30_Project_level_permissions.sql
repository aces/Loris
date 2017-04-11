CREATE TABLE `user_project_rel` (
  `UserID` int(10) unsigned NOT NULL,
  `ProjectID` int(2) NOT NULL,
  PRIMARY KEY  (`UserID`,`ProjectID`),
  KEY `FK_user_project_rel_2` (`ProjectID`),
  CONSTRAINT `FK_user_project_rel_2` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_project_rel_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO user_project_rel (UserID, ProjectID) SELECT 1, ProjectID FROM Project;
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useProjectPermissions', "Enable project level permissions", 1, 0, 'boolean', ID, 'Use project-level permissions', 4 FROM ConfigSettings WHERE Name="study";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useProjectPermissions";
