ALTER TABLE `tarchive`
  RENAME COLUMN `DicomArchiveID` TO `StudyInstanceUID`,
  RENAME COLUMN `CenterName` TO `InstitutionName`;

ALTER TABLE `tarchive`
  DROP COLUMN `neurodbCenterName`,
  DROP COLUMN `uploadAttempt`,
  DROP COLUMN `sumTypeVersion`,
  DROP COLUMN `tarTypeVersion`,
  DROP COLUMN `DateSent`,
  DROP COLUMN `PendingTransfer`,
  DROP COLUMN `AcquisitionMetadata`,
  MODIFY COLUMN `StudyInstanceUID` varchar(255) NOT NULL,
  MODIFY COLUMN `InstitutionName` varchar(255) NULL,
  MODIFY COLUMN `md5sumDicomOnly` varchar(255) NOT NULL,
  MODIFY COLUMN `md5sumArchive` varchar(255) NOT NULL,
  MODIFY COLUMN `CreatingUser` varchar(255) NOT NULL,
  MODIFY COLUMN `SourceLocation` varchar(255) NOT NULL,
  MODIFY COLUMN `ArchiveLocation` varchar(255) NOT NULL,
  MODIFY COLUMN `ScannerManufacturer` varchar(255) NULL,
  MODIFY COLUMN `ScannerModel` varchar(255) NULL,
  MODIFY COLUMN `ScannerSerialNumber` varchar(255) NULL,
  MODIFY COLUMN `ScannerSoftwareVersion` varchar(255) NULL;

UPDATE `tarchive`
SET
  `InstitutionName` = NULLIF(`InstitutionName`, ''),
  `ScannerManufacturer` = NULLIF(`ScannerManufacturer`, ''),
  `ScannerModel` = NULLIF(`ScannerModel`, ''),
  `ScannerSerialNumber` = NULLIF(`ScannerSerialNumber`, ''),
  `ScannerSoftwareVersion` = NULLIF(`ScannerSoftwareVersion`, '');
