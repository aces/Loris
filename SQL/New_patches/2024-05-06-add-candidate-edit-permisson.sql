INSERT INTO `permissions` (`code`,`description`,`moduleID`,`action`,`categoryID`) VALUES ('candidate_edit','Candidate Archive and Edit',(SELECT ID FROM modules WHERE Name='candidate_list'),'Edit/Upload/Delete','2');

SET @uploadPermissionID = (SELECT permID FROM permissions WHERE code='candidate_edit');
INSERT IGNORE INTO permissions (`permID`, `code`, `description`, `categoryID`) VALUES (
    @uploadPermissionID, 'candidate_edit', 'Candidate list : Archive/Editing', 2
);
INSERT IGNORE INTO user_perm_rel (`userID`, `permID`) VALUES (
  (SELECT ID FROM users WHERE UserID = 'admin'), (SELECT permID FROM permissions WHERE code = 'candidate_edit')
);
