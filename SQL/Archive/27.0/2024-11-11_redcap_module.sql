
-- --------------------------------------------------------------
-- redcap module

INSERT IGNORE INTO modules (Name, Active) VALUES ('redcap', 'N');

-- --------------------------------------------------------------
-- redcap notifications table

CREATE TABLE `redcap_notification` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `complete` char(1) NOT NULL,
  `project_id` varchar(50) NOT NULL,
  `record` varchar(20) NOT NULL COMMENT 'PSCID',
  `redcap_event_name` varchar(50) NOT NULL COMMENT 'Visit_label',
  `instrument` varchar(150) NOT NULL COMMENT 'Test_name',
  `username` varchar(100) NOT NULL,
  `redcap_url` varchar(255) NOT NULL,
  `project_url` varchar(255) NOT NULL,
  `received_dt` datetime NOT NULL,
  `handled_dt` datetime NULL,
  PRIMARY KEY (`id`),
  KEY `i_redcap_notif_received_dt` (`received_dt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------------
-- redcap examiner

INSERT INTO examiners (full_name) VALUES ('REDCap');
INSERT IGNORE INTO examiners_psc_rel (examinerID, centerID, active, pending_approval)
    SELECT e.examinerID, p.CenterID, "Y", "N" from psc p JOIN examiners e WHERE e.Full_name = "REDCap";

-- --------------------------------------------------------------
-- redcap importable instrument list in config module

INSERT IGNORE INTO ConfigSettings (Name, Description, Visible, Label, OrderNumber)
  SELECT 'redcap', 'Settings related to REDCap interoperability', 1, 'REDCap', MAX(OrderNumber) + 1
  FROM ConfigSettings
  WHERE Parent IS NULL;

-- add a main assignee to all redcap created issue

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
  SELECT
    'redcap_issue_assignee',
    'REDCap main issue assignee in issue tracker',
    1,
    0,
    'text',
    parent_config.ID,
    'Main issue assignee',
    COALESCE(MAX(child_config.OrderNumber), 0) +1
  FROM ConfigSettings parent_config
    LEFT JOIN ConfigSettings child_config ON (parent_config.ID = child_config.Parent)
  WHERE parent_config.Name = 'redcap';

-- instruments must be added to this list before they can be imported, else they wil be ignored.

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
  SELECT
    'redcap_importable_instrument',
    'REDCap instrument names from which data should be imported in LORIS',
    1,
    1,
    'text',
    parent_config.ID,
    'Importable instrument names',
    COALESCE(MAX(child_config.OrderNumber), 0) +1
  FROM ConfigSettings parent_config
  LEFT JOIN ConfigSettings child_config ON (parent_config.ID = child_config.Parent)
  WHERE parent_config.Name = 'redcap';