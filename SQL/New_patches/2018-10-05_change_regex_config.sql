UPDATE Config
SET Value = "."
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='patientIDRegex')
AND Value='/./i';

UPDATE Config
SET Value = "."
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='patientNameRegex')
AND Value='/./i';

UPDATE Config
SET Value = "(?i)phantom"
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='LegoPhantomRegex')
AND Value='/phantom/i';

UPDATE Config
SET Value = "(?i)phantom"
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='LivingPhantomRegex')
AND Value='/phantom/i';