-- RENAME mri_protocol_group to scan_type_identification_group and modify fields according to the new name

RENAME TABLE mri_protocol_group TO scan_type_parameter_group;

ALTER TABLE scan_type_parameter_group
    RENAME COLUMN MriProtocolGroupID TO ScanTypeParameterGroupID;
ALTER TABLE scan_type_parameter_group
    RENAME COLUMN Name TO ScanTypeParameterGroupName;



-- RENAME mri_protocol_group_target to scan_type_identification_group and
-- modify field and key names according to the new name

RENAME TABLE mri_protocol_group_target TO scan_type_parameter_group_target;

ALTER TABLE scan_type_parameter_group_target
    RENAME COLUMN MriProtocolGroupTargetID TO ScanTypeParameterGroupTargetID;

ALTER TABLE scan_type_parameter_group_target
    RENAME COLUMN MriProtocolGroupID TO ScanTypeParameterGroupID;

ALTER TABLE scan_type_parameter_group_target
    RENAME KEY `FK_mri_protocol_group_target_1` TO `FK_scan_type_parameter_group_target_1`;
ALTER TABLE scan_type_parameter_group_target
    RENAME KEY `FK_mri_protocol_group_target_2` TO `FK_scan_type_parameter_group_target_2`;
ALTER TABLE scan_type_parameter_group_target
    RENAME KEY `FK_mri_protocol_group_target_3` TO `FK_scan_type_parameter_group_target_3`;

ALTER TABLE scan_type_parameter_group_target
    DROP CONSTRAINT `FK_mri_protocol_group_target_1`;
ALTER TABLE scan_type_parameter_group_target
    ADD CONSTRAINT `FK_scan_type_parameter_group_target_1`
        FOREIGN KEY (`ScanTypeParameterGroupID`)
            REFERENCES `scan_type_parameter_group` (`ScanTypeParameterGroupID`);

ALTER TABLE scan_type_parameter_group_target
    DROP CONSTRAINT `FK_mri_protocol_group_target_2`;
ALTER TABLE scan_type_parameter_group_target
    ADD CONSTRAINT `FK_scan_type_parameter_group_target_2`
        FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`);

ALTER TABLE scan_type_parameter_group_target
    DROP CONSTRAINT `FK_mri_protocol_group_target_3`;
ALTER TABLE scan_type_parameter_group_target
    ADD CONSTRAINT `FK_scan_type_parameter_group_target_3`
        FOREIGN KEY (`SubprojectID`) REFERENCES `subproject` (`SubprojectID`);



-- Add ScannerID and CenterID to scan_type_identification_group_target

ALTER TABLE scan_type_parameter_group_target
    ADD COLUMN ScannerID INT(10) UNSIGNED DEFAULT NULL,
    ADD KEY `FK_scan_type_parameter_group_target_4` (`ScannerID`),
    ADD CONSTRAINT `FK_scan_type_parameter_group_target_4`
        FOREIGN KEY (`ScannerID`) REFERENCES `mri_scanner` (`ID`);

ALTER TABLE scan_type_parameter_group_target
    ADD COLUMN CenterID INT(10) UNSIGNED DEFAULT NULL,
    ADD KEY `FK_scan_type_parameter_group_target_5` (`CenterID`),
    ADD CONSTRAINT `FK_scan_type_parameter_group_target_5`
        FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`);


-- Create a new table that will be used instead of mri_protocol to identify a scan type

CREATE TABLE `scan_type_parameter` (
   `ScanTypeParameterID`      INT(11) UNSIGNED NOT NULL auto_increment,
   `ScanTypeParameterGroupID` INT(4)  UNSIGNED NOT NULL,
   `ScanType`   INT(10) UNSIGNED NOT NULL,
   `HeaderName` VARCHAR(255)  NOT NULL,
   `ValidMin`   DECIMAL(10,4) DEFAULT NULL,
   `ValidMax`   DECIMAL(10,4) DEFAULT NULL,
   `ValidRegex` VARCHAR(244)  DEFAULT NULL,
   PRIMARY KEY  (ScanTypeParameterID),
   KEY `FK_scan_type_parameter_group_ID_1` (`ScanTypeParameterGroupID`),
   CONSTRAINT FK_scan_type_parameter_group_ID_1
       FOREIGN KEY (ScanTypeParameterGroupID)
           REFERENCES scan_type_parameter_group (ScanTypeParameterGroupID)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8;


-- Create a new table that will be used instead of mri_protocol to identify a scan type
CREATE TABLE scan_type_identification_failure (
    `ScanTypeIdentificationFailureID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `ScanTypeParameterGroupID`        INT(4)  UNSIGNED DEFAULT NULL,
    `TarchiveID`      INT(11)        DEFAULT NULL,
    `CandID`          INT(6)         DEFAULT NULL,
    `PSCID`           VARCHAR(255)   DEFAULT NULL,
    `SeriesUID`       VARCHAR(64)    DEFAULT NULL,
    `TimeRun`         DATETIME       DEFAULT NULL,
    `ScanLocation`    VARCHAR(255)   DEFAULT NULL,
    `PatientName`     VARCHAR(255)   DEFAULT NULL,
    `HeaderName`      VARCHAR(255)   DEFAULT NULL,
    `Value`           VARCHAR(255)   DEFAULT NULL,
    PRIMARY KEY (`ScanTypeIdentificationFailureID`),
    KEY `TarchiveID` (`TarchiveID`),
    KEY `FK_scan_type_identification_failure_2` (`ScanTypeParameterGroupID`),
    CONSTRAINT `FK_scan_type_identification_failure_1`
        FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`),
    CONSTRAINT `FK_scan_type_identification_failure_2`
        FOREIGN KEY (`ScanTypeParameterGroupID`)
            REFERENCES `scan_type_parameter_group` (`ScanTypeParameterGroupID`)
) ENGINE=InnoDB AUTO_INCREMENT=1018 DEFAULT CHARSET=utf8mb4;
