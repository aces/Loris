INSERT INTO LorisMenu (Parent, Label, Link, OrderNumber) SELECT ID ,'Help Editor', 'main.php?test_name=help_editor', 3 FROM LorisMenu WHERE Label='Admin';
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='context_help' AND m.Label='Help Editor';
