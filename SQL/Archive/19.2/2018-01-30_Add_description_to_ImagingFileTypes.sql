-- ALTER ImagingFileTypes table to add a `description` column
ALTER TABLE ImagingFileTypes
  ADD `description` VARCHAR(255) DEFAULT NULL;

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
  SET description='compressed NIfTI file'
  WHERE type='nii.gz';

UPDATE ImagingFileTypes
  SET description='NRRD file format (used by DTIPrep)'
  WHERE type='nrrd';

INSERT INTO ImagingFileTypes
  VALUES ('grid_0', 'MNI BIC non-linear field for non-linear transformation');

DELETE FROM ImagingFileTypes
  WHERE type='xfmmnc';
