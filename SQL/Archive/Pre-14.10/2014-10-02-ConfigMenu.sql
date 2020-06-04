INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) 
SELECT 'Configuration', 'main.php?test_name=configuration', ID, 4 from LorisMenu WHERE Label = 'Admin';

INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID 
FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='config' AND m.Label='Configuration';