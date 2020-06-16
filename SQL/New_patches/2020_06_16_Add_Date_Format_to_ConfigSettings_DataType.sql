-- Add date_format option to DataType
ALTER TABLE ConfigSettings
	MODIFY COLUMN `DataType` enum('text','boolean','email','instrument','textarea','scan_type','date_format','lookup_center','path','web_path') DEFAULT NULL;

-- Update DataType of dobFormat
UPDATE ConfigSettings
	SET DataType='date_format' WHERE Name='dobFormat';

-- Update DataType of dodFormat
UPDATE ConfigSettings
	SET DataType='date_format' WHERE Name='dodFormat';