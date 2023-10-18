
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

-- add to permission
INSERT INTO `permissions` (`code`, `description`, `moduleID`, `action`, `categoryID`) 
VALUES
    ('roles_view','Roles',(SELECT ID FROM modules WHERE Name='roles'), 'View', '2'),
    ('roles_edit','Roles',(SELECT ID FROM modules WHERE Name='roles'), 'Edit/Upload/Delete', '2'),
    ('roles_assign','Roles',(SELECT ID FROM modules WHERE Name='roles'), 'Create/Edit', '2');

-- add to admin account
INSERT IGNORE INTO `user_perm_rel` (userID, permID)
    SELECT u.ID, p.permID
    FROM users u JOIN permissions p
    WHERE u.userid = 'admin'
    ORDER BY p.permID;

-- add to modules
INSERT INTO modules (Name, Active) VALUES ('roles', 'Y');