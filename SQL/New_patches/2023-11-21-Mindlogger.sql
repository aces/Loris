-- Enable Mindlogger module
INSERT INTO modules (Name, Active)
VALUES ('mindlogger', 'Y');


-- Add Mindlogger module permissions
INSERT INTO `permissions` (code, description, moduleID, action, categoryID)
VALUES ('mindlogger_schema_create', 'Mindlogger applet schemas and instruments thru API',
        (SELECT ID FROM modules WHERE Name = 'mindlogger'), 'Create', 2);


-- Create Mindlogger schema table
CREATE TABLE `instrument_mindlogger_schema`
(
    `AppletID`     varchar(36) NOT NULL,
    `AppletSchema` text        NOT NULL,
    `CreatedDate`  timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedDate`  timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (AppletId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Add Mindlogger instruments subgroup
INSERT INTO test_subgroups (Subgroup_name)
VALUES ('Mindlogger instruments');

