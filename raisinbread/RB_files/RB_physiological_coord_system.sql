SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `physiological_coord_system`;
LOCK TABLES `physiological_coord_system` WRITE;
INSERT INTO `physiological_coord_system` (`PhysiologicalCoordSystemID`, `NameID`, `TypeID`, `UnitID`, `ModalityID`, `FilePath`) VALUES (1,1,1,1,4,NULL);
INSERT INTO `physiological_coord_system` (`PhysiologicalCoordSystemID`, `NameID`, `TypeID`, `UnitID`, `ModalityID`, `FilePath`) VALUES (2,9,3,4,1,'bids_imports/PIDCC0821_V03_BIDSVersion_1.6.0/sub-PIDCC0821/ses-V03/eeg/sub-PIDCC0821_ses-V03_acq-eeg_space-CapTrak_coordsystem.json');
INSERT INTO `physiological_coord_system` (`PhysiologicalCoordSystemID`, `NameID`, `TypeID`, `UnitID`, `ModalityID`, `FilePath`) VALUES (3,6,3,4,1,'bids_imports/PIDCC0821_V03_BIDSVersion_1.6.0/sub-PIDCC0821/ses-V03/eeg/sub-PIDCC0821_ses-V03_acq-eeg_space-CTF_coordsystem.json');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
