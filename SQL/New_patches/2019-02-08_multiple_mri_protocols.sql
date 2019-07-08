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
    `MriProtocolGroupID`   INT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Name`                 VARCHAR(255)    NOT NULL UNIQUE,
    PRIMARY KEY (`MriProtocolGroupID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;
INSERT INTO `mri_protocol_group` (`Name`) VALUES('Default MRI protocol group');


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
     `MriProtocolGroupTargetID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
     `MriProtocolGroupID`       INT(4) UNSIGNED  NOT NULL,
     `ProjectID`                INT(2)           DEFAULT NULL,
     `SubprojectID`             INT(10) UNSIGNED DEFAULT NULL,
     `Visit_label`              VARCHAR(255)     DEFAULT NULL,
     PRIMARY KEY (`MriProtocolGroupTargetID`),
     CONSTRAINT `FK_mri_protocol_group_target_1` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`),
     CONSTRAINT `FK_mri_protocol_group_target_2` FOREIGN KEY (`ProjectID`)          REFERENCES `Project` (`ProjectID`),
     CONSTRAINT `FK_mri_protocol_group_target_3` FOREIGN KEY (`SubprojectID`)       REFERENCES `subproject` (`SubprojectID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;
INSERT INTO `mri_protocol_group_target` (`MriProtocolGroupID`, `ProjectID`, `SubprojectID`, `Visit_label`)
    VALUES((SELECT MriProtocolGroupID FROM mri_protocol_group WHERE Name='Default MRI protocol group'), NULL, NULL, NULL);



-- -----------------------------------------------------------------------------------
--
-- mri_protocol_checks_group table
--
-- By default, there is only one MRI protocol checks group
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_checks_group` (
    `MriProtocolChecksGroupID`   INT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Name`                       VARCHAR(255)    NOT NULL UNIQUE,
    PRIMARY KEY (`MriProtocolChecksGroupID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;
INSERT INTO `mri_protocol_checks_group` (`Name`) VALUES('Default MRI protocol checks group');


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
     `MriProtocolChecksGroupTargetID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
     `MriProtocolChecksGroupID`       INT(4) UNSIGNED  NOT NULL,
     `ProjectID`                      INT(2)           DEFAULT NULL,
     `SubprojectID`                   INT(10) UNSIGNED DEFAULT NULL,
     `Visit_label`                    VARCHAR(255)     DEFAULT NULL,
     PRIMARY KEY(`MriProtocolChecksGroupTargetID`),
     CONSTRAINT `FK_mri_protocol_checks_group_target_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`),
     CONSTRAINT `FK_mri_protocol_checks_group_target_2` FOREIGN KEY (`ProjectID`)                REFERENCES `Project` (`ProjectID`),
     CONSTRAINT `FK_mri_protocol_checks_group_target_3` FOREIGN KEY (`SubprojectID`)             REFERENCES `subproject` (`SubprojectID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;

INSERT INTO `mri_protocol_checks_group_target` (`MriProtocolChecksGroupID`, `ProjectID`, `SubprojectID`, `Visit_label`)
    VALUES((SELECT MriProtocolChecksGroupID FROM mri_protocol_checks_group WHERE Name='Default MRI protocol checks group'), NULL, NULL, NULL);

-- -----------------------------------------------------------------
-- Addition of a new column in table mri_protocol to identify the
-- MRI protocol group that a given line is associated to
-- -----------------------------------------------------------------
ALTER TABLE `mri_protocol` ADD COLUMN `MriProtocolGroupID` INT(4) UNSIGNED NOT NULL;
UPDATE mri_protocol SET MriProtocolGroupID=(SELECT MriProtocolGroupID FROM mri_protocol_group WHERE Name='Default MRI protocol group');
ALTER TABLE `mri_protocol` ADD CONSTRAINT `FK_mri_protocol_group_ID_1` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`);

-- -----------------------------------------------------------------------
-- Addition of a new column in table mri_protocol_checks to identify the
-- MRI protocol group that a given line is associated to
-- -----------------------------------------------------------------------
ALTER TABLE `mri_protocol_checks` ADD COLUMN `MriProtocolChecksGroupID` INT(4) UNSIGNED NOT NULL;
UPDATE mri_protocol_checks SET MriProtocolChecksGroupID=(SELECT MriProtocolChecksGroupID FROM mri_protocol_checks_group WHERE Name='Default MRI protocol checks group');
ALTER TABLE `mri_protocol_checks` ADD CONSTRAINT `FK_mri_protocol_checks_group_ID_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`);

-- ----------------------------------------------------------------------------------
-- Addition of a new column in table mri_protocol_violated_scans to identify the
-- MRI protocol group that was used when trying to identify the scan type
-- ----------------------------------------------------------------------------------
ALTER TABLE `mri_protocol_violated_scans` ADD COLUMN `MriProtocolGroupID` INT(4) UNSIGNED NOT NULL;
UPDATE mri_protocol_violated_scans SET MriProtocolGroupID=(SELECT MriProtocolGroupID FROM mri_protocol_group WHERE Name='Default MRI protocol group');
ALTER TABLE `mri_protocol_violated_scans` ADD CONSTRAINT `FK_mri_violated_2` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`);

-- -----------------------------------------------------------------------------------
-- Addition of a new column in table mri_violations_log to identify the
-- group of MRI protocol checks that was used when performing the MRI protocol checks
-- -----------------------------------------------------------------------------------
ALTER TABLE `mri_violations_log` ADD COLUMN `MriProtocolChecksGroupID` INT(4) UNSIGNED NOT NULL;
UPDATE mri_violations_log SET MriProtocolChecksGroupID=(SELECT MriProtocolChecksGroupID FROM mri_protocol_checks_group WHERE Name='Default MRI protocol checks group');
ALTER TABLE `mri_violations_log` ADD CONSTRAINT `FK_mri_checks_group_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`);

