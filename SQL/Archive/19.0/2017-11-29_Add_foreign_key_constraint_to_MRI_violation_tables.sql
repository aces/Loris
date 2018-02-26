-- Add TarchiveID foreign key to MRIcandidateErrors
ALTER TABLE MRICandidateErrors
  ADD CONSTRAINT `FK_tarchive_MRICandidateError_1`
    FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`);

-- Add TarchiveID foreign key to mri_violations_log
ALTER TABLE mri_violations_log
  ADD CONSTRAINT `FK_tarchive_mriViolationsLog_1`
    FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`);

-- Add TarchiveID foreign key to files
ALTER TABLE files
  ADD CONSTRAINT `FK_files_TarchiveID`
    FOREIGN KEY (`TarchiveSource`) REFERENCES `tarchive` (`TarchiveID`);

-- Add FileID foreign key to files_qcstatus
ALTER TABLE files_qcstatus
  MODIFY COLUMN `FileID` INT(10) UNSIGNED UNIQUE NULL,
  ADD CONSTRAINT `FK_filesqcstatus_FileID`
    FOREIGN KEY (`FileID`) REFERENCES `files` (`FileID`);

-- Add SessionID and TarchiveID foreign keys to mri_upload
ALTER TABLE mri_upload
  ADD CONSTRAINT `FK_mriupload_SessionID`
    FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
  ADD CONSTRAINT `FK_mriupload_TarchiveID`
    FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`);

-- Add ScanType foreign key in mri_protocol_checks
ALTER TABLE mri_protocol_checks
  ADD CONSTRAINT `FK_mriProtocolChecks_ScanType`
    FOREIGN KEY (`Scan_type`) REFERENCES `mri_scan_type` (`ID`);

-- Add SessionID foreign key in tarchive
ALTER TABLE tarchive
  ADD CONSTRAINT `FK_tarchive_sessionID`
    FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`);