-- Update the Setup Guide link in the Study Description on the login page
-- See: https://github.com/aces/Loris/issues/7071
UPDATE Config 
SET Value = REPLACE(Value, 'https://github.com/aces/Loris/wiki/Setup', 'https://acesloris.readthedocs.io/en/latest') 
WHERE ConfigID = (SELECT ID FROM ConfigSettings WHERE Name = 'StudyDescription');