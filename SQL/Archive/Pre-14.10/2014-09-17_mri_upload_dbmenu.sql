INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) 
SELECT 'MRI Upload', 'main.php?test_name=imaging_uploader', Parent, 5 from LorisMenu WHERE Label = 'Imaging';
INSERT INTO permissions (code, description, categoryID) VALUES ('imaging_uploader','Imaging Uploader',2);
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID 
FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_uploader' AND m.Label='Imaging Uploader';
