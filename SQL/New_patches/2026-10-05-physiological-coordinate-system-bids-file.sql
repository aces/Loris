ALTER TABLE `physiological_coord_system`
  ADD COLUMN `BidsFileID` INT(10) UNSIGNED NULL,
  ADD KEY `physiological_coord_system_bids_file_id_fk_idx` (`BidsFileID`),
  ADD CONSTRAINT `physiological_coord_system_bids_file_id_fk`
    FOREIGN KEY (`BidsFileID`) REFERENCES `bids_file` (`ID`) ON DELETE SET NULL;
