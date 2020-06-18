-- Add date_format option to DataType
ALTER TABLE ConfigSettings
	MODIFY COLUMN `DataType` enum('text','boolean','email','instrument','textarea','scan_type','date_format','lookup_center','path','web_path') DEFAULT NULL;

-- Update DataType of dobFormat
UPDATE ConfigSettings
	SET DataType='date_format' WHERE Name='dobFormat';

-- Update DataType of dodFormat
UPDATE ConfigSettings
	SET DataType='date_format' WHERE Name='dodFormat';

-- Convert old date casing combos to supported format
UPDATE Config SET Value='Ymd' 
	WHERE Value IN ('YMD', 'YMd', 'YmD', 'yMD', 'yMd', 'ymD', 'ymd') 
	AND ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='dobFormat');

UPDATE Config SET Value='Ymd' 
        WHERE Value IN ('YMD', 'YMd', 'YmD', 'yMD', 'yMd', 'ymD', 'ymd') 
        AND ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='dodFormat');

UPDATE Config SET Value='Ym'
	WHERE Value IN ('YM', 'ym', 'yM')
	AND ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='dobFormat');

UPDATE Config SET Value='Ym'
        WHERE Value IN ('YM', 'ym', 'yM')
        AND ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='dodFormat');
