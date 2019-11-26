
SELECT 'Running: SQL/Archive/22.0/2019-04-30-project-rel-rename.sql';

RENAME TABLE project_rel TO project_subproject_rel;

-- Change fields to math their respective reference keys
ALTER TABLE project_subproject_rel CHANGE `SubprojectID` `SubprojectID` int(10) unsigned NOT NULL;

ALTER TABLE project_subproject_rel ADD CONSTRAINT `FK_project_subproject_rel_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE;
ALTER TABLE project_subproject_rel ADD CONSTRAINT `FK_project_subproject_rel_SubprojectID` FOREIGN KEY (`SubprojectID`) REFERENCES `subproject` (`SubprojectID`) ON DELETE CASCADE;


SELECT 'Running: SQL/Archive/22.0/2019-07-01_add_projects_to_sessions.sql';

-- Remove foreign key to be able to change signature of the column
ALTER TABLE project_subproject_rel DROP FOREIGN KEY `FK_project_subproject_rel_ProjectID`;

-- Change/add project ID fields to INT(10) consistently accross tables
ALTER TABLE project_subproject_rel CHANGE COLUMN ProjectID ProjectID int(10) unsigned NOT NULL;
ALTER TABLE Project CHANGE COLUMN ProjectID ProjectID int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE candidate CHANGE COLUMN ProjectID RegistrationProjectID int(10) unsigned DEFAULT NULL;
ALTER TABLE session ADD COLUMN ProjectID int(10) unsigned DEFAULT NULL;

-- Re-add necessary FOREIGN KEY constraints
ALTER TABLE project_subproject_rel ADD CONSTRAINT `FK_project_subproject_rel_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE;
ALTER TABLE candidate ADD CONSTRAINT `FK_candidate_RegistrationProjectID` FOREIGN KEY (`RegistrationProjectID`) REFERENCES `Project` (`ProjectID`) ON UPDATE CASCADE;
ALTER TABLE session ADD CONSTRAINT `FK_session_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`);

-- Populate new session field with pre recorded candidate project
UPDATE session s JOIN candidate c ON s.CandID=c.CandID SET ProjectID=c.RegistrationProjectID;



SELECT 'Running: SQL/Archive/22.0/2019-07-04-remove_header_row_from_parameter_file_and_convert_back_to_Value_field_to_text.sql';

DELETE FROM parameter_file WHERE ParameterTypeID=(SELECT ParameterTypeID FROM parameter_type WHERE Name='header' AND SourceFrom='parameter_file');
DELETE FROM parameter_type WHERE Name='header' AND SourceFrom='parameter_file';
ALTER TABLE parameter_file MODIFY Value TEXT;

SELECT 'Running: SQL/Archive/22.0/2019-07-10-subproject-session-FK.sql';

ALTER TABLE session CHANGE `SubprojectID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE session ADD CONSTRAINT `FK_session_3` FOREIGN KEY (`SubprojectID`) REFERENCES `subproject` (`SubprojectID`);

SELECT 'Running: SQL/Archive/22.0/2019-07-17_remove_mri_acquisition_dates_table.sql';

DROP TABLE mri_acquisition_dates;
SELECT 'Running: SQL/Archive/22.0/2019-08-05-add_projects_to_users.sql';


CREATE TABLE `user_project_rel` (
  `UserID` int(10) unsigned NOT NULL,
  `ProjectID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`UserID`,`ProjectID`),
  CONSTRAINT `FK_user_project_rel_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_project_rel_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- To maintain status quo, add all projects to all users since users had access to all data before projects were added.
INSERT IGNORE INTO user_project_rel
SELECT ID,ProjectID FROM users JOIN Project;

SELECT 'Running: SQL/Archive/22.0/2019-10-01_Rename-media-column.sql';

ALTER TABLE media CHANGE date_uploaded last_modified timestamp;

SELECT 'Running: SQL/Archive/22.0/2019-10-05-Add_alias_to_projects.sql';

ALTER TABLE `Project` ADD COLUMN `Alias` char(4) DEFAULT NULL AFTER `Name`;
UPDATE Project SET Alias=UPPER(LEFT(Name,4)) WHERE Alias IS NULL;
ALTER TABLE `Project` CHANGE COLUMN `Alias` `Alias` char(4) NOT NULL;

SELECT 'Running: SQL/Archive/22.0/2019-11-01-Add_data_release_permissions.sql';

INSERT INTO permissions (code,description,categoryID) VALUES 
('data_release_view','Data Release: View releases',(SELECT ID FROM permissions_category WHERE Description='Permission'));

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_view' AND m.Label='Data Release';

INSERT IGNORE INTO user_perm_rel
SELECT upr.userID, p.permID FROM user_perm_rel upr JOIN permissions p WHERE upr.permID=1 AND p.code IN ('data_release_view');

SELECT 'Running: SQL/Archive/22.0/2019-11-12-Rename_modules_QC_and_DTH.sql';

-- rename modules and change order number according to the new parent menu they belong to
SELECT MAX(OrderNumber)+1 INTO @ordernumber FROM LorisMenu WHERE Parent=(SELECT ID FROM LorisMenu WHERE Label='Clinical');
SELECT ID INTO @parentid FROM LorisMenu WHERE Label='Clinical';

UPDATE LorisMenu SET Label='Behavioural Quality Control', Link='behavioural_qc/', Parent=@parentid, OrderNumber=@ordernumber  WHERE Link='data_team_helper/';

SELECT MAX(OrderNumber)+1 INTO @ordernumber FROM LorisMenu WHERE Parent=(SELECT ID FROM LorisMenu WHERE Label='Imaging');
SELECT ID INTO @parentid FROM LorisMenu WHERE Label='Imaging';
UPDATE LorisMenu SET Label='Imaging Quality Control', Link='imaging_qc/', Parent=@parentid, OrderNumber=@ordernumber WHERE Link='quality_control/';

-- change location of Genomic Browser to place right after imaging tab
SELECT OrderNumber INTO @ordernumber FROM LorisMenu WHERE Label='Imaging';
UPDATE LorisMenu SET OrderNumber=(OrderNumber+1) WHERE Parent IS NULL AND OrderNumber>@ordernumber;

INSERT INTO LorisMenu (Label, OrderNumber)
SELECT 'Genomics', OrderNumber+1 FROM LorisMenu WHERE Label='Imaging';

SELECT ID INTO @parentid FROM LorisMenu WHERE Label='Genomics';
UPDATE LorisMenu SET Parent=@parentid WHERE Link='genomic_browser/';

UPDATE permissions SET Code='quality_control', description='Quality Control access' WHERE code='data_team_helper';

