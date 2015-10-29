ALTER TABLE mri_upload CHANGE COLUMN SourceLocation UploadLocation VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE mri_upload ADD COLUMN DecompressedLocation VARCHAR(255) NOT NULL DEFAULT '' AFTER UploadLocation; 
