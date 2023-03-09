-- Populate new session field with pre recorded candidate project
ALTER TABLE candidate DROP FOREIGN KEY `FK_candidate_RegistrationProjectID`;
ALTER TABLE candidate CHANGE `RegistrationProjectID` `RegistrationProjectID` int(10) unsigned NOT NULL;
ALTER TABLE candidate ADD CONSTRAINT `FK_candidate_RegistrationProjectID` FOREIGN KEY (`RegistrationProjectID`) REFERENCES `Project` (`ProjectID`) ON UPDATE CASCADE;

UPDATE session s JOIN candidate c ON s.CandID=c.CandID SET ProjectID=c.RegistrationProjectID WHERE ProjectID IS NULL;

ALTER TABLE `session` DROP FOREIGN KEY `FK_session_ProjectID`;
ALTER TABLE `session` CHANGE `ProjectID` `ProjectID` int(10) unsigned NOT NULL;
ALTER TABLE `session` ADD CONSTRAINT `FK_session_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`);


