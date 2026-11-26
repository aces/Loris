-- Add column to track associated channel names
ALTER TABLE physiological_task_event ADD COLUMN `Channel` TEXT DEFAULT NULL;

-- Create parameter_project table to track parameters and channel delimiter
CREATE TABLE `parameter_project` (
   `ParameterProjectID` int(10) unsigned NOT NULL auto_increment,
   `ProjectID` int(10) unsigned NOT NULL default '0',
   `ParameterTypeID` int(10) unsigned NOT NULL default '0',
   `Value` text default NULL,
   `InsertTime` int(10) unsigned NOT NULL default '0',
   PRIMARY KEY  (`ParameterProjectID`),
   UNIQUE KEY `project_type` (`ProjectID`,`ParameterTypeID`),
   KEY `parameter_value` (`ParameterTypeID`,`Value`(64)),
   CONSTRAINT `FK_parameter_project_2` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`),
   CONSTRAINT `FK_parameter_project_1` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT IGNORE INTO `parameter_type_category` (Name, Type)
VALUES ('Project Parameters', 'Metavars');

-- Add channel delimiter, taken from events.json to DB
INSERT IGNORE INTO parameter_type (Name, Type, Description, SourceFrom, Queryable, IsFile) VALUES
  ('ChannelDelimiter', 'text', 'Channel name separator', 'parameter_project', 1, 0);

INSERT INTO parameter_type_category_rel (ParameterTypeID, ParameterTypeCategoryID)
SELECT pt.ParameterTypeID, ptc.ParameterTypeCategoryID
FROM parameter_type pt, parameter_type_category ptc
WHERE ptc.Name='Project Parameters' AND pt.Name IN ('ChannelDelimiter');


