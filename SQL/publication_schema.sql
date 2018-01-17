-- Main table
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS publication;
CREATE TABLE `publication` (
    `PublicationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PublicationStatusID` int(2) unsigned NOT NULL DEFAULT 1,
    `DateProposed` date NOT NULL,
    `DateRated` date default NULL,
    `Title` varchar(255) NOT NULL,
    `LeadInvestigator` varchar(255) NOT NULL,
    `LeadInvestigatorEmail` varchar(255) NOT NULL,
    `RatedBy` varchar(255) default NULL,
    `RejectedReason` varchar(255) default NULL,
    `Description` text NOT NULL,
    PRIMARY KEY(`PublicationID`),
    CONSTRAINT `FK_publication_1` FOREIGN KEY(`Rated_by`) REFERENCES `users` (`UserID`)
    CONSTRAINT `FK_publication_2` FOREIGN KEY(`PublicationStatusID`) REFERENCES `publication_status` (`PublicationStatusID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Publication Status
DROP TABLE IF EXISTS publication_status;
CREATE TABLE `publication_status` (
  `PublicationStatusID` int(2) unsigned NOT NULL,
  `Label` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET='utf8mb4';

INSERT INTO publication_status (1, 'Pending');
INSERT INTO publication_status (2, 'Approved');
INSERT INTO publication_status (3, 'Rejected');

-- Separate table for Keywords
DROP TABLE IF EXISTS publication_keyword;
CREATE TABLE `publication_keyword` (
  `KeywordID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  PRIMARY KEY(`KeywordID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8mb4';

-- Publication - Keyword relational table
DROP TABLE IF EXISTS publication_keyword_rel;
CREATE TABLE `publication_keyword_rel` (
  `PublicationID` int(10) unsigned NOT NULL,
  `KeywordID` int(10) unsigned NOT NULL,
  CONSTRAINT `FK_publication_keyword_1` FOREIGN KEY(`PublicationID`) REFERENCES `publication` (`PublicationID`),
  CONSTRAINT `FK_publication_keyword_2` FOREIGN KEY(`KeywordID`) REFERENCES `publication_keyword` (`KeywordID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8mb4';

-- Publication - Variable of Interest  relational table
DROP TABLE IF EXISTS publication_parameter_type_rel;
CREATE TABLE `publication_parameter_type_rel` (
    `PublicationID` int(10) unsigned NOT NULL,
    `ParameterTypeID` int(10) unsigned NOT NULL,
    CONSTRAINT `FK_publication_parameter_type_rel_1` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`),
    CONSTRAINT `FK_publication_parameter_type_rel_2` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8mb4';

-- Publication Uploads
DROP TABLE IF EXISTS publication_upload;
CREATE TABLE `publication_upload` (
    `PublicationUploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PublicationID` int(10) unsigned NOT NULL,
    `PublicationUploadTypeID` int(2) unsigned NOT NULL,
    `Citation` varchar(255) NOT NULL,
    `URL` varchar(255) NOT NULL,
    `Version` varchar(255) NOT NULL,
    PRIMARY KEY (`PublicationUploadID`),
    CONSTRAINT `FK_publication_upload_1` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8mb4';

DROP TABLE IF EXISTS publication_upload_type;
CREATE TABLE `publication_upload_type` (
  `PublicationUploadTypeID` int(2) unsigned NOT NULL,
  `Label` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET='utf8mb4';

INSERT INTO publication_upload_type (1, 'Paper');
INSERT INTO publication_upload_type (2, 'Poster');
INSERT INTO publication_upload_type (3, 'Presentation');
INSERT INTO publication_upload_type (4, 'Other');

SET FOREIGN_KEY_CHECKS=1;

DELETE FROM LorisMenu WHERE Label='Publication';
INSERT INTO LorisMenu (Parent, Label, Link) VALUES (4, 'Publication', 'publication/');