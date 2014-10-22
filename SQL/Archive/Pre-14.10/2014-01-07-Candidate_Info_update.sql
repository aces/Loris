ALTER TABLE participant_status_options ADD COLUMN parentID int(10);
ALTER TABLE participant_status ADD COLUMN participant_suboptions int(10) AFTER participant_status;
ALTER TABLE participant_status DROP COLUMN withdrawal_reasons;
ALTER TABLE participant_status DROP COLUMN withdrawal_reasons_other_specify;
ALTER TABLE participant_status DROP COLUMN withdrawal_reasons_other_specify_status;
DELETE FROM participant_status_options;
INSERT INTO `participant_status_options` VALUES (1,'Active',0,NULL),(2,'Refused/Not Enrolled',0,NULL),(3,'Ineligible',0,NULL),(4,'Excluded',0,NULL),(5,'Inactive',1,NULL),(6,'Incomplete',1,NULL),(7,'Complete',0,NULL),(8,'Unsure',NULL,5),(9,'Requiring Further Investigation',NULL,5),(10,'Not Responding',NULL,5),(11,'Death',NULL,6),(12,'Lost to Followup',NULL,6);
CREATE TABLE `participant_status_history` (
        `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
        `CandID` int(6) NOT NULL DEFAULT '0',
        `entry_staff` varchar(255) DEFAULT NULL,
        `data_entry_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `participant_status` int(11) DEFAULT NULL,
        `reason_specify` varchar(255),
        `reason_specify_status` enum('not_answered') DEFAULT NULL,
        `participant_subOptions` int(11) DEFAULT NULL,
        PRIMARY KEY (`ID`),
        UNIQUE KEY `ID` (`ID`)
        );
CREATE TABLE `family` (
        `ID` int(10) NOT NULL AUTO_INCREMENT,
        `FamilyID` int(6) NOT NULL,
        `CandID` int(6) NOT NULL,
        `Relationship_type` enum('half_sibling','full_sibling','1st_cousin') DEFAULT NULL,
        PRIMARY KEY (`ID`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `consent_info_history` (
        `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
        `CandID` int(6) NOT NULL DEFAULT '0',
        `entry_staff` varchar(255) DEFAULT NULL,
        `study_consent` enum('yes','no','not_answered') DEFAULT NULL,
        `study_consent_date` date DEFAULT NULL,
        `study_consent_withdrawal` date DEFAULT NULL,
        `data_entry_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`ID`),
        UNIQUE KEY `ID` (`ID`)
        ) ;
ALTER TABLE candidate ADD COLUMN flagged_caveatemptor enum('true','false') DEFAULT 'false';
ALTER TABLE candidate ADD COLUMN flagged_reason int(6);
ALTER TABLE candidate ADD COLUMN flagged_other varchar(255);
ALTER TABLE candidate ADD CoLUMN flagged_other_status enum ('not_answered');
CREATE TABLE caveat_options (ID INT, Description varchar(255), PRIMARY KEY (ID) );
INSERT INTO caveat_options VALUES (1,'Older Sibling diagnosed with autism. Child moved from LR to HR'),(2,'Family met exclusionary criteria after enrollment in study'), (3,'Other');
ALTER TABLE participant_status ADD COLUMN study_consent enum('yes','no','not_answered');
ALTER TABLE participant_status ADD COLUMN study_consent_date date;
ALTER TABLE participant_status ADD COLUMN study_consent_withdrawal date;
