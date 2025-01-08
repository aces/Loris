-- Rename foreign key fields for consistency

ALTER TABLE `mri_scan_type`
  CHANGE `ID` `MriScanTypeID` int(11) unsigned NOT NULL auto_increment;

ALTER TABLE `mri_scan_type`
  CHANGE `Scan_type` `MriScanTypeName` VARCHAR(255) NOT NULL;

ALTER TABLE `mri_protocol`
  CHANGE `Scan_type` `MriScanTypeID` int(10) unsigned NOT NULL;

ALTER TABLE `mri_protocol_checks`
  CHANGE `Scan_type` `MriScanTypeID` int(11) unsigned DEFAULT NULL;

ALTER TABLE `mri_violations_log`
  CHANGE `Scan_type` `MriScanTypeID` int(11) unsigned DEFAULT NULL;

ALTER TABLE `files`
  CHANGE `AcquisitionProtocolID` `MriScanTypeID` int(10) unsigned default NULL;

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
