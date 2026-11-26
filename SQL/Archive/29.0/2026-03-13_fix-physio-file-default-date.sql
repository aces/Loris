-- Modify AcquisitionTime column to allow NULL and remove the dummy default
ALTER TABLE `physiological_file`
MODIFY COLUMN `AcquisitionTime` DATETIME DEFAULT NULL;

-- Update any existing records that still have the dummy date to NULL
UPDATE `physiological_file`
SET `AcquisitionTime` = NULL
WHERE `AcquisitionTime` = '1970-01-01 00:00:01';
