INSERT INTO LorisMenu (ID, Parent, Label, Link, OrderNumber) VALUES (24, 6, 'Survey Module', 'main.php?test_name=participant_accounts', 2);
INSERT INTO LorisMenu (ID, Parent, Label, Link, OrderNumber) VALUES (25, 3, 'MRI Violated Scans', 'main.php?test_name=mri_violations', 4);
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT 24, PermID FROM permissions WHERE code='user_accounts';
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT 25, PermID FROM permissions WHERE code='violated_scans';
