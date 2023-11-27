-- Enable Mindlogger module
INSERT INTO modules (Name, Active)
VALUES ('mindlogger', 'Y');


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
INSERT INTO test_subgroups (Subgroup_name) VALUES ('Mindlogger instruments');
