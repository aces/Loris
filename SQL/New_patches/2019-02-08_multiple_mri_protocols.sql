-- ####################################################################################
--
-- SQL patch used to allow the usage of multiple MRI protocols within a given
-- study
--
-- ####################################################################################

-- -----------------------------------------------------------------------------------
-- 
-- mri_protocol_group table
--
-- By default, there is only one MRI protocol group
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_group` (
    `MriProtocolGroupID`   INT(2) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Name`                 VARCHAR(255)    NOT NULL,
    PRIMARY KEY (`MriProtocolGroupID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8;
INSERT INTO `mri_protocol_group` VALUES(1, "Default MRI protocol group");


-- -----------------------------------------------------------------------------------
-- 
-- mri_protocol_group_rel table
--
-- Associates lines of the mri_protocol table with lines
-- of table mri_protocol_group
-- 
-- By default, all lines of the MRI protocol table are associated
-- to the default MRI protocol group
--
-- Note that each line of the mri_protocol table can be associated to 
-- at most one group.
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_group_rel` (
    `MriProtocolGroupID` INT(2) UNSIGNED  NOT NULL,
    `MriProtocolID`      INT(11) UNSIGNED NOT NULL,
    CONSTRAINT `FK_mri_protocol_group_rel_1` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`),
    CONSTRAINT `FK_mri_protocol_group_rel_2` FOREIGN KEY (`MriProtocolID`)      REFERENCES `mri_protocol` (`ID`),
    CONSTRAINT `UK_mri_protocol_group_rel`   UNIQUE (`MriProtocolID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8;
INSERT INTO `mri_protocol_group_rel` SELECT 1, ID FROM `mri_protocol`;


-- -----------------------------------------------------------------------------------
-- 
-- mri_protocol_group_target table
--
-- Specify the MRI protocol group (or set of lines in mri_protocol) to use to 
-- identify the type of a given scan based on the candidate's project 
-- ID, the session's subproject ID and visit label. 
-- 
-- By default, all scans use the default MRI protocol group for scan type
-- identification purposes
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_group_target` (
     `MriProtocolGroupID` INT(2) UNSIGNED  NOT NULL,
     `ProjectID`          INT(2)           DEFAULT NULL,
     `SubprojectID`       INT(10) UNSIGNED DEFAULT NULL,
     `Visit_label`        VARCHAR(255)     DEFAULT NULL,
     CONSTRAINT `FK_mri_protocol_group_target_1` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`),
     CONSTRAINT `FK_mri_protocol_group_target_2` FOREIGN KEY (`ProjectID`)          REFERENCES `Project` (`ProjectID`),
     CONSTRAINT `FK_mri_protocol_group_target_3` FOREIGN KEY (`SubprojectID`)       REFERENCES `subproject` (`SubprojectID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8;
INSERT INTO `mri_protocol_group_target` VALUES(1, NULL, NULL, NULL);



-- -----------------------------------------------------------------------------------
-- 
-- mri_protocol_checks_group table
--
-- By default, there is only one MRI protocol checks group
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_checks_group` (
    `MriProtocolChecksGroupID`   INT(2) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Name`                       VARCHAR(255)    NOT NULL,
    PRIMARY KEY (`MriProtocolChecksGroupID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8;
INSERT INTO `mri_protocol_checks_group` VALUES(1, 'Default MRI protocol checks group');

-- -----------------------------------------------------------------------------------
-- 
-- mri_protocol_checks_group_rel table
--
-- Associates lines of the mri_protocol_checks table with lines
-- of table mri_protocol_checks_group
-- 
-- By default, all lines of the MRI protocol table are associated
-- to the default MRI protocol group
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_checks_group_rel` (
    `MriProtocolChecksGroupID` INT(2) UNSIGNED  NOT NULL,
    `MriProtocolChecksID`      INT(11)          NOT NULL,
    CONSTRAINT `FK_mri_protocol_checks_group_rel_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`),
    CONSTRAINT `FK_mri_protocol_checks_group_rel_2` FOREIGN KEY (`MriProtocolChecksID`)      REFERENCES `mri_protocol_checks` (`ID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8;
INSERT INTO `mri_protocol_checks_group_rel` SELECT 1, ID FROM `mri_protocol_checks`;

-- -----------------------------------------------------------------------------------
-- 
-- mri_protocol_checks_group_target table
--
-- Specify the MRI protocol checks group (or set of lines in mri_protocol_checks)
-- to use to perform MRI protocol checks for a given scan based on the candidate's 
-- project ID, the session's subproject ID and visit label.
-- 
-- By default, all scans use the default MRI protocol checks group 
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_checks_group_target` (
     `MriProtocolChecksGroupID` INT(2) UNSIGNED  NOT NULL,
     `ProjectID`                INT(2)           DEFAULT NULL,
     `SubprojectID`             INT(10) UNSIGNED DEFAULT NULL,
     `Visit_label`              VARCHAR(255)     DEFAULT NULL,
     CONSTRAINT `FK_mri_protocol_checks_group_target_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`),
     CONSTRAINT `FK_mri_protocol_checks_group_target_2` FOREIGN KEY (`ProjectID`)                REFERENCES `Project` (`ProjectID`),
     CONSTRAINT `FK_mri_protocol_checks_group_target_3` FOREIGN KEY (`SubprojectID`)             REFERENCES `subproject` (`SubprojectID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8;
INSERT INTO `mri_protocol_checks_group_target` VALUES(1, NULL, NULL, NULL);

-- ----------------------------------------------------------------------------------
-- Addition of a new column in table mri_protocol_violated_scans to identify the
-- MRI protocol group that was used when trying to identify the scan type
-- ----------------------------------------------------------------------------------
ALTER TABLE `mri_protocol_violated_scans` ADD COLUMN `MriProtocolGroupID` INT(2) UNSIGNED NOT NULL;
UPDATE mri_protocol_violated_scans SET MriProtocolGroupID=1;
ALTER TABLE `mri_protocol_violated_scans` ADD CONSTRAINT `FK_mri_violated_2` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`);

-- -----------------------------------------------------------------------------------
-- Addition of a new column in table mri_violations_log to identify the
-- group of MRI protocol checks that was used when performing the MRI protocol checks
-- -----------------------------------------------------------------------------------
ALTER TABLE `mri_violations_log` ADD COLUMN `MriProtocolChecksGroupID` INT(2) UNSIGNED NOT NULL;
UPDATE mri_violations_log SET MriProtocolChecksGroupID=1;
ALTER TABLE `mri_violations_log` ADD CONSTRAINT `FK_mri_checks_group_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`);

