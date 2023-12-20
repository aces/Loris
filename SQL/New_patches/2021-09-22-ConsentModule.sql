-- Create module
INSERT INTO modules (Name, Active) VALUES ('consent', 'Y');

-- Table for display information
-- Can contain basic display info, or more complex
-- training form
CREATE TABLE `consent_display` (
  `ConsentDisplayID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Title` text DEFAULT NULL,
  `Media` text DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `training` text DEFAULT NULL,
  `Reset_period_days` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`ConsentDisplayID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- direct_consent contains all info relevant to the eConsent
-- form unique to each participant, but does not include the
-- consent status given
CREATE TABLE `direct_consent` (
  `CandidateID` int(6) NOT NULL,
  `ConsentGroupID` integer unsigned NOT NULL,
  `OneTimeKey` varchar(16) DEFAULT NULL,
  `Request_status` enum('created','sent','in_progress','complete','expired') NOT NULL DEFAULT 'created',
  `Date_sent` date DEFAULT NULL,
  `Data_cleared` tinyint(1) DEFAULT NULL,
  `trainingProgress` varchar(255) DEFAULT NULL,
  KEY `direct_consent_cand_ConsentGroupID` (`CandidateID`,`ConsentGroupID`),
  CONSTRAINT `FK_direct_consent_1` FOREIGN KEY (`CandidateID`) REFERENCES `candidate` (`CandID`),
  CONSTRAINT `FK_direct_consent_2` FOREIGN KEY (`ConsentGroupID`) REFERENCES `consent_group` (`ConsentGroupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Relates different sites and consent groups to their 
-- respective displays
CREATE TABLE `consent_display_rel` (
  `ConsentGroupID` int(10) unsigned NOT NULL,
  `CenterID` int(10) unsigned DEFAULT NULL,
  `ConsentDisplayID` int(10) unsigned NOT NULL,
  CONSTRAINT `FK_consent_group_consent_display_rel_1` FOREIGN KEY (`ConsentGroupID`) REFERENCES `consent_group` (`ConsentGroupID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_psc_consent_display_rel_1` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_consent_display_consent_display_rel_1` FOREIGN KEY (`ConsentDisplayID`) REFERENCES `consent_display` (`ConsentDisplayID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Add permissions for view + edit
INSERT INTO permissions (code, description, moduleID, action, categoryID) VALUES
  ('consent_view', 'View consent module', (SELECT ID FROM modules WHERE Name='consent'),'View','2'),
  ('consent_edit', 'Edit consent module', (SELECT ID FROM modules WHERE Name='consent'),'Edit','2');

-- Switch DateGiven / DateWithdrawn to datetimes instead of date
-- Allows for timestamp of consent given by participant
ALTER TABLE candidate_consent_rel
MODIFY COLUMN DateGiven datetime DEFAULT NULL,
MODIFY COLUMN DateWithdrawn datetime DEFAULT NULL;
