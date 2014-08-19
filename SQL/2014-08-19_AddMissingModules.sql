INSERT INTO LorisMenu (Parent, Label, Link, OrderNumber) VALUES (6, 'Survey Module', 'main.php?test_name=participant_accounts', 2);
INSERT INTO LorisMenu (Parent, Label, Link, OrderNumber) VALUES (3, 'MRI Violated Scans', 'main.php?test_name=mri_violations', 4);
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='user_accounts' AND m.Label='Survey Module';
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='violated_scans' AND m.Label='MRI Violated Scans';
