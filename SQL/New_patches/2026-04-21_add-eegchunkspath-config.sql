INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'EEGChunksPath', 'Path to store the EEG chunks for Visualization', 1, 0, 'text', ID, 'EEG chunks path', 16
FROM ConfigSettings WHERE Name="eeg_pipeline";

INSERT INTO `Config` (`ConfigID`, `Value`)
SELECT cPath.ID, dPathConfig.Value
FROM ConfigSettings cPath
JOIN ConfigSettings dPath ON dPath.Name = 'dataDirBasepath'
JOIN Config dPathConfig ON dPathConfig.ConfigID = dPath.ID
WHERE cPath.`Name` = 'EEGChunksPath' LIMIT 1;
