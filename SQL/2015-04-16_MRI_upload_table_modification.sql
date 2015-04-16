ALTER TABLE mri_upload CHANGE COLUMN SourceLocation UploadLocation VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE mri_upload ADD COLUMN DecompressLocation VARCHAR(255) NOT NULL DEFAULT '' AFTER UploadLocation; 
