-- Populate new session field with pre recorded candidate project
UPDATE session s JOIN candidate c ON s.CandID=c.CandID SET ProjectID=c.RegistrationProjectID WHERE ProjectId IS NULL;
ALTER TABLE `session` CHANGE `ProjectID` `ProjectID` int(10) unsigned NOT NULL;


