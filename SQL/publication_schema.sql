SET FOREIGN_KEY_CHECKS=0;
-- Publication Status
DROP TABLE IF EXISTS publication_status;
CREATE TABLE `publication_status` (
  `PublicationStatusID` int(2) unsigned NOT NULL,
  `Label` varchar(255) NOT NULL,
  PRIMARY KEY(`PublicationStatusID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';
DELETE FROM publication_status;
INSERT INTO publication_status VALUES (1, 'Pending');
INSERT INTO publication_status VALUES (2, 'Approved');
INSERT INTO publication_status VALUES (3, 'Rejected');

-- Main table
DROP TABLE IF EXISTS publication;
CREATE TABLE `publication` (
    `PublicationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PublicationStatusID` int(2) unsigned NOT NULL default 1,
    `UserID` int(10) unsigned NOT NULL,
    `RatedBy` int(10) unsigned,
    `DateProposed` date NOT NULL,
    `DateRated` date default NULL,
    `Title` varchar(255) NOT NULL,
    `LeadInvestigator` varchar(255) NOT NULL,
    `LeadInvestigatorEmail` varchar(255) NOT NULL,
    `RejectedReason` varchar(255) default NULL,
    `Description` text NOT NULL,
    PRIMARY KEY(`PublicationID`),
    CONSTRAINT `FK_publication_1` FOREIGN KEY(`UserID`) REFERENCES `users` (`ID`),
    CONSTRAINT `FK_publication_2` FOREIGN KEY(`RatedBy`) REFERENCES `users` (`ID`),
    CONSTRAINT `FK_publication_3` FOREIGN KEY(`PublicationStatusID`) REFERENCES `publication_status` (`PublicationStatusID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Separate table for Keywords
DROP TABLE IF EXISTS publication_keyword;
CREATE TABLE `publication_keyword` (
  `PublicationKeywordID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  PRIMARY KEY(`PublicationKeywordID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Publication - Keyword relational table
DROP TABLE IF EXISTS publication_keyword_rel;
CREATE TABLE `publication_keyword_rel` (
  `PublicationID` int(10) unsigned NOT NULL,
  `PublicationKeywordID` int(10) unsigned NOT NULL,
  CONSTRAINT `FK_publication_keyword_1` FOREIGN KEY(`PublicationID`) REFERENCES `publication` (`PublicationID`),
  CONSTRAINT `FK_publication_keyword_2` FOREIGN KEY(`PublicationKeywordID`) REFERENCES `publication_keyword` (`PublicationKeywordID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


DROP TABLE IF EXISTS publication_collaborator;
CREATE TABLE `publication_collaborator` (
  `PublicationCollaboratorID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255),
  PRIMARY KEY(`PublicationCollaboratorID`),
  UNIQUE (`Name`,`Email`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

DROP TABLE IF EXISTS publication_collaborator_rel;
CREATE TABLE `publication_collaborator_rel` (
  `PublicationID` int(10) unsigned NOT NULL,
  `PublicationCollaboratorID` int(10) unsigned NOT NULL,
  CONSTRAINT `FK_publication_collaborator_1` FOREIGN KEY(`PublicationID`) REFERENCES `publication` (`PublicationID`),
  CONSTRAINT `FK_publication_collaborator_2` FOREIGN KEY(`PublicationCollaboratorID`) REFERENCES `publication_collaborator` (`PublicationCollaboratorID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Publication - Variable of Interest  relational table
DROP TABLE IF EXISTS publication_parameter_type_rel;
CREATE TABLE `publication_parameter_type_rel` (
    `PublicationID` int(10) unsigned NOT NULL,
    `ParameterTypeID` int(10) unsigned NOT NULL,
    CONSTRAINT `FK_publication_parameter_type_rel_1` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`),
    CONSTRAINT `FK_publication_parameter_type_rel_2` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Publication Uploads
DROP TABLE IF EXISTS publication_upload;
CREATE TABLE `publication_upload` (
    `PublicationUploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PublicationID` int(10) unsigned NOT NULL,
    `PublicationUploadTypeID` int(2) unsigned NOT NULL,
    `URL` varchar(255) NOT NULL,
    `Citation` varchar(255),
    `Version` varchar(255),
    PRIMARY KEY (`PublicationUploadID`),
    CONSTRAINT `FK_publication_upload_1` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

DROP TABLE IF EXISTS publication_upload_type;
CREATE TABLE `publication_upload_type` (
  `PublicationUploadTypeID` int(2) unsigned NOT NULL,
  `Label` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

DELETE FROM publication_upload_type;
INSERT INTO publication_upload_type VALUES (1, 'Paper');
INSERT INTO publication_upload_type VALUES (2, 'Poster');
INSERT INTO publication_upload_type VALUES (3, 'Presentation');
INSERT INTO publication_upload_type VALUES (4, 'Other');

SET FOREIGN_KEY_CHECKS=1;

DELETE FROM LorisMenu WHERE Label='Publication';
INSERT INTO LorisMenu (Parent, Label, Link) VALUES (32, 'Publications', 'publication/');
DELETE FROM user_perm_rel WHERE permID=(SELECT permID FROM permissions WHERE code='publication_approve');
DELETE FROM user_perm_rel WHERE permID=(SELECT permID FROM permissions WHERE code='publication_propose');
DELETE FROM user_perm_rel WHERE permID=(SELECT permID FROM permissions WHERE code='publication_view');
DELETE FROM permissions WHERE code='publication_view';
DELETE FROM permissions WHERE code='publication_propose';
DELETE FROM permissions WHERE code='publication_approve';
INSERT INTO permissions (code, description, categoryID) VALUES ('publication_view', 'Publication - Access to module', 2);
INSERT INTO permissions (code, description, categoryID) VALUES ('publication_propose', 'Publication - Propose a project', 2);
INSERT INTO permissions (code, description, categoryID) VALUES ('publication_approve', 'Publication - Approve or reject proposed publicaiton projects', 2);
INSERT INTO LorisMenuPermissions (MenuID, PermID) VALUES ((SELECT ID FROM LorisMenu WHERE Label='Publication'), (SELECT permID FROM permissions WHERE code='publication_view'));
INSERT INTO LorisMenuPermissions (MenuID, PermID) VALUES ((SELECT ID FROM LorisMenu WHERE Label='Publication'), (SELECT permID FROM permissions WHERE code='publication_propose'));
INSERT INTO LorisMenuPermissions (MenuID, PermID) VALUES ((SELECT ID FROM LorisMenu WHERE Label='Publication'), (SELECT permID FROM permissions WHERE code='publication_approve'));
INSERT INTO user_perm_rel (userID, permID) VALUES(1, (SELECT permID FROM permissions WHERE code='publication_approve'));
INSERT INTO user_perm_rel (userID, permID) VALUES(1, (SELECT permID FROM permissions WHERE code='publication_view'));
INSERT INTO user_perm_rel (userID, permID) VALUES(1, (SELECT permID FROM permissions WHERE code='publication_propose'));