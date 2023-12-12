-- Drop the Center_name table (CenterID will be replacing it)
-- Before droping the column, ensure the relevant data have been ported into the CenterID column
ALTER TABLE mri_protocol DROP COLUMN `Center_name`;
