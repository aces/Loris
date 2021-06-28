
-- ----------------------------------------------------------------------------------------
-- Change default value of column MriProtocolChecksGroupID for table mri_violations_log
--
-- Reason: the imaging browser allows one to set the Caveat of a scan to true and this 
-- creates an entry in the mri_violations_log table. This entry is not tied to any record
-- in table mri_protocol_checks_group, thus the nullable MriProtocolChecksGroupID.
--
-- ----------------------------------------------------------------------------------------
ALTER TABLE mri_violations_log CHANGE COLUMN `MriProtocolChecksGroupID` `MriProtocolChecksGroupID` INT(4) UNSIGNED DEFAULT NULL;

