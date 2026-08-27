CREATE TABLE `bids_dataset` (
  `ID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Path` VARCHAR(255) NOT NULL,
  `InsertTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `bids_dataset_path_unique` (`Path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `bids_file` (
  `ID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `DatasetID` INT(10) UNSIGNED NOT NULL,
  `Path` VARCHAR(255) NOT NULL,
  `SourcePath` VARCHAR(255) NULL,
  `InsertTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Blake2bHash` CHAR(128) NOT NULL,
  `Derivative` TINYINT(1) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `bids_file_dataset_id_path_unique` (`DatasetID`, `Path`),
  KEY `bids_file_dataset_id_fk_idx` (`DatasetID`),
  CONSTRAINT `bids_file_dataset_id_fk`
    FOREIGN KEY (`DatasetID`) REFERENCES `bids_dataset` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `files`
  ADD COLUMN `BidsInfoID` INT(10) UNSIGNED NULL,
  ADD KEY `files_bids_info_id_fk_idx` (`BidsInfoID`),
  ADD CONSTRAINT `files_bids_info_id_fk`
    FOREIGN KEY (`BidsInfoID`) REFERENCES `bids_file` (`ID`) ON DELETE SET NULL;

ALTER TABLE `physiological_file`
  ADD COLUMN `BidsInfoID` INT(10) UNSIGNED NULL,
  ADD KEY `physiological_file_bids_info_id_fk_idx` (`BidsInfoID`),
  ADD CONSTRAINT `physiological_file_bids_info_id_fk`
    FOREIGN KEY (`BidsInfoID`) REFERENCES `bids_file` (`ID`) ON DELETE SET NULL;

ALTER TABLE `physiological_event_file`
  ADD COLUMN `BidsInfoID` INT(10) UNSIGNED NULL,
  ADD KEY `physiological_event_file_bids_info_id_fk_idx` (`BidsInfoID`),
  ADD CONSTRAINT `physiological_event_file_bids_info_id_fk`
    FOREIGN KEY (`BidsInfoID`) REFERENCES `bids_file` (`ID`) ON DELETE SET NULL;

ALTER TABLE `meg_ctf_head_shape_file`
  ADD COLUMN `BidsInfoID` INT(10) UNSIGNED NULL,
  ADD COLUMN `InsertTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD KEY `meg_ctf_head_shape_file_bids_info_id_fk_idx` (`BidsInfoID`),
  ADD CONSTRAINT `meg_ctf_head_shape_file_bids_info_id_fk`
    FOREIGN KEY (`BidsInfoID`) REFERENCES `bids_file` (`ID`) ON DELETE SET NULL;

ALTER TABLE `physiological_file`
  DROP FOREIGN KEY `physiological_file_head_shape_file_id_fk`,
  ADD CONSTRAINT `physiological_file_head_shape_file_id_fk`
    FOREIGN KEY (`HeadShapeFileID`) REFERENCES `meg_ctf_head_shape_file` (`ID`) ON DELETE SET NULL;
