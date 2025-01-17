-- Add parse_instrument_data to server_processes types
ALTER TABLE server_processes MODIFY COLUMN type enum('mri_upload', 'parse_instrument_data') DEFAULT NULL;


-- Add instrumentDataPath to ConfigSettings
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'tempPath', 'Path for temporary files',
       1, 0, 'text', ID, 'Temp File Path', 16
FROM ConfigSettings WHERE Name="paths";

-- Add instrumentDataPath Config
INSERT INTO Config (ConfigID, Value)
SELECT ID, "/data/tmp/"
FROM ConfigSettings WHERE Name="tempPath";
