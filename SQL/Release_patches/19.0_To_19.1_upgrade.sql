CREATE TABLE `language` (
  `language_id` integer unsigned NOT NULL AUTO_INCREMENT,
  `language_code` varchar(255) NOT NULL,
  `language_label` varchar(255) NOT NULL,
  PRIMARY KEY (`language_id`),
  UNIQUE KEY (`language_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO language (language_code, language_label) VALUES ('en-CA', 'English');

ALTER TABLE users ADD language_preference integer unsigned DEFAULT NULL;
ALTER TABLE users ADD CONSTRAINT `FK_users_2` FOREIGN KEY (`language_preference`) REFERENCES `language` (`language_id`);

ALTER TABLE media ADD COLUMN  language_id INT UNSIGNED DEFAULT NULL;
ALTER TABLE media ADD CONSTRAINT `FK_media_language` FOREIGN KEY (`language_id`) REFERENCES `language` (`language_id`);

-- Disable Foreign key to be able to change type
-- of FileType to VARCHAR(12) in files,
-- mri_processing_protocol and ImagingFileType
SET FOREIGN_KEY_CHECKS=0;

-- ALTER files to drop the FK_files_FileTypes
ALTER TABLE files
  MODIFY `FileType` VARCHAR(12);

-- ALTER mri_processing_protocol to drop the
-- FK_mri_processing_protocol_FileTypes
ALTER TABLE mri_processing_protocol
  MODIFY `FileType` VARCHAR(12);

-- ALTER ImagingFileTypes table to add a `description` column
ALTER TABLE ImagingFileTypes
  MODIFY `type` VARCHAR(12) NOT NULL,
  ADD `description` VARCHAR(255) DEFAULT NULL;

-- Re-enable the forein keys
SET FOREIGN_KEY_CHECKS=1;

-- ADD description to the different type
UPDATE ImagingFileTypes
  SET description='MINC file'
  WHERE type='mnc';

UPDATE ImagingFileTypes
  SET description='3D imaging format'
  WHERE type='obj';

UPDATE ImagingFileTypes
  SET description='transformation matrix file'
  WHERE type='xfm';

UPDATE ImagingFileTypes
  SET description=NULL
  WHERE type='xfmmnc';

UPDATE ImagingFileTypes
  SET description='audition impulse file'
  WHERE type='imp';

UPDATE ImagingFileTypes
  SET description='file describing the cortical thickness in a single column'
  WHERE type='vertstat';

UPDATE ImagingFileTypes
  SET description='XML file'
  WHERE type='xml';

UPDATE ImagingFileTypes
  SET description='text file'
  WHERE type='txt';

UPDATE ImagingFileTypes
  SET description='NIfTI file'
  WHERE type='nii';

UPDATE ImagingFileTypes
  SET description='NRRD file format (used by DTIPrep)'
  WHERE type='nrrd';

INSERT INTO ImagingFileTypes (type, description)
  VALUES ('grid_0', 'MNI BIC non-linear field for non-linear transformation');

-- DELETE xfmmnc entry as no one understand what it is referring to
DELETE FROM ImagingFileTypes
  WHERE type='xfmmnc';

-- MAP .nii.gz file type in files table to .nii and delete .nii
UPDATE files
  SET FileType='nii'
  WHERE FileType='nii.gz';
DELETE FROM ImagingFileTypes
  WHERE type='nii.gz';

-- delete .imp (obscure file type not used currently in any project)
DELETE FROM ImagingFileTypes
  WHERE type='imp';

-- Add Imaging Browser to Imaging Modules
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ImagingBrowserLinkedInstruments', 'Instruments that the users want to see linked from Imaging Browser', 1, 1, 'instrument', ID, 'Imaging Browser Links to Instruments', 7 FROM ConfigSettings WHERE Name="imaging_modules";

-- Default imaging_browser settings for Linked instruments
-- This will be the two tables mri_parameter_form and radiology_review; IF they exist in the database
SET @s1 = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.TABLES
        WHERE table_name = 'mri_parameter_form'
        AND table_schema = DATABASE()
    ) > 0,
    "INSERT INTO Config (ConfigID, Value) SELECT cs.ID, 'mri_parameter_form' FROM ConfigSettings cs WHERE cs.Name='ImagingBrowserLinkedInstruments'",
    "SELECT 'No. It is therefore not inserted into the Configuration module under Imaging Modules' as 'mri parameter_form table exists?'"
));

PREPARE stmt1 FROM @s1;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

SET @s2 = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.TABLES
        WHERE table_name = 'radiology_review'
        AND table_schema = DATABASE()
    ) > 0,
    "INSERT INTO Config (ConfigID, Value) SELECT cs.ID, 'mri_parameter_form' FROM ConfigSettings cs WHERE cs.Name='ImagingBrowserLinkedInstruments'",
    "SELECT 'No. It is therefore not inserted into the Configuration module under Imaging Modules' as 'radiology_review table exists?'"
));

PREPARE stmt2 FROM @s2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

