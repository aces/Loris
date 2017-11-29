ALTER TABLE MRICandidateErrors ADD CONSTRAINT `FK_tarchive_MRICandidateError_1` FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`)
ALTER TABLE mri_violations_log ADD CONSTRAINT `FK_tarchive_mriViolationsLog_1` FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`)
