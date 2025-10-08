-- add new table for actions
CREATE TABLE `permissions_action` (
  `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL UNIQUE,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- fill out already known actions
INSERT INTO `permissions_action` VALUES
  (1, "View"),
  (2, "Create"),
  (3, "Edit"),
  (4, "Delete"),
  (5, "Comment"),
  (6, "Close"),
  (7, "Hide"),
  (8, "Download"),
  (9, "Upload");

-- relation between "permissions" and "permissions_action"
CREATE TABLE `perm_perm_action_rel` (
  `permID` int(10) unsigned NOT NULL default '0',
  `actionID` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`permID`,`actionID`),
  KEY `FK_perm_perm_action_rel_2` (`permID`),
  CONSTRAINT `FK_perm_perm_action_rel_2`
  FOREIGN KEY (`permID`)
    REFERENCES `permissions` (`permID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_perm_perm_action_rel_1`
  FOREIGN KEY (`actionID`)
    REFERENCES `permissions_action` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- run "tools/single_use/migrate_permission_actions.php" migrate script after that.
