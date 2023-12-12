-- Create the hrrt_archive and hrrt_archive_files tables
CREATE TABLE `hrrt_archive` (
  `HrrtArchiveID`     INT(11)          NOT NULL AUTO_INCREMENT,
  `SessionID`         INT(10) unsigned          DEFAULT NULL,
  `EcatFileCount`     INT(11)          NOT NULL DEFAULT '0',
  `NonEcatFileCount`  INT(11)          NOT NULL DEFAULT '0',
  `DateAcquired`      DATE                      DEFAULT NULL,
  `DateArchived`      DATETIME                  DEFAULT NULL,
  `PatientName`       VARCHAR(50)      NOT NULL DEFAULT '',
  `CenterName`        VARCHAR(50)      NOT NULL DEFAULT '',
  `CreatingUser`      VARCHAR(50)      NOT NULL DEFAULT '',
  `Blake2bArchive`    VARCHAR(255)              DEFAULT NULL,
  `ArchiveLocation`   VARCHAR(255)              DEFAULT NULL,
  PRIMARY KEY (`HrrtArchiveID`),
  KEY `patNam` (`CenterName`(10),`PatientName`(30)),
  KEY `FK_hrrt_archive_sessionID` (`SessionID`),
  CONSTRAINT `FK_hrrt_archive_sessionID`
    FOREIGN KEY (`SessionID`)
    REFERENCES `session` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `hrrt_archive_files` (
  `HrrtArchiveFileID` INT(11)      NOT NULL AUTO_INCREMENT,
  `HrrtArchiveID`     INT(11)      NOT NULL DEFAULT '0',
  `Blake2bHash`       VARCHAR(255) NOT NULL,
  `FileName`          VARCHAR(255) NOT NULL,
  PRIMARY KEY (`HrrtArchiveFileID`),
  KEY `HrrtArchiveID` (`HrrtArchiveID`),
  CONSTRAINT `hrrt_archive_files_ibfk_1`
    FOREIGN KEY (`HrrtArchiveID`)
    REFERENCES  `hrrt_archive` (`HrrtArchiveID`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create the mri_upload_rel table
CREATE TABLE `mri_upload_rel` (
  `UploadRelID`   INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `UploadID`      INT(10) UNSIGNED NOT NULL,
  `HrrtArchiveID` INT(11) DEFAULT NULL,
  PRIMARY KEY (`UploadRelID`),
  KEY `FK_mriuploadrel_UploadID` (`UploadID`),
  KEY `FK_mriuploadrel_HrrtArchiveID` (`HrrtArchiveID`),
  CONSTRAINT `FK_mriuploadrel_UploadID`
    FOREIGN KEY (`UploadID`)
    REFERENCES `mri_upload` (`UploadID`),
  CONSTRAINT `FK_mriuploadrel_HrrtArchiveID`
    FOREIGN KEY (`HrrtArchiveID`)
    REFERENCES `hrrt_archive` (`HrrtArchiveID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Insert into notification type 'hrrt pet new series'
INSERT INTO notification_types SET
  Type        = 'hrrt pet new series',
  private     = 0,
  Description = 'New HRRT PET studies inserted into the database';


-- Alter files table to add a HrrtArchiveID field that links HRRT MINC files
-- to hrrt_archive tables
ALTER TABLE files
  ADD COLUMN `HrrtArchiveID` INT(11) DEFAULT NULL,
  ADD KEY `FK_files_HrrtArchiveID_1` (`HrrtArchiveID`),
  ADD CONSTRAINT `FK_files_HrrtArchiveID`
    FOREIGN KEY (`HrrtArchiveID`) REFERENCES `hrrt_archive` (`HrrtArchiveID`);
