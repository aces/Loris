-- adds the redcap_ui_view permission
INSERT INTO permissions (code, description, moduleID, categoryID)
    VALUES (
        'redcap_ui_view',
        'REDCap GUI - View',
        (SELECT ID FROM modules WHERE Name ='redcap'),
        (SELECT ID FROM permissions_category WHERE Description = 'Permission')
    );

INSERT INTO perm_perm_action_rel (permID, actionID)
    VALUES (
        (SELECT permID FROM permissions WHERE code = 'redcap_ui_view'),
        (SELECT ID FROM permisssions_action WHERE name = 'View')
    );

-- adds the redcap dictionary table
CREATE TABLE `redcap_dictionary` (
    ID int(10) unsigned NOT NULL auto_increment,
    InstrumentName varchar(255),
    FieldName varchar(255) NOT NULL,
    FieldRequired boolean NOT NULL,
    FieldType varchar(20) NOT NULL,
    FieldLabel text NOT NULL,
    SectionHeader text,
    Choices text,
    FieldNote text,
    TextValidationType varchar(50),
    TextValidationMin varchar(50),
    TextValidationMax varchar(50),
    Identifier text,
    BranchingLogic text,
    CustomAlignment varchar(10),
    QuestionNumber text,
    MatrixGroupName varchar(100),
    MatrixRanking varchar(50),
    FieldAnnotation text,
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='All REDCap instrument fields and variables';