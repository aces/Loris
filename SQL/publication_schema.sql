-- Main table
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS publications;
CREATE TABLE `publications` (
    `PublicationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `Title` varchar(255) NOT NULL,
    `Description` text NOT NULL,
    `Lead_investigator` varchar(255) NOT NULL,
    `Lead_investigator_email` varchar(255),
    `Date_proposed` date NOT NULL,
    `Approval_status` enum('Approved','Pending','Rejected') NOT NULL default 'Pending',
    `Rated_by` varchar(255) default NULL,
    `Date_rated` date default NULL,
    `Rejected_reason` varchar(255),
    PRIMARY KEY(`PublicationID`),
    CONSTRAINT `FK_publications_1` FOREIGN KEY(`Rated_by`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Separate table for Keywords
DROP TABLE IF EXISTS publication_keywords;
CREATE TABLE `publication_keywords` (
  `KeywordID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  PRIMARY KEY(`KeywordID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Publication - Keyword relational table
DROP TABLE IF EXISTS publications_keywords_rel;
CREATE TABLE `publications_keywords_rel` (
  `PublicationID` int(10) unsigned NOT NULL,
  `KeywordID` int(10) unsigned NOT NULL,
  CONSTRAINT `FK_publications_keywords_1` FOREIGN KEY(`PublicationID`) REFERENCES `publications` (`PublicationID`),
  CONSTRAINT `FK_publications_keywords_2` FOREIGN KEY(`KeywordID`) REFERENCES `publication_keywords` (`KeywordID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Publication - Variable of Interest  relational table
DROP TABLE IF EXISTS publications_parameter_type_rel;
CREATE TABLE `publications_parameter_type_rel` (
    `PublicationID` int(10) unsigned NOT NULL,
    `ParameterTypeID` int(10) unsigned NOT NULL,
    CONSTRAINT `FK_publications_parameter_type_rel_1` FOREIGN KEY (`PublicationID`) REFERENCES `publications` (`PublicationID`),
    CONSTRAINT `FK_publications_parameter_type_rel_2` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Publication Uploads
DROP TABLE IF EXISTS publications_media;
CREATE TABLE `publications_media` (
    `PublicationMediaID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PublicationID` int(10) unsigned NOT NULL,
    `Type` enum('Paper', 'Poster', 'Presentation', 'Other') NOT NULL,
    `Citation` varchar(255) NOT NULL,
    `URL` varchar(255) NOT NULL,
    `Version` varchar(255) NOT NULL,
    PRIMARY KEY (`PublicationMediaID`),
    CONSTRAINT `FK_publications_media_1` FOREIGN KEY (`PublicationID`) REFERENCES `publications` (`PublicationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SET FOREIGN_KEY_CHECKS=1;

DELETE FROM LorisMenu WHERE Label='Publications';
INSERT INTO LorisMenu (Parent, Label, Link) VALUES (4, 'Publications', 'publications/');