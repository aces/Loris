ALTER TABLE imaging_uploader CHANGE COLUMN SourceLocation UploadLocation VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE imaging_uploader ADD COLUMN DecompressedLocation VARCHAR(255) NOT NULL DEFAULT '' AFTER UploadLocation;
