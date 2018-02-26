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

