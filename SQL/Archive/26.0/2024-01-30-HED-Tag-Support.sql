-- Remove unused column
ALTER TABLE `physiological_task_event` DROP COLUMN `AssembledHED`;

-- Add indices for performance improvement
ALTER TABLE `physiological_task_event` ADD INDEX idx_pte_EventValue (`EventValue`);
ALTER TABLE `physiological_task_event` ADD INDEX idx_pte_TrialType (`TrialType`);

-- Add ProjectID and make PhysiologicalFileID DEFAULT NULL
ALTER TABLE `physiological_parameter_file`
  CHANGE `PhysiologicalFileID` `PhysiologicalFileID` int(10) unsigned DEFAULT NULL,
  ADD COLUMN `ProjectID` int(10) unsigned DEFAULT NULL AFTER `PhysiologicalFileID`,
  ADD KEY `FK_physiological_parameter_file_project_id` (`ProjectID`),
  ADD CONSTRAINT `FK_physiological_parameter_file_project_id`
    FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`);

-- Create `hed_schema` table
CREATE TABLE `hed_schema` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Version` varchar(255) NOT NULL,
  `Description` text NULL,
  `URL` varchar(255) NOT NULL UNIQUE,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create `hed_schema_nodes` table
CREATE TABLE `hed_schema_nodes` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ParentID` int(10) unsigned NULL,
  `SchemaID` int(10) unsigned NOT NULL,
  `Name` varchar(255) NOT NULL,
  `LongName` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_hed_parent_node`
    FOREIGN KEY (`ParentID`)
      REFERENCES `hed_schema_nodes` (`ID`),
  CONSTRAINT `FK_hed_schema` FOREIGN KEY (`SchemaID`) REFERENCES `hed_schema` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create `physiological_task_event_hed_rel` table
CREATE TABLE `physiological_task_event_hed_rel` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PhysiologicalTaskEventID` int(10) unsigned NOT NULL,
  `HEDTagID` int(10) unsigned NULL,     -- Reference to hed_schema_nodes.ID. Can be null to only add parentheses
  `TagValue` text NULL,                 -- For value tags
  `HasPairing` boolean DEFAULT FALSE,   -- Is grouped with #AdditionalMembers# members
  `PairRelID` int(10) unsigned NULL,    -- The `ID` of right side of the pair
  `AdditionalMembers` int(10) unsigned DEFAULT 0, -- Number of additional members to encapsulate
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_physiological_task_event_hed_rel_pair` FOREIGN KEY (`PairRelID`)
    REFERENCES `physiological_task_event_hed_rel` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `FK_physiological_task_event_hed_rel_2` (`HEDTagID`),
  CONSTRAINT `FK_physiological_task_event_hed_rel_2` FOREIGN KEY (`HEDTagID`)
    REFERENCES `hed_schema_nodes` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_physiological_task_event_hed_rel_1` FOREIGN KEY (`PhysiologicalTaskEventID`)
    REFERENCES `physiological_task_event` (`PhysiologicalTaskEventID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create `bids_event_dataset_mapping` table
CREATE TABLE `bids_event_dataset_mapping` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ProjectID` int(10) unsigned NOT NULL,
  `PropertyName` varchar(50) NOT NULL,
  `PropertyValue` varchar(255) NOT NULL,
  `HEDTagID` int(10) unsigned NULL,     -- Reference to hed_schema_nodes.ID. Can be null to only add parentheses
  `TagValue` text NULL,                 -- For value tags
  `Description` TEXT NULL,              -- Level Description
  `HasPairing` BOOLEAN DEFAULT FALSE,   -- Is grouped with #AdditionalMembers# members
  `PairRelID` int(10) unsigned NULL,    -- The `ID` of right side of the pair
  `AdditionalMembers` int(10) unsigned DEFAULT 0, -- Number of additional members to encapsulate
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_bids_event_dataset_mapping_pair` FOREIGN KEY (`PairRelID`)
      REFERENCES `bids_event_dataset_mapping` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_event_dataset_PropertyName_PropertyValue (`PropertyName`, `PropertyValue`),
  CONSTRAINT `FK_project_id` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_dataset_hed_tag_id` FOREIGN KEY (`HEDTagID`) REFERENCES `hed_schema_nodes` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Create `bids_event_file_mapping` table
CREATE TABLE `bids_event_file_mapping` (
   `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
   `EventFileID` int(10) unsigned NOT NULL,
   `PropertyName` varchar(50) NOT NULL,
   `PropertyValue` varchar(255) NOT NULL,
   `HEDTagID` int(10) unsigned NULL,     -- Reference to hed_schema_nodes.ID. Can be null to only add parentheses
   `TagValue` text NULL,                 -- For value tags
   `Description` TEXT NULL,              -- Level Description
   `HasPairing` BOOLEAN DEFAULT FALSE,   -- Is grouped with #AdditionalMembers# members
   `PairRelID` int(10) unsigned NULL,    -- The `ID` of right side of the pair
   `AdditionalMembers` int(10) unsigned DEFAULT 0, -- Number of additional members to encapsulate
   PRIMARY KEY (`ID`),
   CONSTRAINT `FK_bids_event_file_mapping_pair` FOREIGN KEY (`PairRelID`)
       REFERENCES `bids_event_file_mapping` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
   INDEX idx_event_file_PropertyName_PropertyValue (`PropertyName`, `PropertyValue`),
   CONSTRAINT `FK_event_mapping_file_id` FOREIGN KEY (`EventFileID`) REFERENCES `physiological_event_file` (`EventFileID`) ON DELETE CASCADE ON UPDATE CASCADE,
   CONSTRAINT `FK_file_hed_tag_id` FOREIGN KEY (`HEDTagID`) REFERENCES `hed_schema_nodes` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;






