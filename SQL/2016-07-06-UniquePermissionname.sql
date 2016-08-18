CREATE TEMPORARY TABLE `new_permissions` (   `permID` int(10) unsigned NOT NULL auto_increment,   `code` varchar(255) NOT NULL default '' UNIQUE,   `description` varchar(255) NOT NULL default '',   `categoryID` int(10) DEFAULT NULL,   PRIMARY KEY  (`permID`) ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

INSERT INTO new_permissions SELECT permID, code, description, categoryID FROM permissions WHERE permID IN (select MIN(permID) from permissions GROUP BY code);

UPDATE IGNORE user_perm_rel a LEFT JOIN permissions b ON a.permID = b.permID LEFT JOIN new_permissions c ON b.code = c.code SET a.permID = c.permID WHERE b.permID <> c.permID;

DELETE FROM permissions WHERE permID not in (select permID from new_permissions);

DELETE FROM user_perm_rel WHERE permID NOT IN (SELECT permID from new_permissions);

UPDATE IGNORE LorisMenuPermissions a LEFT JOIN permissions b ON a.PermID = b.permID LEFT JOIN new_permissions c ON b.code = c.code SET a.PermID = c.permID WHERE b.permID <> c.permID;

DELETE FROM LorisMenuPermissions WHERE PermID NOT IN (SELECT permID from new_permissions);

ALTER TABLE permissions ADD CONSTRAINT code_name UNIQUE (code);
