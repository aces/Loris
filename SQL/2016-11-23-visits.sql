-- Cleanup TO DELETE
ALTER TABLE session DROP FOREIGN KEY `FK_visits_session_rel_1`;
ALTER TABLE Visit_Windows DROP FOREIGN KEY `FK_visits_Visit_Windows_rel_1`;
ALTER TABLE session DROP COLUMN VisitID;
ALTER TABLE Visit_Windows DROP COLUMN VisitID;
DROP TABLE IF EXISTS `visits_subproject_project_rel`;
DROP TABLE IF EXISTS `visits`;
UPDATE LorisMenu SET Visible=true WHERE Visible=false;

-- TABLES ARE REQUIRED TO BE INNODB
-- subproject
-- Project
-- visits
-- session
-- visit windows


-- Create a table for visits where ID is the primary key, 
-- legacy_label being the currently used "visit_label",
-- label being the front end presentation of the visit
DROP TABLE IF EXISTS `visits`;
CREATE TABLE `visits` (
	`ID` int(10) unsigned NOT NULL auto_increment,
	`label` varchar(255) NOT NULL,
	`legacy_label` varchar(255) DEFAULT NULL,
	`imaging` enum('Y','N') DEFAULT 'N' NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY (`legacy_label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `visits_subproject_project_rel`;
CREATE TABLE `visits_subproject_project_rel` (
  `VisitID` int(10) unsigned NOT NULL,
  `SubprojectID` int(10) unsigned NOT NULL,
  `ProjectID` int(2) DEFAULT NULL,
  PRIMARY KEY  (`visitID`,`subprojectID`),
  CONSTRAINT `FK_visits_subproject_project_rel_1` UNIQUE (`VisitID`,`SubprojectID`,`ProjectID`),
  CONSTRAINT `FK_visits_subproject_project_rel_2` FOREIGN KEY (`VisitID`) REFERENCES `visits` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_visits_subproject_project_rel_3` FOREIGN KEY (`SubprojectID`) REFERENCES `subproject` (`SubprojectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_visits_subproject_project_rel_4` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE

  )ENGINE=InnoDB DEFAULT CHARSET=utf8;

----------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------
-- POPULATE TABLES USING SCRIPT --
----------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------


-- add column to session to use visits ID
ALTER TABLE session ADD COLUMN VisitID int(10) unsigned;
UPDATE session s SET VisitID=(SELECT ID from visits v WHERE v.legacy_label=s.Visit_label);
ALTER TABLE session ADD CONSTRAINT `FK_visits_session_rel_1` FOREIGN KEY (`VisitID`) REFERENCES `visits` (`ID`);
ALTER TABLE session DROP COLUMN Visit_label;
-- removed visit_label, good riddance

-- add column to Visit_Windows to use visit ID
ALTER TABLE Visit_Windows ADD COLUMN VisitID int(10) unsigned NOT NULL;
UPDATE Visit_Windows vw SET VisitID=(SELECT ID from visits v WHERE v.legacy_label=vw.Visit_label);
ALTER TABLE Visit_Windows ADD CONSTRAINT `FK_visits_Visit_Windows_rel_1` FOREIGN KEY (`VisitID`) REFERENCES `visits` (`ID`);
ALTER TABLE Visit_Windows DROP COLUMN Visit_label;

-- add column to test_battery to use visits ID
ALTER TABLE test_battery ADD COLUMN VisitID int(10) unsigned;
UPDATE test_battery tb SET VisitID=(SELECT ID from visits v WHERE v.legacy_label=tb.Visit_label);
-- TODO VISITS WHAT HAPPENS IF Visit_label is NULL
ALTER TABLE test_battery ADD CONSTRAINT `FK_visits_test_battery_rel_1` FOREIGN KEY (`VisitID`) REFERENCES `visits` (`ID`);
ALTER TABLE test_battery DROP COLUMN Visit_label;
-- removed visit_label, good riddance

-- add column to certification to use visits ID
ALTER TABLE certification ADD COLUMN VisitID int(10) unsigned;
UPDATE certification c SET VisitID=(SELECT ID from visits v WHERE v.legacy_label=c.visit_label);
-- TODO VISITS WHAT HAPPENS IF Visit_label is NULL
ALTER TABLE certification ADD CONSTRAINT `FK_visits_certification_rel_1` FOREIGN KEY (`VisitID`) REFERENCES `visits` (`ID`);
ALTER TABLE certification DROP COLUMN visit_label;
-- removed visit_label, good riddance

-- add column to certification to use visits ID
ALTER TABLE certification_history ADD COLUMN VisitID int(10) unsigned;
UPDATE certification_history ch SET VisitID=(SELECT ID from visits v WHERE v.legacy_label=ch.visit_label);
-- TODO VISITS WHAT HAPPENS IF Visit_label is NULL
ALTER TABLE certification_history ADD CONSTRAINT `FK_visits_certification_history_rel_1` FOREIGN KEY (`VisitID`) REFERENCES `visits` (`ID`);
ALTER TABLE certification_history DROP COLUMN visit_label;
-- removed visit_label, good riddance

-- add column to certification to use visits ID
ALTER TABLE document_repository ADD COLUMN VisitID int(10) unsigned;
UPDATE document_repository dr SET VisitID=(SELECT ID from visits v WHERE v.legacy_label=dr.visitLabel);
-- TODO VISITS WHAT HAPPENS IF Visit_label is NULL
ALTER TABLE document_repository ADD CONSTRAINT `FK_visits_document_repository_rel_1` FOREIGN KEY (`VisitID`) REFERENCES `visits` (`ID`);
ALTER TABLE document_repository DROP COLUMN visitLabel;
-- removed visit_label, good riddance

-- add column to certification to use visits ID
ALTER TABLE mri_violations_log ADD COLUMN VisitID int(10) unsigned;
UPDATE mri_violations_log mvl SET VisitID=(SELECT ID from visits v WHERE v.legacy_label=mvl.visitLabel);
-- TODO VISITS WHAT HAPPENS IF Visit_label is NULL
ALTER TABLE mri_violations_log ADD CONSTRAINT `FK_visits_mri_violations_log_rel_1` FOREIGN KEY (`VisitID`) REFERENCES `visits` (`ID`);
ALTER TABLE mri_violations_log DROP COLUMN Visit_label;
-- removed visit_label, good riddance