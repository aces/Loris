-- Add parse_instrument_data to server_processes types
ALTER TABLE server_processes MODIFY COLUMN type enum('mri_upload', 'parse_instrument_data') DEFAULT NULL;

-- Add instrumentDataPath to ConfigSettings
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'instrumentDataPath', 'Path to directory for uploaded instrument data csv files',
       1, 0, 'text', ID, 'Instrument Data Upload Path', 15
FROM ConfigSettings WHERE Name="paths";

-- Add instrumentDataPath Config
INSERT INTO Config (ConfigID, Value)
SELECT ID, "/data/uploads/instruments/"
FROM ConfigSettings WHERE Name="instrumentDataPath";

-- Rel table for instrument_data entry -> CSV file. DataID NULL if not successful
CREATE TABLE `instrument_data_files` (
    `ID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `DataID` INT(10) unsigned default NULL,
    `FilePath` VARCHAR(255) NOT NULL,
    CONSTRAINT `FK_flag_instrument_data_files` FOREIGN KEY (`DataID`) REFERENCES `instrument_data` (`ID`),
    PRIMARY KEY (`ID`)
);

