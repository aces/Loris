INSERT INTO LorisMenu (Parent, Label, Link, OrderNumber) VALUES (6, 'Help Editor', 'main.php?test_name=help_editor', 3);
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='content_help' AND m.Label='Help Editor';
