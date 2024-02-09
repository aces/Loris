
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

-- module
INSERT INTO modules (Name, Active) VALUES ('roles_manager', 'Y');

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

INSERT INTO `roles` (`RoleID`, `Code`, `Name`, `Description`)
VALUES
  (1,'administrator', 'Administrator', 'An administrator. Has access to everything, no restrictions.'),
  (2,'data_entry', 'Data Entry', 'Interact with user data such as instruments, users and timepoints.'),
  (3,'data_analysis', 'Data Analysis', 'Query data through DQT and dictionnary.'),
  (4,'data_release', 'Data Release', 'Interact with data release files.'),
  (5,'coordinator', 'Coordinator', 'Resolve instrument data conflicts.'),
  (6,'imaging', 'Imaging', 'Access imaging data.'),
  (7,'scheduling', 'Scheduling', 'Schedule participants and surveys.'),
  (8,'issue_reporter', 'Issue reporter', 'Report issues.');

-- add new permissions (related to roles module)
INSERT INTO `permissions` (`code`, `description`, `action`, `moduleID`)
VALUES
  ('roles_view','Roles Entries - View','View',(SELECT ID FROM modules WHERE Name='roles_manager')),
  ('roles_edit','Roles Entries - Edit','Create/Edit',(SELECT ID FROM modules WHERE Name='roles_manager')),
  ('roles_assign','Roles Entries - Assign','Edit',(SELECT ID FROM modules WHERE Name='roles_manager'));

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
INSERT INTO `role_permission_rel` (`permID`,`RoleID`)
  SELECT permID, (
    SELECT RoleID FROM roles WHERE Code = 'administrator'
  )
  FROM permissions;
-- other roles, select permissions
INSERT INTO `role_permission_rel` (`RoleID`,`permID`)
VALUES
  -- data_entry
  (2,2),
  (2,3),
  (2,9),
  (2,10),
  -- data_analysis
  (3,14),
  (3,32),
  -- data_release
  (4,40),
  (4,41),
  (4,42),
  -- coordinator
  (5,2),
  (5,3),
  (5,9),
  (5,10),
  (5,13),
  -- imaging (own site)
  (6,17),
  (6,19),
  (6,39),
  (6,50),
  (6,56),
  (6,59),
  -- scheduling
  (7,58),
  -- issue_reporter
  (8,36);

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

-- administrator user has administrator role.
INSERT INTO `user_role_rel` (`RoleID`,`userID`)
VALUES (
  SELECT ID FROM users WHERE UserID = 'admin',
  SELECT RoleID FROM roles WHERE Code = 'administrator'
);