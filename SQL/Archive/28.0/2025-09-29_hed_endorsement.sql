-- Add TaggedBy column (user FK). NULL signifies it came with the dataset
ALTER TABLE physiological_task_event_hed_rel
  ADD COLUMN TaggedBy int(10) unsigned DEFAULT NULL;
ALTER TABLE bids_event_dataset_mapping
  ADD COLUMN TaggedBy int(10) unsigned DEFAULT NULL;
ALTER TABLE bids_event_file_mapping
  ADD COLUMN TaggedBy int(10) unsigned DEFAULT NULL;
-- ADD FK constraint
ALTER TABLE physiological_task_event_hed_rel
  ADD CONSTRAINT `FK_pte_tagged_by_user`
    FOREIGN KEY (`TaggedBy`) REFERENCES `users` (`ID`);
ALTER TABLE bids_event_dataset_mapping
  ADD CONSTRAINT `FK_bed_tagged_by_user`
    FOREIGN KEY (`TaggedBy`) REFERENCES `users` (`ID`);
ALTER TABLE bids_event_file_mapping
  ADD CONSTRAINT `FK_bef_tagged_by_user`
    FOREIGN KEY (`TaggedBy`) REFERENCES `users` (`ID`);

-- Create `hed_tag_endorsement` table
CREATE TABLE `hed_tag_endorsement` (
 `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `HEDRelID` int(10) unsigned NOT NULL,   -- TODO: Manually handle ON DELETE CASCADE
 `HEDTable` enum(
   'physiological_task_event_hed_rel',
   'bids_event_dataset_mapping',
   'bids_event_file_mapping'
   ) NOT NULL,
 `EndorsedBy` int(10) unsigned NOT NULL,
 `EndorsementStatus` enum(
   'Endorsed',
   'Caveat',
   'Comment'
   ) NOT NULL,
 `EndorsementComment` TEXT DEFAULT NULL,
 `EndorsedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `LastUpdate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`ID`),
 CONSTRAINT `FK_endorsed_by_user`
   FOREIGN KEY (`EndorsedBy`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create `hed_tag_endorsement_history` table
CREATE TABLE `hed_tag_endorsement_history` (
 `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `EndorsementID` int(10) unsigned NOT NULL,
 `Action` enum(
   'INSERT',
   'UPDATE',
   'DELETE'
   ) NOT NULL,
 `HEDRelID` int(10) unsigned NOT NULL,
 `HEDTable` enum(
   'physiological_task_event_hed_rel',
   'bids_event_dataset_mapping',
   'bids_event_file_mapping'
   ) NOT NULL,
 `EndorsedBy` int(10) unsigned NOT NULL,
 `EndorsementStatus` enum(
   'Endorsed',
   'Caveat',
   'Comment'
   ) NOT NULL,
 `EndorsementComment` TEXT DEFAULT NULL,
 `EndorsedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`ID`),
 CONSTRAINT `FK_endorsement_id`
   FOREIGN KEY (`EndorsementID`) REFERENCES `hed_tag_endorsement` (`ID`) ON UPDATE CASCADE,
 CONSTRAINT `FK_endorsed_by_user_history`
   FOREIGN KEY (`EndorsedBy`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create `hed_tag_history` table
CREATE TABLE `hed_tag_history` (
 `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `HEDTableID` int(10) unsigned NOT NULL,
 `HEDTable` enum(
   'physiological_task_event_hed_rel',
   'bids_event_dataset_mapping',
   'bids_event_file_mapping'
   ) NOT NULL,
 `HEDReferenceID` int(10) unsigned NOT NULL, -- PhysiologicalTaskEventID, ProjectID, EventFileID
 `TaggedBy` int(10) unsigned DEFAULT NULL,
 `PropertyName` varchar(50) DEFAULT NULL,
 `PropertyValue` varchar(255) DEFAULT NULL,
 `HEDTagID` int(10) unsigned DEFAULT NULL,   -- Reference to hed_schema_nodes.ID. Can be null to only add parentheses
 `TagValue` TEXT NULL,
 `Description` TEXT NULL,
 `HasPairing` BOOLEAN DEFAULT FALSE,   -- Is grouped with #AdditionalMembers# members
 `PairRelID` int(10) unsigned NULL,    -- The `ID` of right side of the pair
 `AdditionalMembers` int(10) unsigned DEFAULT 0,
 `ModificationType` enum('insert', 'update', 'delete') NOT NULL,
 `ModifiedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`ID`),
 CONSTRAINT `FK_hed_tagged_by_history`
   FOREIGN KEY (`TaggedBy`) REFERENCES `users` (`ID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create `physiological_task_event_history` table
CREATE TABLE `physiological_task_event_history` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PhysiologicalTaskEventID` int(10) unsigned NOT NULL,
  `PhysiologicalFileID` int(10) unsigned NOT NULL,
  `EventFileID` int(10) unsigned NOT NULL,
  `InsertTime` timestamp NOT NULL,
  `Onset` decimal(11,6) DEFAULT NULL,
  `Duration` decimal(11,6) DEFAULT NULL,
  `Channel` TEXT DEFAULT NULL,
  `EventCode` int(10) DEFAULT NULL,
  `EventValue` varchar(255) DEFAULT NULL,
  `EventSample` decimal(11,6) DEFAULT NULL,
  `EventType` varchar(50) DEFAULT NULL,
  `TrialType` varchar(255) DEFAULT NULL,
  `ResponseTime` time DEFAULT NULL,
  `ModifiedBy` int(10) unsigned DEFAULT NULL,
  `ModificationType` enum('insert', 'update', 'delete') NOT NULL,
  `ModifiedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_physiological_task_event_modified_by_history`
    FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`ID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

