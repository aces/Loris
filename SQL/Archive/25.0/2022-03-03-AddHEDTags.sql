-- ############################## CAPTURE HEDVersion ########################## --
-- HEDVersion from dataset_description.json to be added to parameter_type
-- Entry in physiological_parameter_file will be added on dataset import**
INSERT INTO parameter_type (Name, Type, Description, SourceFrom) VALUES
    ('HEDVersion', 'text', 'HED Schema Version','physiological_parameter_file')
;

-- ############################## HANDLE EVENT FILES ########################## --
-- Create `physiological_event_file` table
CREATE TABLE `physiological_event_file` (
    `EventFileID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PhysiologicalFileID` int(10) unsigned NOT NULL,
    `FileType` varchar(20) NOT NULL,
    `FilePath` varchar(255) DEFAULT NULL,
    `LastUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `LastWritten` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`EventFileID`),
    KEY `FK_physio_file_ID` (`PhysiologicalFileID`),
    KEY `FK_event_file_type` (`FileType`),
    CONSTRAINT `FK_event_file_type` FOREIGN KEY (`FileType`) REFERENCES `ImagingFileTypes` (`type`),
    CONSTRAINT `FK_physio_file_ID` FOREIGN KEY (`PhysiologicalFileID`) REFERENCES `physiological_file` (`PhysiologicalFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;

-- Create reference to EventFileID in `physiological_task_event` table
SET FOREIGN_KEY_CHECKS= 0;
ALTER TABLE physiological_task_event
    ADD COLUMN `EventFileID` int(10) unsigned NOT NULL AFTER PhysiologicalFileID,
    ADD KEY `FK_event_file` (`EventFileID`),
    ADD CONSTRAINT `FK_event_file` FOREIGN KEY (`EventFileID`) REFERENCES `physiological_event_file` (`EventFileID`)
;

-- Create column for assembled HEd tags in `physiological_task_event` table
ALTER TABLE physiological_task_event
    ADD COLUMN `AssembledHED` text DEFAULT NULL
;

-- Insert files into `physiological_event_file` table
INSERT INTO physiological_event_file (PhysiologicalFileID, FilePath, FileType)
    SELECT DISTINCT PhysiologicalFileID, FilePath, 'tsv' FROM physiological_task_event
;

-- Update EventFileID reference in `physiological_task_event` table
UPDATE physiological_task_event te
    SET EventFileID=(SELECT EventFileID FROM physiological_event_file WHERE PhysiologicalFileID=te.PhysiologicalFileID)
;
SET FOREIGN_KEY_CHECKS= 1;

-- Delete FilePath column in `physiological_task_event` table
ALTER TABLE physiological_task_event
    DROP COLUMN FilePath
;


-- ############################## EVENT FILES ARCHIVE ########################## --
CREATE TABLE `physiological_event_archive` (
    `EventArchiveID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PhysiologicalFileID` int(10) unsigned NOT NULL,
    `Blake2bHash` varchar(128) NOT NULL,
    `FilePath` varchar(255) NOT NULL,
    PRIMARY KEY (`EventArchiveID`),
    KEY `FK_phy_file_ID` (`PhysiologicalFileID`),
    CONSTRAINT `FK_phy_file_ID` FOREIGN KEY (`PhysiologicalFileID`) REFERENCES `physiological_file` (`PhysiologicalFileID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;


-- ############################## CAPTURE EVENT PARAMETERS ########################## --
CREATE TABLE `physiological_event_parameter` (
    `EventParameterID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `EventFileID` int(10) unsigned NOT NULL,
    `ParameterName` varchar(255) NOT NULL,
    `Description` text DEFAULT NULL,
    `LongName` varchar(255) DEFAULT NULL,
    `Units` varchar(50) DEFAULT NULL,
    `isCategorical` enum('Y', 'N') DEFAULT NULL,
    `HED` text DEFAULT NULL,
    PRIMARY KEY (`EventParameterID`),
    KEY `FK_event_file_ID` (`EventFileID`),
    CONSTRAINT `FK_event_file_ID` FOREIGN KEY (`EventFileID`) REFERENCES `physiological_event_file` (`EventFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;

CREATE TABLE `physiological_event_parameter_category_level` (
    `CategoricalLevelID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `EventParameterID` int(10) unsigned NOT NULL,
    `LevelName` varchar(255) NOT NULL,
    `Description` text DEFAULT NULL,
    `HED` text DEFAULT NULL,
    PRIMARY KEY (`CategoricalLevelID`),
    KEY `FK_event_param_ID` (`EventParameterID`),
    CONSTRAINT `FK_event_param_ID` FOREIGN KEY (`EventParameterID`) REFERENCES `physiological_event_parameter` (`EventParameterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;
