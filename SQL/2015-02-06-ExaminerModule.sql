UPDATE permissions SET code='examiner_view', description='Add and certify examiners' WHERE code='certification';
UPDATE permissions SET code='examiner_multisite', description='Across all sites add and certify examiners' WHERE code='certification_multisite';
INSERT INTO permissions (code, description, categoryID) VALUES ('examiner', 'Examiner', 1);

UPDATE LorisMenu SET Label='Examiner', Link='main.php?test_name=examiner' WHERE Label='Certification';
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='examiner' AND m.Label='Examiner';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useTraining', 'Enable training in the examiner module for examiner certification', 1, 0, 'boolean', ID, 'Use Training', 18 FROM ConfigSettings WHERE Name="study";
INSERT INTO Config (ConfigID, Value) SELECT ID, "0" FROM ConfigSettings WHERE Name="useTraining";

ALTER TABLE users DROP COLUMN Examiner;