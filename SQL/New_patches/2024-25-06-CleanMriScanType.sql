-- Rename foreign key fields for consistency

ALTER TABLE `mri_scan_type`
  RENAME COLUMN `ID` TO `MriScanTypeID`;

ALTER TABLE `mri_scan_type`
  RENAME COLUMN `Scan_type` TO `MriScanTypeName`;

ALTER TABLE `mri_protocol`
  RENAME COLUMN `Scan_type` TO `MriScanTypeID`;

ALTER TABLE `mri_protocol_checks`
  RENAME COLUMN `Scan_type` TO `MriScanTypeID`;

ALTER TABLE `mri_violations_log`
  RENAME COLUMN `Scan_type` TO `MriScanTypeID`;

ALTER TABLE `files`
  RENAME COLUMN `AcquisitionProtocolID` TO `MriScanTypeID`;

-- Add unique constraints on table that benefit from them

ALTER TABLE `mri_protocol_group_target`
  ADD CONSTRAINT `UK_mri_protocol_group_target`
    UNIQUE (`ProjectID`, `CohortID`, `Visit_label`);

ALTER TABLE `mri_scan_type`
  ADD CONSTRAINT `UK_mri_scan_type_name`
    UNIQUE KEY `MriScanTypeName` (`MriScanTypeName`);

-- Drop wrong default

ALTER TABLE `mri_protocol`
  ALTER `MriScanTypeID` DROP DEFAULT;

-- Add missing foreign key constraints

ALTER TABLE `mri_protocol`
  ADD CONSTRAINT `FK_mri_protocol_scan_type`
    FOREIGN KEY (`MriScanTypeID`) REFERENCES `mri_scan_type` (`MriScanTypeID`);

ALTER TABLE `mri_violations_log`
  ADD CONSTRAINT `FK_mri_violations_log_scan_type`
    FOREIGN KEY (`MriScanTypeID`) REFERENCES `mri_scan_type` (`MriScanTypeID`);

-- Rename the existing constraints for consistency

ALTER TABLE `mri_protocol_checks`
  DROP FOREIGN KEY `FK_mriProtocolChecks_ScanType`,
  ADD CONSTRAINT `FK_mri_protocol_checks_scan_type`
    FOREIGN KEY (`MriScanTypeID`) REFERENCES `mri_scan_type` (`MriScanTypeID`);
