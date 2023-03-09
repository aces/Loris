-- Add a new CenterID column
ALTER TABLE mri_protocol 
ADD COLUMN `CenterID` integer unsigned DEFAULT NULL 
AFTER `Center_name`;

ALTER TABLE mri_protocol ADD FOREIGN KEY (`CenterID`) REFERENCES psc(`CenterID`);

-- Populate the CenterID column using Center_name (equivalent to MRI_alias in the psc table)
UPDATE mri_protocol 
INNER JOIN psc ON (Center_name = MRI_alias) 
SET mri_protocol.CenterID = psc.CenterID;

-- Drop the Center_name table (CenterID will be replacing it)
ALTER TABLE mri_protocol DROP COLUMN `Center_name`;
