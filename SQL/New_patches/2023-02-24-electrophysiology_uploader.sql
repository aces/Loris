-- Create EEG upload table
CREATE TABLE `electrophysiology_uploader` (
    `UploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `UploadedBy` varchar(255) NOT NULL DEFAULT '',
    `UploadDate` DateTime DEFAULT NULL,
    `UploadLocation` varchar(255) NOT NULL DEFAULT '',
    `Status` enum('Not Started', 'In Progress', 'Complete', 'Failed') DEFAULT 'Not Started',
    `SessionID` int(10) unsigned NOT NULL default '0',
    `MetaData` TEXT default NULL,
    PRIMARY KEY (`UploadID`),
    KEY (`SessionID`),
    CONSTRAINT `FK_eegupload_SessionID`
        FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Add to module table
INSERT INTO modules (Name, Active) VALUES ('electrophysiology_uploader', 'Y');

-- Add new configurations for eeg uploader
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
    SELECT 'EEGUploadIncomingPath', 'Path to the upload directory for incoming EEG studies', 1, 0, 'text', ID, 'EEG Incoming Directory', 7 FROM ConfigSettings WHERE Name="paths";

-- Add new permissions for eeg uploader
INSERT INTO permissions (code, description, moduleID, action, categoryID) VALUES
    ('monitor_eeg_uploads','Monitor EEG uploads',(SELECT ID FROM modules WHERE Name='electrophysiology_uploader'),NULL,'2');