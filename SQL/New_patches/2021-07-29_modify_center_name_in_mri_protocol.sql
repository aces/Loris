ALTER TABLE mri_protocol ADD `CenterID` integer unsigned DEFAULT NULL AFTER `Center_name`;
ALTER TABLE mri_protocol ADD FOREIGN KEY (`CenterID`) REFERENCES psc(`CenterID`);
ALTER TABLE mri_protocol DROP COLUMN `Center_name`;
