CREATE TABLE IF NOT EXISTS `violations_resolved` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `hash` varchar(255) NOT NULL,
  `ExtID` bigint(20) NOT NULL,
  `TypeTable` varchar(255) DEFAULT NULL,
  `User` varchar(255) DEFAULT NULL,
  `ChangeDate` datetime DEFAULT NULL,
  `Resolved` enum('unresolved', 'reran', 'emailed', 'inserted', 'rejected', 'inserted_flag', 'other') DEFAULT 'unresolved',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE subproject (
    SubprojectID int(10) unsigned NOT NULL auto_increment,
    title varchar(255) NOT NULL,
    useEDC boolean,
    WindowDifference enum('optimal', 'battery'),
    PRIMARY KEY (SubprojectID)
);

ALTER TABLE tarchive_series ADD Modality ENUM ('MR', 'PT') default NULL;
UPDATE LorisMenu SET Label='Imaging Uploader', Link='main.php?test_name=imaging_uploader' WHERE Link='main.php?test_name=mri_upload';
UPDATE feedback_mri_comment_types SET CommentName='Geometric distortion', CommentStatusField='a:2:{s:5:\"field\";s:20:\"Geometric_distortion\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}' WHERE CommentName='Geometric intensity';

UPDATE feedback_mri_comment_types SET CommentStatusField='a:2:{s:5:"field";s:18:"Intensity_artifact";s:6:"values";a:5:{i:0;s:0:"";i:1;s:4:"Good";i:2;s:4:"Fair";i:3;s:4:"Poor";i:4;s:12:"Unacceptable";}}' WHERE CommentName="Intensity artifact";

UPDATE feedback_mri_comment_types SET CommentStatusField='a:2:{s:5:\"field\";s:30:\"Movement_artifacts_within_scan\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:15:\"Slight Movement\";i:3;s:12:\"Poor Quality\";i:4;s:12:\"Unacceptable\";}}' WHERE CommentName="Movement artifact";

UPDATE feedback_mri_comment_types SET CommentStatusField='a:3:{s:5:\"field\";s:31:\"Movement_artifacts_between_scan\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:15:\"Slight Movement\";i:3;s:12:\"Poor Quality\";i:4;s:12:\"Unacceptable\";}}' WHERE CommentName="Packet movement artifact";
ALTER TABLE feedback_mri_comments DROP COLUMN MRIID, DROP COLUMN PatientName, DROP COLUMN CandID, DROP COLUMN VisitNo;
DELETE cu FROM conflicts_unresolved cu LEFT JOIN flag f ON (cu.CommentId1=f.CommentID) LEFT JOIN session s ON (f.SessionID=s.ID) WHERE s.Current_stage='Recycling Bin';
ALTER TABLE files DROP COLUMN ClassifyAlgorithm;
DELETE cu FROM conflicts_unresolved cu LEFT JOIN flag f ON (cu.CommentId1=f.CommentID) WHERE f.Data_entry='In Progress';
DELETE cu FROM conflicts_unresolved cu LEFT JOIN flag f ON (cu.CommentId2=f.CommentID) WHERE f.Data_entry='In Progress';
ALTER TABLE subproject ADD RecruitmentTarget int(10) unsigned;

CREATE TABLE `Project` (
    `ProjectID` INT(2) NOT NULL,
    `Name` VARCHAR(255) NULL,
    `recruitmentTarget` INT(6) Default NULL,
    PRIMARY KEY (`ProjectID`)
)ENGINE = InnoDB  DEFAULT CHARSET=utf8;
DROP TABLE IF EXISTS `feedback_bvl_types_site`;

update parameter_type SET Name='Geometric_distortion' WHERE Name='Geometric_intensity';
UPDATE permissions SET code='imaging_uploader', description='Imaging Uploader' WHERE code='mri_upload';
UPDATE help SET hash=md5('imaging_uploader') WHERE topic='Imaging Uploader';
ALTER TABLE `Project` CHANGE COLUMN `ProjectID` `ProjectID` INT(2) NOT NULL AUTO_INCREMENT;
