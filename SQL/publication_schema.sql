-- Main table
CREATE TABLE `publications` (
    `PublicationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `Title` varchar(255) NOT NULL,
    `Description` text NOT NULL,
    `Keywords` varchar(255),
    `Lead_investigator` varchar(255) NOT NULL,
    `Lead_investigator_email` varchar(255),
    `Date_proposed` date NOT NULL,
    `Approval_status` enum('Approved','Awaiting Approval','Rejected') NOT NULL default 'Pending',
    `Rated_by` varchar(255),
    `Date_rated` date,
    `Rejected_reason` varchar(255),
    PRIMARY KEY(`PublicationID`),
    CONSTRAINT `FK_publications_1` FOREIGN KEY(`Rated_by`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Separate table for Keywords
CREATE TABLE `publication_keywords` (
  `KeywordID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Publication - Keyword relational table
CREATE TABLE `publications_keywords_rel` (
  `PublicationID` int(10) unsigned NOT NULL,
  `KeywordID` int(10) unsigned NOT NULL,
  CONSTRAINT `FK_publications_keywords_1` FOREIGN KEY(`PublicationID`) REFERENCES `publications` (`PublicationID`),
  CONSTRAINT `FK_publications_keywords_2` FOREIGN KEY(`KeywordID`) REFERENCES `publication_keywords` (`KeywordID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Publication - Variable of Interest  relational table
CREATE TABLE `publications_parameter_type_rel` (
    `PublicationID` int(10) unsigned NOT NULL,
    `ParameterTypeID` int(10) unsigned NOT NULL,
    CONSTRAINT `FK_publications_parameter_type_rel_1` FOREIGN KEY (`PublicationID`) REFERENCES `publications` (`PublicationID`),
    CONSTRAINT `FK_publications_parameter_type_rel_2` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Publication Uploads
CREATE TABLE `publications_media` (
    `PublicationMediaID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PublicationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `Type` enum('Paper', 'Poster', 'Presentation', 'Other') NOT NULL,
    `Citation` varchar(255) NOT NULL,
    `URL` varchar(255) NOT NULL,
    `Version` varchar(255) NOT NULL,
    PRIMARY KEY (`PublicationMediaID`),
    CONSTRAINT `FK_publications_media_1` FOREIGN KEY (`PublicationID`) REFERENCES `publications` (`PublicationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;