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
INSERT INTO `permissions` (`code`, `description`, `action`, `moduleID`, `categoryID`)
VALUES
  ('roles_view','Roles Entries - View','View',(SELECT ID FROM modules WHERE Name='roles_manager'),2),
  ('roles_edit','Roles Entries - Edit','Create/Edit',(SELECT ID FROM modules WHERE Name='roles_manager'),2),
  ('roles_assign','Roles Entries - Assign','Edit',(SELECT ID FROM modules WHERE Name='roles_manager'),2);

INSERT INTO `user_perm_rel` (userID, permID)
VALUES
  (
    (SELECT ID FROM users WHERE UserID = 'admin'),
    (SELECT permID FROM permissions WHERE code = 'roles_view')
  ),
  (
    (SELECT ID FROM users WHERE UserID = 'admin'),
    (SELECT permID FROM permissions WHERE code = 'roles_edit')
  ),
  (
    (SELECT ID FROM users WHERE UserID = 'admin'),
    (SELECT permID FROM permissions WHERE code = 'roles_assign')
  );

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
  (2, (SELECT permID FROM permissions WHERE code = 'user_accounts')),
  (2, (SELECT permID FROM permissions WHERE code = 'user_accounts_multisite')),
  (2, (SELECT permID FROM permissions WHERE code = 'access_all_profiles')),
  (2, (SELECT permID FROM permissions WHERE code = 'data_entry')),
  -- data_analysis
  (3, (SELECT permID FROM permissions WHERE code = 'data_dict_view')),
  (3, (SELECT permID FROM permissions WHERE code = 'dataquery_view')),
  -- data_release
  (4, (SELECT permID FROM permissions WHERE code = 'data_release_view')),
  (4, (SELECT permID FROM permissions WHERE code = 'data_release_upload')),
  (4, (SELECT permID FROM permissions WHERE code = 'data_release_edit_file_access')),
  -- coordinator
  (5, (SELECT permID FROM permissions WHERE code = 'user_accounts')),
  (5, (SELECT permID FROM permissions WHERE code = 'user_accounts_multisite')),
  (5, (SELECT permID FROM permissions WHERE code = 'access_all_profiles')),
  (5, (SELECT permID FROM permissions WHERE code = 'data_entry')),
  (5, (SELECT permID FROM permissions WHERE code = 'conflict_resolver')),
  -- imaging - own site
  (6, (SELECT permID FROM permissions WHERE code = 'imaging_browser_view_site')),
  (6, (SELECT permID FROM permissions WHERE code = 'dicom_archive_view_allsites')),
  (6, (SELECT permID FROM permissions WHERE code = 'imaging_browser_phantom_ownsite')),
  (6, (SELECT permID FROM permissions WHERE code = 'electrophysiology_browser_view_site')),
  (6, (SELECT permID FROM permissions WHERE code = 'violated_scans_view_ownsite')),
  (6, (SELECT permID FROM permissions WHERE code = 'imaging_quality_control_view')),
  -- scheduling
  (7, (SELECT permID FROM permissions WHERE code = 'survey_accounts_view')),
  -- issue_reporter
  (8, (SELECT permID FROM permissions WHERE code = 'issue_tracker_reporter'));

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
  (SELECT ID FROM users WHERE UserID = 'admin'),
  (SELECT RoleID FROM roles WHERE Code = 'administrator')
);