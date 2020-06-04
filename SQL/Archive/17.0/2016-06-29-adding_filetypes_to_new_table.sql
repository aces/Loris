-- patch creating FileTypes table for existing projects and adding foreign keys to other tables
CREATE TABLE `ImagingFileTypes` (
 `type` varchar(255) NOT NULL PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `ImagingFileTypes` VALUES
            ('mnc'),
            ('obj'),
            ('xfm'),
            ('xfmmnc'),
            ('imp'),
            ('vertstat'),
            ('xml'),
            ('txt'),
            ('nii'),
            ('nii.gz'),
            ('nrrd');

ALTER TABLE `mri_processing_protocol` MODIFY `FileType` VARCHAR(255) DEFAULT NULL;
ALTER TABLE `mri_processing_protocol` ADD FOREIGN KEY (`FileType`) REFERENCES `ImagingFileTypes`(`type`);
INSERT IGNORE INTO ImagingFileTypes (TYPE) SELECT DISTINCT FileType FROM files;
ALTER TABLE `files` MODIFY `FileType` VARCHAR(255) DEFAULT NULL;
UPDATE files SET FileType = SUBSTRING_INDEX(File,'.',-1) WHERE FileType = '';
ALTER TABLE `files` ADD FOREIGN KEY (`FileType`) REFERENCES `ImagingFileTypes`(`type`);
