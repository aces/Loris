INSERT INTO `ConfigSettings` (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES 
('AWS_S3_Default_Bucket_Media','Default bucket for LORIS to use for accessing media files in S3.',1,0,'text',121,'AWS S3 Default Bucket for Media',3);

INSERT INTO `ConfigSettings` ( `Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES ('AWS_S3_Default_Bucket_Document_Repository','Default bucket for LORIS to use for accessing Document_Repository files in S3.',1,0,'text',121,'AWS S3 Default Bucket for Media',3);


INSERT INTO `ConfigSettings` ( `Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES ('AWS_S3_Default_Bucket_Issue_Tracker','Default bucket for LORIS to use for accessing Issue Tracker files in S3.',1,0,'text',121,'AWS S3 Default Bucket for Issue Tracker',3);


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
