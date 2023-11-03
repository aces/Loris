
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
INSERT INTO `permissions` (`code`, `description`, `moduleID`) 
VALUES
  ('roles_view','Roles',(SELECT ID FROM modules WHERE Name='roles')),
  ('roles_assign','Roles',(SELECT ID FROM modules WHERE Name='roles')),
  ('roles_edit','Roles',(SELECT ID FROM modules WHERE Name='roles'));