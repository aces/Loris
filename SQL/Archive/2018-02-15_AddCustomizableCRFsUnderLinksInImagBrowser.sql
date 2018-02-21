-- Add Imaging Browser to Imaging Modules
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ImagingBrowserLinkedInstruments', 'Instruments that the users want to see linked from Imaging Browser', 1, 1, 'instrument', ID, 'Imaging Browser Links to Instruments', 7 FROM ConfigSettings WHERE Name="imaging_modules";

-- Default imaging_browser settings for Linked instruments
-- This will be the two tables mri_parameter_form and radiology_review; IF they exist in the database

SET @s1 = CONCAT("
  SET @s2 = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_name = ? AND table_schema = DATABASE()) > 0,
    \"SELECT CONCAT('INSERT INTO Config (ConfigID, Value) SELECT cs.ID, ',?,' FROM ConfigSettings cs WHERE cs.Name=\"'ImagingBrowserLinkedInstruments'\"') as 'Insertion successful:'\",
    \"SELECT CONCAT('INSERT in Configuration Settings for the Imaging Modules of ',?,' DID NOT HAPPEN since the table does not exist') as 'Insertion successful:'\"
  ))
");

SET @table = 'mri_parameter_form';

PREPARE stmt FROM @s1;
EXECUTE stmt USING @table;

PREPARE stmt2 FROM @s2;
EXECUTE stmt2 USING @table;

SET @table = 'radiology_review';

PREPARE stmt FROM @s1;
EXECUTE stmt USING @table;

PREPARE stmt2 FROM @s2;
EXECUTE stmt2 USING @table;


--  \"SELECT CONCAT('INSERT INTO Config (ConfigID, Value) SELECT cs.ID, ',?,' FROM ConfigSettings cs WHERE cs.Name=\"'ImagingBrowserLinkedInstruments'\"') as 'Insertion successful:'\",
