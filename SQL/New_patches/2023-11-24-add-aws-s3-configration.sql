INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Default_Bucket_Media', 'Default bucket for LORIS to use for accessing media files in S3.', 1, 0, 'text', ID, 'AWS S3 Default Bucket for Media', 3 FROM ConfigSettings WHERE Name='aws';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Default_Bucket_Document_Repository', 'Default bucket for LORIS to use for accessing Document_Repository files in S3.', 1, 0, 'text', ID, 'AWS S3 Default Bucket for Document Repository', 3 FROM ConfigSettings WHERE Name='aws';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Default_Bucket_Issue_Tracker', 'Default bucket for LORIS to use for accessing Issue Tracker files in S3.', 1, 0, 'text', ID, 'AWS S3 Default Bucket for Issue Tracker', 3 FROM ConfigSettings WHERE Name='aws';

-- Insert record for ConfigID 141
INSERT INTO `Config` (`ConfigID`, `Value`)
SELECT `ID` AS `ConfigID`, '' AS `Value`
FROM `ConfigSettings`
WHERE `Name` = 'AWS_S3_Default_Bucket_Media';

-- Insert record for ConfigID 142
INSERT INTO `Config` (`ConfigID`, `Value`)
SELECT `ID` AS `ConfigID`, '' AS `Value`
FROM `ConfigSettings`
WHERE `Name` = 'AWS_S3_Default_Bucket_Document_Repository';

-- Insert record for ConfigID 143
INSERT INTO `Config` (`ConfigID`, `Value`)
SELECT `ID` AS `ConfigID`, '' AS `Value`
FROM `ConfigSettings`
WHERE `Name` = 'AWS_S3_Default_Bucket_Issue_Tracker';
