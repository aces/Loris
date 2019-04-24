-- Publication Status
CREATE TABLE `publication_status` (
  `PublicationStatusID` int(2) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  CONSTRAINT `PK_publication_status` PRIMARY KEY(`PublicationStatusID`),
  CONSTRAINT `UK_publication_status_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';
INSERT INTO publication_status (`Label`) VALUES ('Pending');
INSERT INTO publication_status (`Label`) VALUES ('Approved');
INSERT INTO publication_status (`Label`) VALUES ('Rejected');

CREATE TABLE `publication_collaborator` (
  `PublicationCollaboratorID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255),
  CONSTRAINT `PK_publication_collaborator` PRIMARY KEY(`PublicationCollaboratorID`),
  CONSTRAINT `UK_publication_collaborator_Email` UNIQUE (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Main table
CREATE TABLE `publication` (
    `PublicationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PublicationStatusID` int(2) unsigned NOT NULL default 1,
    `LeadInvestigatorID` int(10) unsigned NOT NULL,
    `UserID` int(10) unsigned NOT NULL,
    `RatedBy` int(10) unsigned,
    `DateProposed` date NOT NULL,
    `DateRated` date default NULL,
    `Title` varchar(255) NOT NULL,
    `RejectedReason` varchar(255) default NULL,
    `Description` text NOT NULL,
    CONSTRAINT `PK_publication` PRIMARY KEY(`PublicationID`),
    CONSTRAINT `FK_publication_UserID` FOREIGN KEY(`UserID`) REFERENCES `users` (`ID`),
    CONSTRAINT `FK_publication_RatedBy` FOREIGN KEY(`RatedBy`) REFERENCES `users` (`ID`),
    CONSTRAINT `FK_publication_PublicationStatusID` FOREIGN KEY(`PublicationStatusID`) REFERENCES `publication_status` (`PublicationStatusID`),
    CONSTRAINT `FK_publication_LeadInvestigatorID` FOREIGN KEY(`LeadInvestigatorID`) REFERENCES `publication_collaborator` (`PublicationCollaboratorID`),
    CONSTRAINT `UK_publication_Title` UNIQUE (`Title`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Separate table for Keywords
CREATE TABLE `publication_keyword` (
  `PublicationKeywordID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  CONSTRAINT `PK_publication_keyword` PRIMARY KEY(`PublicationKeywordID`),
  CONSTRAINT `UK_publication_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Publication - Keyword relational table
CREATE TABLE `publication_keyword_rel` (
  `PublicationID` int(10) unsigned NOT NULL,
  `PublicationKeywordID` int(10) unsigned NOT NULL,
  CONSTRAINT `PK_publication_keyword_rel` PRIMARY KEY(PublicationID, PublicationKeywordID),
  CONSTRAINT `FK_publication_keyword_PublicationID` FOREIGN KEY(`PublicationID`) REFERENCES `publication` (`PublicationID`),
  CONSTRAINT `FK_publication_keyword_PublicationKeywordID` FOREIGN KEY(`PublicationKeywordID`) REFERENCES `publication_keyword` (`PublicationKeywordID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

CREATE TABLE `publication_collaborator_rel` (
  `PublicationID` int(10) unsigned NOT NULL,
  `PublicationCollaboratorID` int(10) unsigned NOT NULL,
  CONSTRAINT `PK_publication_collaborator_rel` PRIMARY KEY(PublicationID, PublicationCollaboratorID),
  CONSTRAINT `FK_publication_collaborator_rel_PublicationID` FOREIGN KEY(`PublicationID`) REFERENCES `publication` (`PublicationID`),
  CONSTRAINT `FK_publication_collaborator_rel_PublicationCollaboratorID` FOREIGN KEY(`PublicationCollaboratorID`) REFERENCES `publication_collaborator` (`PublicationCollaboratorID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Publication - Variable of Interest  relational table
CREATE TABLE `publication_parameter_type_rel` (
    `PublicationID` int(10) unsigned NOT NULL,
    `ParameterTypeID` int(10) unsigned NOT NULL,
    CONSTRAINT `PK_publication_parameter_type_rel` PRIMARY KEY (PublicationID, ParameterTypeID),
    CONSTRAINT `FK_publication_parameter_type_rel_PublicationID` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`),
    CONSTRAINT `FK_publication_parameter_type_rel_ParameterTypeID` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

CREATE TABLE `publication_test_names_rel` (
    `PublicationID` int(10) unsigned NOT NULL,
    `TestNameID` int(10) unsigned NOT NULL,
    CONSTRAINT `PK_publication_test_names_rel` PRIMARY KEY(`PublicationID`, `TestNameID`),
    CONSTRAINT `FK_publication_test_names_rel_PublicationID` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`),
    CONSTRAINT `FK_publication_test_names_rel_TestNameID` FOREIGN KEY (`TestNameID`) REFERENCES `test_names` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8mb4';

-- Publication Uploads
CREATE TABLE `publication_upload_type` (
  `PublicationUploadTypeID` int(2) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  CONSTRAINT `PK_publication_upload_type` PRIMARY KEY (`PublicationUploadTypeID`),
  CONSTRAINT `UK_publication_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

INSERT INTO publication_upload_type (`Label`) VALUES ('Paper');
INSERT INTO publication_upload_type (`Label`) VALUES ('Poster');
INSERT INTO publication_upload_type (`Label`) VALUES ('Presentation');
INSERT INTO publication_upload_type (`Label`) VALUES ('Other');

CREATE TABLE `publication_upload` (
    `PublicationUploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PublicationID` int(10) unsigned NOT NULL,
    `PublicationUploadTypeID` int(2) unsigned NOT NULL,
    `Filename` varchar(255) NOT NULL,
    `Version` varchar(255),
    `Citation` text,
    CONSTRAINT `PK_publication_upload` PRIMARY KEY (`PublicationUploadID`),
    CONSTRAINT `UK_publication_upload_Filename` UNIQUE (Filename),
    CONSTRAINT `FK_publication_upload_PublicationID` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`),
    CONSTRAINT `FK_publication_upload_PublicationUploadTypeID` FOREIGN KEY (`PublicationUploadTypeID`) REFERENCES `publication_upload_type` (`PublicationUploadTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

CREATE TABLE `publication_users_edit_perm_rel` (
  `PublicationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `UserID` int(10) unsigned NOT NULL,
  CONSTRAINT `FK_publication_users_edit_perm_rel_PublicationID` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`),
  CONSTRAINT `FK_publication_users_edit_perm_rel_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

SET @reportsTab = (SELECT ID FROM LorisMenu WHERE Label='Reports');
SET @orderNum = (SELECT MAX(OrderNumber) + 1 FROM LorisMenu WHERE Parent=@reportsTab);
INSERT INTO LorisMenu (Parent, Label, Link, OrderNumber) VALUES (@reportsTab, 'Publications', 'publication/', @orderNum);
INSERT INTO permissions (code, description, categoryID) VALUES ('publication_view', 'Publication - Access to module', 2);
INSERT INTO permissions (code, description, categoryID) VALUES ('publication_propose', 'Publication - Propose a project', 2);
INSERT INTO permissions (code, description, categoryID) VALUES ('publication_approve', 'Publication - Approve or reject proposed publication projects', 2);
INSERT INTO LorisMenuPermissions (MenuID, PermID) VALUES ((SELECT ID FROM LorisMenu WHERE Label='Publications'), (SELECT permID FROM permissions WHERE code='publication_view'));
INSERT INTO LorisMenuPermissions (MenuID, PermID) VALUES ((SELECT ID FROM LorisMenu WHERE Label='Publications'), (SELECT permID FROM permissions WHERE code='publication_propose'));
INSERT INTO LorisMenuPermissions (MenuID, PermID) VALUES ((SELECT ID FROM LorisMenu WHERE Label='Publications'), (SELECT permID FROM permissions WHERE code='publication_approve'));
INSERT INTO user_perm_rel (userID, permID) VALUES(1, (SELECT permID FROM permissions WHERE code='publication_approve'));
INSERT INTO user_perm_rel (userID, permID) VALUES(1, (SELECT permID FROM permissions WHERE code='publication_view'));
INSERT INTO user_perm_rel (userID, permID) VALUES(1, (SELECT permID FROM permissions WHERE code='publication_propose'));

INSERT INTO notification_modules (module_name, operation_type, template_file, description) VALUES ('publication', 'submission', 'notifier_publication_submission.tpl', 'Publication: Submission Received');
INSERT INTO notification_modules (module_name, operation_type, template_file, description) VALUES ('publication', 'review', 'notifier_publication_review.tpl', 'Publication: Proposal has been reviewed');
INSERT INTO notification_modules (module_name, operation_type, template_file, description) VALUES ('publication', 'edit', 'notifier_publication_edit.tpl', 'Publication: Proposal has been edited');

INSERT INTO notification_modules_services_rel (module_id, service_id) VALUES (
  (SELECT id FROM notification_modules WHERE module_name='publication' AND operation_type='submission'),
  (SELECT id FROM notification_services WHERE service='email_text')
);
INSERT INTO notification_modules_services_rel (module_id, service_id) VALUES (
  (SELECT id FROM notification_modules WHERE module_name='publication' AND operation_type='review'),
  (SELECT id FROM notification_services WHERE service='email_text')
);
INSERT INTO notification_modules_services_rel (module_id, service_id) VALUES (
  (SELECT id FROM notification_modules WHERE module_name='publication' AND operation_type='edit'),
  (SELECT id FROM notification_services WHERE service='email_text')
);

SET @pathID = (SELECT ID FROM ConfigSettings WHERE Name='paths');
SET @order  = (SELECT MAX(OrderNumber) + 1 FROM ConfigSettings WHERE Parent=@pathID);
INSERT INTO ConfigSettings (Name, Description, Visible, Parent, Label, DataType, OrderNumber) VALUES ('publication_uploads', 'Path to uploaded publications', 1, @pathID, 'Publications', 'text', @order + 1);
INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='publication_uploads'), '/data/publication_uploads/');

INSERT INTO ConfigSettings (Name, Description, Visible, Parent, Label, DataType, OrderNumber) VALUES ('publication_deletions', 'Path to deleted publications', 1, @pathID, 'Deleted Publications', 'text', @order + 1);
INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='publication_deletions'), '/data/publication_uploads/to_be_deleted/');
