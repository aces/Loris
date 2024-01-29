
-- ------------------------------------
-- REMOVE PERMISSION CATEGORY TABLE
-- ------------------------------------

-- Update the only 3 `roles` category permissions to `permissions` 
-- update bvl_feedback and data_entry to permission.
UPDATE `permissions`
    SET categoryID = '2'
    WHERE 'code' IN ('superuser', 'bvl_feedback', 'data_entry');

-- delete `permission_category` table
-- `permission_category` only gave the 'permission' or 'role' choice.
-- `role` becoming a new table, this is not needed anymore.
SET foreign_key_checks = 0;
DELETE FROM `permissions_category`;
DROP TABLE `permissions_category`;
ALTER TABLE `permissions` DROP FOREIGN KEY `fk_permissions_1`;
ALTER TABLE `permissions` DROP COLUMN categoryID;
SET foreign_key_checks = 1;

-- ------------------------------------
-- ADD ROLES
-- ------------------------------------

-- add role table
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `RoleID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Code` varchar(255) NOT NULL DEFAULT '',
  `Name` varchar(255) NOT NULL DEFAULT '',
  `Description` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`RoleID`),
  UNIQUE KEY `Code` (`Code`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

INSERT INTO `roles` VALUES
  (1,'blocked', 'Blocked', 'A blocked user has access to nothing.'),
  (2,'administrator', 'Administrator', 'An administrator has access to everything, no restrictions.');

-- module
INSERT INTO modules (Name, Active) VALUES ('roles', 'Y');

-- add new permissions (related to roles module)
INSERT INTO `permissions` (`code`, `description`, `action`, `moduleID`)
VALUES
  ('roles_view','Roles Entries','View',(SELECT ID FROM modules WHERE Name='roles_manager')),
  ('roles_edit','Roles Entries','Create/Edit',(SELECT ID FROM modules WHERE Name='roles_manager')),
  ('roles_assign','Roles Entries','Edit',(SELECT ID FROM modules WHERE Name='roles_manager'));

-- add role-permission rel table
DROP TABLE IF EXISTS `role_permission_rel`;
CREATE TABLE `role_permission_rel` (
  `RoleID` int(10) unsigned NOT NULL default '0',
  `permID` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`RoleID`,`permID`),
  CONSTRAINT `FK_role_permission_rel_2`
  FOREIGN KEY (`permID`)
    REFERENCES `permissions` (`permID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_role_permission_rel_1`
  FOREIGN KEY (`RoleID`)
    REFERENCES `roles` (`RoleID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- administrator role has all permissions.
INSERT INTO `role_permission_rel`(`permID`,`RoleID`)
  SELECT permID, (
    SELECT RoleID FROM roles WHERE Code = 'administrator'
  ) 
  FROM permissions;

-- add role-user rel table
DROP TABLE IF EXISTS `user_role_rel`;
CREATE TABLE `user_role_rel` (
  `RoleID` int(10) unsigned NOT NULL default '0',
  `userID` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`RoleID`,`userID`),
  CONSTRAINT `FK_user_role_rel_1`
  FOREIGN KEY (`userID`)
    REFERENCES `users` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_user_role_rel_2`
  FOREIGN KEY (`RoleID`)
    REFERENCES `roles` (`RoleID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET='utf8';