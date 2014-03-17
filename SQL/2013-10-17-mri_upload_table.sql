CREATE TABLE `mri_upload` (
  `UploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FileType` enum('mnc','obj','xfm','xfmmnc','imp','vertstat','xml','txt') DEFAULT NULL,
  `UploadedBy` varchar(255) NOT NULL DEFAULT '',
  `UploadDate` DateTime DEFAULT NULL,
  `SourceLocation` varchar(255) NOT NULL DEFAULT '',
  `number_of_mincInserted` int(11) DEFAULT NULL,
  `number_of_mincCreated` int(11) DEFAULT NULL,
  `TarchiveID` int(11) DEFAULT NULL,
  `SessionID` int(10) unsigned DEFAULT NULL,
  `IsValidated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`UploadID`)
) ;

ALTER TABLE files ADD COLUMN `Caveat` tinyint(1) DEFAULT NULL;
ALTER TABLE files ADD COLUMN `TarchiveSource` int(11) DEFAULT NULL;
