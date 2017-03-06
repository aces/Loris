WARNINGS;
SET AUTOCOMMIT=0;
SET SQL_NOTES=0;
START TRANSACTION;

SELECT 'Removing unused indexes' as 'Step #1';
ALTER TABLE `help` 
DROP INDEX `content`,
DROP INDEX `topic`;

SELECT 'Droping unused table help_related_links' as 'Step #2';
DROP TABLE help_related_links;

SELECT 'Adding foreign key between Config and ConfigSettings' as 'Step #3';
SELECT 'Config records not associated with a valid ConfigSettings.id will be deleted' as 'ATTENTION';
ALTER TABLE `Config` 
  ADD INDEX `fk_Config_1_idx` (`ConfigID` ASC);
ALTER TABLE `Config` 
  ADD CONSTRAINT `fk_Config_1`
  FOREIGN KEY (`ConfigID`)
    REFERENCES `ConfigSettings` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between permissions and permissions_category' as 'Step #4';
SELECT 'permissions.categoryID not associated with a valid permissions_category.id will be set to 2 (Permission)' as 'ATTENTION';
UPDATE permissions SET categoryID = 2 WHERE categoryID NOT IN (SELECT id FROM permissions_category);
ALTER TABLE `permissions` 
  CHANGE COLUMN `categoryID` `categoryID` INT(10) NOT NULL DEFAULT 2;
ALTER TABLE `permissions` 
  ADD INDEX `fk_permissions_1_idx` (`categoryID` ASC);
ALTER TABLE `permissions` 
  ADD CONSTRAINT `fk_permissions_1`
  FOREIGN KEY (`categoryID`)
    REFERENCES `permissions_category` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


SELECT 'Adding foreign key between candidate and caveat_options' as 'Step #5';
SELECT 'List of candidate(s) with innexistant flagged_reason in the canveat_options table. Those flagged_reason will be set to NULL' as 'ATTENTION';
SELECT c.candid, c.flagged_reason 
  FROM candidate c
  WHERE NOT EXISTS (
    SELECT ID FROM caveat_options WHERE c.flagged_reason = ID
  ) AND c.flagged_reason IS NOT NULL;
ALTER TABLE `candidate` 
  ADD INDEX `FK_candidate_2_idx` (`flagged_reason` ASC);
ALTER TABLE `candidate` 
  ADD CONSTRAINT `FK_candidate_2`
  FOREIGN KEY (`flagged_reason`)
    REFERENCES `caveat_options` (`ID`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

SELECT 'Dropping duplicate index CandidateCenterID in the candidate table' as 'Step #6';
ALTER TABLE `candidate` 
  DROP INDEX `CandidateCenterID` ;

SELECT 'Adding index PSCID in the candidate table' as 'Step #7';
ALTER TABLE `candidate` 
  ADD INDEX `PSCID` (`PSCID` ASC);

SELECT 'Adding foreign key between document_repository_categories and document_repository tables' as 'Step #8';
SELECT 'document_repository.File_category not associated with a valid document_repository_categories.id will be set to NULL' as 'ATTENTION';
UPDATE document_repository SET File_category = NULL WHERE File_category NOT IN (SELECT id FROM document_repository_categories);
ALTER TABLE `document_repository` 
  CHANGE COLUMN `File_category` `File_category` INT(3) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `document_repository`
  ADD INDEX `fk_document_repository_1_idx` (`File_category` ASC);
ALTER TABLE `document_repository`
  ADD CONSTRAINT `fk_document_repository_1`
  FOREIGN KEY (`File_category`)
    REFERENCES `document_repository_categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

SELECT 'Adding foreign key between document_repository_categories and document_repository tables' as 'Step #9';
SELECT 'session_status records not associated with a valid session.id will be deleted' as 'ATTENTION';
DELETE FROM session_status WHERE SessionID NOT IN (SELECT id FROM `session`);
ALTER TABLE `session_status` 
  CHANGE COLUMN `SessionID` `SessionID` INT(10) UNSIGNED NOT NULL ;
ALTER TABLE `session_status` 
  ADD CONSTRAINT `fk_session_status_1`
  FOREIGN KEY (`SessionID`)
    REFERENCES `session` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between participant_status and participant_status_options tables' as 'Step #10';
SELECT 'participant_status.participant_status not associated with a valid participant_status_options.id will be set to NULL' as 'ATTENTION';
SELECT 'participant_status.participant_suboptions not associated with a valid participant_status_options.id will be set to NULL' as 'ATTENTION';
UPDATE participant_status SET participant_status = NULL WHERE participant_status NOT IN (SELECT id FROM participant_status_options);
UPDATE participant_status SET participant_suboptions = NULL WHERE participant_suboptions NOT IN (SELECT id FROM participant_status_options);
ALTER TABLE `participant_status` 
CHANGE COLUMN `participant_status` `participant_status` INT(10) UNSIGNED NULL DEFAULT NULL ,
CHANGE COLUMN `participant_suboptions` `participant_suboptions` INT(10) UNSIGNED NULL DEFAULT NULL ;
ALTER TABLE `participant_status` 
  ADD INDEX `fk_participant_status_1_idx` (`participant_status` ASC),
  ADD INDEX `fk_participant_status_2_idx` (`participant_suboptions` ASC);
ALTER TABLE `participant_status` 
  ADD CONSTRAINT `fk_participant_status_1`
  FOREIGN KEY (`participant_status`)
    REFERENCES `participant_status_options` (`ID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_participant_status_2`
  FOREIGN KEY (`participant_suboptions`)
    REFERENCES `participant_status_options` (`ID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between participant_status and candidate tables' as 'Step #11';
SELECT 'participant_status records not associated with a valid candidate.candid will be deleted' as 'ATTENTION';
DELETE FROM participant_status WHERE CandID NOT IN (SELECT candid FROM candidate);
ALTER TABLE `participant_status` 
  ADD CONSTRAINT `fk_participant_status_3`
  FOREIGN KEY (`CandID`)
    REFERENCES `candidate` (`CandID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE `project_rel`
  CHANGE COLUMN `ProjectID` `ProjectID` INT(2) NOT NULL,
  CHANGE COLUMN `SubprojectID` `SubprojectID` INT(10) UNSIGNED NOT NULL;
DELETE FROM project_rel WHERE ProjectID NOT IN (SELECT ProjectID FROM Project);
DELETE FROM project_rel WHERE SubprojectID NOT IN (SELECT SubprojectID FROM subproject);

ALTER TABLE `LORIS_17_1`.`project_rel`
  ADD PRIMARY KEY (`ProjectID`, `SubprojectID`);

SELECT 'COMMIT' as 'Ending with';
COMMIT;
