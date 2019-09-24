-- Remove foreign key to be able to change signature of the column
ALTER TABLE project_subproject_rel DROP FOREIGN KEY `FK_project_subproject_rel_ProjectID`;

-- Change/add project ID fields to INT(10) consistently accross tables
ALTER TABLE project_subproject_rel CHANGE COLUMN ProjectID ProjectID int(10) unsigned NOT NULL;
ALTER TABLE Project CHANGE COLUMN ProjectID ProjectID int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE candidate CHANGE COLUMN ProjectID RegistrationProjectID int(10) unsigned NOT NULL;
ALTER TABLE session ADD COLUMN ProjectID int(10) unsigned NOT NULL;

-- Re-add necessary FOREIGN KEY constraints
ALTER TABLE project_subproject_rel ADD CONSTRAINT `FK_project_subproject_rel_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE;
ALTER TABLE candidate ADD CONSTRAINT `FK_candidate_RegistrationProjectID` FOREIGN KEY (`RegistrationProjectID`) REFERENCES `Project` (`ProjectID`) ON UPDATE CASCADE;
ALTER TABLE session ADD CONSTRAINT `FK_session_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`);

-- Populate new session field with pre recorded candidate project
UPDATE session s JOIN candidate c ON s.CandID=c.CandID SET ProjectID=c.RegistrationProjectID;


