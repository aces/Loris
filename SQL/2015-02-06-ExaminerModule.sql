UPDATE permissions SET code='examiner', description='Add and certify examiners' where code='certification';
UPDATE permissions SET code='examiner_multisite', description='Across all sites add and certify examiners' where code='certification_multisite';

UPDATE LorisMenu SET Label='Examiner', Link='main.php?test_name=examiner' WHERE Label='Certification';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useTraining', 'Enable training in the examiner module for examiner certification', 1, 0, 'boolean', ID, 'Use Training', 18 FROM ConfigSettings WHERE Name="study";
INSERT INTO Config (ConfigID, Value) SELECT ID, "0" FROM ConfigSettings WHERE Name="useTraining";

ALTER TABLE users DROP COLUMN Examiner;