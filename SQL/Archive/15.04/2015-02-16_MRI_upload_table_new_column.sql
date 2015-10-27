ALTER TABLE imaging_uploader ADD COLUMN Processed tinyint(1) NOT NULL DEFAULT '0' AFTER SourceLocation;
ALTER TABLE imaging_uploader ADD COLUMN CurrentlyProcessed tinyint(1) NOT NULL DEFAULT '0';
ALTER TABLE imaging_uploader ADD COLUMN PatientName VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE imaging_uploader ADD COLUMN IsTarchiveValidated tinyint(1) NOT NULL DEFAULT '0' AFTER IsValidated;
