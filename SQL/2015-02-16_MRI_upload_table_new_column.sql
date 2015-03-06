ALTER TABLE mri_upload ADD COLUMN PatientName VARCHAR(255) NOT NULL DEFAULT '' AFTER SourceLocation;
ALTER TABLE mri_upload ADD COLUMN IsTarchiveValidated tinyint(1) NOT NULL DEFAULT '0' AFTER IsValidated;
