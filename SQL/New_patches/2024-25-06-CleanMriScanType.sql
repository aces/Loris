ALTER TABLE `mri_protocol_group_target`
  ADD UNIQUE (`ProjectID`, `CohortID`, `Visit_label`);

ALTER TABLE `mri_protocol`
  RENAME COLUMN `Scan_type` TO `MriScanTypeID`;

ALTER TABLE `mri_protocol_checks`
  RENAME COLUMN `Scan_type` TO `MriScanTypeID`;

ALTER TABLE `mri_violations_log`
  RENAME COLUMN `Scan_type` TO `MriScanTypeID`;

ALTER TABLE `mri_protocol`
  ALTER `MriScanTypeID` DROP DEFAULT;

ALTER TABLE `mri_protocol`
  ADD CONSTRAINT `FK_mri_protocol_scan_type`
    FOREIGN KEY (`MriScanTypeID`) REFERENCES `mri_scan_type`(`ID`);

ALTER TABLE `mri_violations_log`
  ADD CONSTRAINT `FK_mri_violations_log_scan_type`
    FOREIGN KEY (`MriScanTypeID`) REFERENCES `mri_scan_type`(`ID`);

-- Rename the existing constraints for consistency

ALTER TABLE `mri_protocol_checks`
  DROP FOREIGN KEY `FK_mriProtocolChecks_ScanType`,
  ADD CONSTRAINT `FK_mri_protocol_checks_scan_type`
    FOREIGN KEY (`MriScanTypeID`) REFERENCES `mri_scan_type` (`id`);
