--
-- Add necessary file types in ImagingFileTypes
--
INSERT INTO ImagingFileTypes (type, description) VALUES
('json',   'JSON file'),
('readme', 'README file'),
('tsv',    'Tab separated values (TSV) file'),
('bval',   'NIfTI DWI file with b-values'),
('bvec',   'NIfTI DWI file with b-vectors');


--
-- Create table to store PhaseEncodingDirection possible values
--
CREATE TABLE `bids_phase_encoding_direction` (
  `BIDSPhaseEncodingDirectionID`   int(3) unsigned NOT NULL AUTO_INCREMENT,
  `BIDSPhaseEncodingDirectionName` varchar(3) NOT NULL,
  PRIMARY KEY (`BIDSPhaseEncodingDirectionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO bids_phase_encoding_direction (BIDSPhaseEncodingDirectionName) VALUES
('i'),
('i-'),
('j'),
('j-'),
('k'),
('k-');


--
-- Alter table bids_mri_scan_type_rel to add a PhaseEncodingDirection field
--
ALTER TABLE bids_mri_scan_type_rel ADD COLUMN BIDSPhaseEncodingDirectionID int(3) unsigned DEFAULT NULL;
ALTER TABLE bids_mri_scan_type_rel
    ADD CONSTRAINT `FK_bids_phase_encoding_direction`
        FOREIGN KEY (`BIDSPhaseEncodingDirectionID`)
            REFERENCES `bids_phase_encoding_direction` (`BIDSPhaseEncodingDirectionID`);


--
-- Table structure for `bids_file_level_category`
--
CREATE TABLE `bids_export_file_level_category` (
  `BIDSExportFileLevelCategoryID`   int(10) unsigned NOT NULL AUTO_INCREMENT,
  `BIDSExportFileLevelCategoryName` varchar(12) NOT NULL,
  PRIMARY KEY (`BIDSExportFileLevelCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO bids_export_file_level_category (BIDSExportFileLevelCategoryName) VALUES
  ('study'),
  ('image'),
  ('session');



--
-- BIDS non-imaging file types
--
CREATE TABLE `bids_export_non_imaging_file_category` (
  `BIDSNonImagingFileCategoryID`   int(10) unsigned NOT NULL AUTO_INCREMENT,
  `BIDSNonImagingFileCategoryName` varchar(40) NOT NULL,
  PRIMARY KEY (`BIDSNonImagingFileCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO bids_export_non_imaging_file_category (BIDSNonImagingFileCategoryName) VALUES
  ('dataset_description'),
  ('README'),
  ('bids-validator-config'),
  ('participants_list_file'),
  ('session_list_of_scans');


--
-- Table structure for table `bids_export_files`
--
CREATE TABLE `bids_export_files` (
  `BIDSExportedFileID`            int(10) unsigned NOT NULL AUTO_INCREMENT,
  `BIDSExportFileLevelCategoryID` int(10) unsigned NOT NULL,
  `FileID`                        int(10) unsigned DEFAULT NULL,
  `SessionID`                     int(10) unsigned DEFAULT NULL,
  `BIDSNonImagingFileCategoryID`  int(10) unsigned DEFAULT NULL,
  `BIDSCategoryID`                int(3)  unsigned DEFAULT NULL,
  `FileType`                      varchar(12) NOT NULL,
  `FilePath`                      varchar(255) NOT NULL,
  PRIMARY KEY (`BIDSExportedFileID`),
  CONSTRAINT `FK_bef_BIDSExportFileLevelID`        FOREIGN KEY (`BIDSExportFileLevelCategoryID`) REFERENCES `bids_export_file_level_category` (`BIDSExportFileLevelCategoryID`),
  CONSTRAINT `FK_bef_FileID`                       FOREIGN KEY (`FileID`)                        REFERENCES `files`   (`FileID`),
  CONSTRAINT `FK_bef_SessionID`                    FOREIGN KEY (`SessionID`)                     REFERENCES `session` (`ID`),
  CONSTRAINT `FK_bef_BIDSNonImagingFileCategoryID` FOREIGN KEY (`BIDSNonImagingFileCategoryID`)  REFERENCES `bids_export_non_imaging_file_category` (`BIDSNonImagingFileCategoryID`),
  CONSTRAINT `FK_bef_ModalityType`                 FOREIGN KEY (`BIDSCategoryID`)                REFERENCES `bids_category` (`BIDSCategoryID`),
  CONSTRAINT `FK_bef_FileType`                     FOREIGN KEY (`FileType`)                      REFERENCES `ImagingFileTypes` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


