
-- alter permissions
-- the roles category is moved to the roles table.

-- update bvl_feedback and data_entry to permission.
UPDATE `permissions`
  SET categoryID = '1'
  WHERE 'code' IN ('superuser', 'bvl_feedback', 'data_entry');

-- delete permission_category because roles are a new table.
SET foreign_key_checks = 0;
DELETE FROM `permissions_category`;
DROP TABLE `permissions_category`;
ALTER TABLE `permissions` DROP FOREIGN KEY `fk_permissions_1`;
ALTER TABLE `permissions` DROP COLUMN categoryID;
SET foreign_key_checks = 1;

-- put permissions_type in another table to remove the action enum.
DROP TABLE IF EXISTS `permissions_types`;
CREATE TABLE `permissions_types` (
  `PermissionTypeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Description` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`PermissionTypeID`),
  UNIQUE KEY `Description` (`Description`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- add to permissions_type
INSERT INTO `permissions_types` (`PermissionTypeID`, `Description`) 
VALUES
  (1,'View'),
  (2,'Create'),
  (3,'Update'),
  (4,'Delete'),
  (5,'Upload'),
  (6,'Download'),
  (7,'All');

-- put permissions_types/permission relation.
DROP TABLE IF EXISTS `permissions_permissions_types_rel`;
CREATE TABLE `permissions_permissions_types_rel` (
  `PermissionTypeID` int(10) unsigned NOT NULL default '0',
  `permID` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`PermissionTypeID`,`permID`),
  KEY `FK_permissions_permissions_types_rel_2` (`permID`),
  CONSTRAINT `FK_permissions_permissions_types_rel_2`
  FOREIGN KEY (`permID`)
    REFERENCES `permissions` (`permID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_permissions_permissions_types_rel_1`
  FOREIGN KEY (`PermissionTypeID`)
    REFERENCES `permissions_types` (`PermissionTypeID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- change permissions.action type to varchar so we can analyze it.
ALTER TABLE permissions ADD COLUMN action_new VARCHAR(50);
UPDATE permissions SET action_new = CAST(action AS CHAR);
ALTER TABLE permissions DROP COLUMN action;

-- Decouple each action into a new row (A)
-- e.g.
-- +--------+--------------------+
-- | permID | action_new         |
-- +--------+--------------------+
-- |      2 | View/Create/Edit   |
-- |      4 | Edit               |
-- |      8 | NULL               |
--
-- into
-- +--------+------------+
-- | permID | action_new |
-- +--------+------------+
-- |      2 | View       |
-- |      2 | Create     |
-- |      2 | Edit       |
-- |      4 | Edit       |
-- |      8 | NULL       |
--
-- then apply a insert into permissions_permissions_types_rel according to the
-- selected permission type. (B)

-- (B)
INSERT INTO permissions_permissions_types_rel (permID, PermissionTypeID)
  SELECT
    r.permID as permID,
    CASE 
      WHEN action_new IS NOT NULL AND action_new LIKE 'View' THEN (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'View')
      WHEN action_new IS NOT NULL AND action_new LIKE 'Create' THEN (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'Create')
      WHEN action_new IS NOT NULL AND action_new LIKE 'Delete' THEN (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'Delete')
      WHEN action_new IS NOT NULL AND action_new LIKE 'Edit' THEN (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'Update')
      WHEN action_new IS NOT NULL AND action_new LIKE 'Upload' THEN (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'Upload')
      WHEN action_new IS NOT NULL AND action_new LIKE 'Download' THEN (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'Download')
      WHEN action_new IS NULL THEN (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'All')
    END as PermissionTypeID
  FROM (
    -- (A)
    SELECT
      p.permID,
      SUBSTRING_INDEX(SUBSTRING_INDEX(p.action_new, '/', numbers.digit+1), '/', -1) as action_new
    FROM permissions p
      LEFT OUTER JOIN (
        SELECT 0 digit UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) numbers 
      ON LENGTH(REPLACE(p.action_new, '/' , '')) <= LENGTH(p.action_new) - numbers.digit
    ORDER BY
      p.permID
  ) as r;

-- once done, drop the action_new column
ALTER TABLE permissions DROP COLUMN action_new;

-- view all permission with types
-- SELECT p.permID, p.code, pt.Description
-- FROM permissions p
--   JOIN permissions_permissions_types_rel pptr USING (permID)
--   JOIN permissions_types pt USING (PermissionTypeID)
-- ORDER BY p.permID;


-- add roles table
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
  (1,'blocked', 'Blocked', 'A blocked user: user has access to nothing.'),
  (2,'administrator', 'Administrator', 'An administrator: has access to everything, no restrictions.');

-- add to modules
INSERT INTO modules (Name, Active) VALUES ('roles', 'Y');

-- add new permissions (related to roles module)
INSERT INTO `permissions` (`code`, `description`, `moduleID`) 
VALUES
  ('roles_view','Roles',(SELECT ID FROM modules WHERE Name='roles')),
  ('roles_assign','Roles',(SELECT ID FROM modules WHERE Name='roles')),
  ('roles_edit','Roles',(SELECT ID FROM modules WHERE Name='roles'));

INSERT INTO `permissions_permissions_types_rel` (permID, PermissionTypeID)
VALUES 
  -- role_view = view
  (
    (SELECT permID FROM permissions WHERE code = 'roles_view'),
    (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'View')
  ),
  -- role_assign = Edit
  (
    (SELECT permID FROM permissions WHERE code = 'roles_assign'),
    (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'Edit')
  ),
  -- role_edit = create, edit, delete
  (
    (SELECT permID FROM permissions WHERE code = 'roles_edit'),
    (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'Create')
  ),
  (
    (SELECT permID FROM permissions WHERE code = 'roles_edit'),
    (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'Edit')
  ),
  (
    (SELECT permID FROM permissions WHERE code = 'roles_edit'),
    (SELECT PermissionTypeID FROM permissions_types WHERE Description = 'Delete')
  );

-- -- add to admin account
-- INSERT IGNORE INTO `user_perm_rel` (userID, permID)
--     SELECT u.ID, p.permID
--     FROM users u JOIN permissions p
--     WHERE u.userid = 'admin'
--     ORDER BY p.permID;
