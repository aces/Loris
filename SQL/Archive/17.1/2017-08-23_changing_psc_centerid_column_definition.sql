WARNINGS;
SELECT 'Droping foreign keys' as 'Step #1';
ALTER TABLE candidate DROP FOREIGN KEY `FK_candidate_1`;
ALTER TABLE examiners_psc_rel DROP FOREIGN KEY `FK_examiners_psc_rel_2`;
ALTER TABLE issues DROP FOREIGN KEY `fk_issues_5`;
ALTER TABLE notification_spool DROP FOREIGN KEY `FK_notification_spool_2`;
ALTER TABLE session DROP FOREIGN KEY `FK_session_2`;
ALTER TABLE user_psc_rel DROP FOREIGN KEY `FK_user_psc_rel_2`;

SELECT 'Changing column definitions' as 'Step #2-A';
ALTER TABLE candidate CHANGE `CenterID` `CenterID` integer unsigned NOT NULL;
ALTER TABLE examiners_psc_rel CHANGE `centerID` `centerID` integer unsigned NOT NULL;
ALTER TABLE issues CHANGE `centerID` `centerID` integer unsigned DEFAULT NULL;
ALTER TABLE session CHANGE `CenterID` `CenterID` integer unsigned DEFAULT NULL;
ALTER TABLE user_psc_rel CHANGE `CenterID` `CenterID` integer unsigned NOT NULL;
ALTER TABLE psc CHANGE `CenterID` `CenterID` integer unsigned NOT NULL AUTO_INCREMENT;

SELECT 'Changing column definitions for notification_spool' as 'Step #2-B';
-- There might be values with invalid dates (e.g.: 0000-00-00 00:00:00)

-- save current setting of sql_mode
SET @old_sql_mode := @@sql_mode ;

-- derive a new value by removing NO_ZERO_DATE and NO_ZERO_IN_DATE
SET @new_sql_mode := @old_sql_mode ;
SET @new_sql_mode := TRIM(BOTH ',' FROM REPLACE(CONCAT(',',@new_sql_mode,','),',NO_ZERO_DATE,'  ,','));
SET @new_sql_mode := TRIM(BOTH ',' FROM REPLACE(CONCAT(',',@new_sql_mode,','),',NO_ZERO_IN_DATE,',','));
SET @@sql_mode := @new_sql_mode ;

ALTER TABLE notification_spool CHANGE `CenterID` `CenterID` integer unsigned DEFAULT NULL;

-- when we are done with required operations, we can revert back
-- to the original sql_mode setting, from the value we saved
SET @@sql_mode := @old_sql_mode ;


SELECT 'Adding foreign keys back' as 'Step #3';
ALTER TABLE candidate ADD CONSTRAINT `FK_candidate_1` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`);
ALTER TABLE examiners_psc_rel ADD CONSTRAINT `FK_examiners_psc_rel_2` FOREIGN KEY (`centerID`) REFERENCES `psc` (`CenterID`);
ALTER TABLE issues ADD CONSTRAINT `fk_issues_5` FOREIGN KEY (`centerID`) REFERENCES `psc` (`CenterID`);
ALTER TABLE notification_spool ADD CONSTRAINT `FK_notification_spool_2` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`);
ALTER TABLE session ADD CONSTRAINT `FK_session_2` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`);
ALTER TABLE user_psc_rel ADD CONSTRAINT `FK_user_psc_rel_2` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`);
