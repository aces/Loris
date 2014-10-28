INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) 
SELECT 'Data Integrity Flag', 'main.php?test_name=data_integrity_flag', ID, 3 from LorisMenu WHERE Label = 'Tools';

INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID 
FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_integrity_flag' AND m.Label='Data Integrity Flag';

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) 
SELECT 'Instrument Manager', 'main.php?test_name=instrument_manager', ID, 4 from LorisMenu WHERE Label = 'Admin';

INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID 
FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='superuser' AND m.Label='Instrument Manager';