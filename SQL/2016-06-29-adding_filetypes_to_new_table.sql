--patch creating FileTypes table for existing projects and adding foreign keys to other tables
CREATE TABLE `FileTypes` (
 `type` varchar(255) NOT NULL PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `FileTypes` VALUES
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

ALTER TABLE `document_repository` ADD FOREIGN KEY (`File_type`) REFERENCES `FileTypes`(`type`);
ALTER TABLE `mri_processing_protocol` MODIFY `FileType` VARCHAR(255);
ALTER TABLE `mri_processing_protocol` ADD FOREIGN KEY (`FileType`) REFERENCES `FileTypes`(`type`);
ALTER TABLE `files` MODIFY `FileType` VARCHAR(255) default NULL;
ALTER TABLE `files` ADD FOREIGN KEY (`FileType`) REFERENCES `FileTypes`(`type`);
ALTER TABLE `genomic_files` ADD FOREIGN KEY (`FileType`) REFERENCES `FileTypes`(`type`);
