-- Convert all Perl regex that contain the case-insensitive modifier 'i'
UPDATE Config
SET Value=CONCAT('(?i)', SUBSTRING(Value FROM 2 FOR LENGTH(Value)-3))
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='patientIDRegex')
AND Value LIKE '/%/i';

-- Removes the leading and trailing forward slashes from every regex that do not contain any modifier
UPDATE Config
SET Value=SUBSTRING(Value FROM 2 FOR LENGTH(Value)-2)
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='patientIDRegex')
AND Value LIKE '/%/';

-- Convert all Perl regex that contain the case-insensitive modifier 'i'
UPDATE Config
SET Value=CONCAT('(?i)', SUBSTRING(Value FROM 2 FOR LENGTH(Value)-3))
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='patientNameRegex')
AND Value LIKE '/%/i';

-- Removes the leading and trailing forward slashes from every regex that do not contain any modifier
UPDATE Config
SET Value=SUBSTRING(Value FROM 2 FOR LENGTH(Value)-2)
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='patientNameRegex')
AND Value LIKE '/%/';

-- Convert all Perl regex that contain the case-insensitive modifier 'i'
UPDATE Config
SET Value=CONCAT('(?i)', SUBSTRING(Value FROM 2 FOR LENGTH(Value)-3))
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='LegoPhantomRegex')
AND Value LIKE '/%/i';

-- Removes the leading and trailing forward slashes from every regex that do not contain any modifier
UPDATE Config
SET Value=SUBSTRING(Value FROM 2 FOR LENGTH(Value)-2)
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='LegoPhantomRegex')
AND Value LIKE '/%/';

-- Convert all Perl regex that contain the case-insensitive modifier 'i'
UPDATE Config
SET Value=CONCAT('(?i)', SUBSTRING(Value FROM 2 FOR LENGTH(Value)-3))
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='LivingPhantomRegex')
AND Value LIKE '/%/i';

-- Removes the leading and trailing forward slashes from every regex that do not contain any modifier
UPDATE Config
SET Value=SUBSTRING(Value FROM 2 FOR LENGTH(Value)-2)
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='LivingPhantomRegex')
AND Value LIKE '/%/';