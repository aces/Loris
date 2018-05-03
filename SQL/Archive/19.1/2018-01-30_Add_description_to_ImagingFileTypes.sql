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
