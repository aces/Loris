ALTER TABLE mri_upload ADD COLUMN Processed tinyint(1) NOT NULL DEFAULT '0' AFTER SourceLocation;
ALTER TABLE mri_upload ADD COLUMN CurrentlyProcessed tinyint(1) NOT NULL DEFAULT '0';
ALTER TABLE mri_upload ADD COLUMN PatientName VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE mri_upload ADD COLUMN IsTarchiveValidated tinyint(1) NOT NULL DEFAULT '0' AFTER IsValidated;
