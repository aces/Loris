-- Populate new session field with pre recorded candidate project
ALTER TABLE candidate CHANGE `RegistrationProjectID` `RegistrationProjectID` int(10) unsigned NOT NULL;
UPDATE session s JOIN candidate c ON s.CandID=c.CandID SET ProjectID=c.RegistrationProjectID WHERE ProjectID IS NULL;
ALTER TABLE `session` CHANGE `ProjectID` `ProjectID` int(10) unsigned NOT NULL;


