-- Create EEG upload table
CREATE TABLE `electrophysiology_uploader` (
    `UploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `UploadedBy` varchar(255) NOT NULL,
    `UploadDate` DateTime NOT NULL,
    `UploadLocation` varchar(255) NOT NULL,
    `Status` enum('Not Started', 'Extracted', 'In Progress', 'Complete', 'Failed', 'Archived') DEFAULT 'Not Started',
    `SessionID` int(10) unsigned,
    `Checksum` varchar(40) DEFAULT NULL,
    `MetaData` TEXT DEFAULT NULL,
    PRIMARY KEY (`UploadID`),
    KEY (`SessionID`),
    CONSTRAINT `FK_eegupload_SessionID`
        FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
    CONSTRAINT `FK_eegupload_UploadedBy`
        FOREIGN KEY (`UploadedBy`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Add to module table
INSERT INTO modules (Name, Active) VALUES ('electrophysiology_uploader', 'Y');

-- Add new configurations for eeg uploader
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
    SELECT 'EEGUploadIncomingPath', 'Path to the upload directory for incoming EEG studies', 1, 0, 'text', ID, 'EEG Incoming Directory', 7 FROM ConfigSettings WHERE Name="paths";

-- Add new permissions for eeg uploader
INSERT INTO permissions (code, description, moduleID, action, categoryID) VALUES
    ('monitor_eeg_uploads','Monitor EEG uploads',(SELECT ID FROM modules WHERE Name='electrophysiology_uploader'),NULL,'2');
