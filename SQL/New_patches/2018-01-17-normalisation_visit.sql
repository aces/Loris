CREATE TABLE `visit` (
  `VisitID` int(10) unsigned NOT NULL auto_increment,
  `VisitName` varchar(100) NOT NULL,
  CONSTRAINT `PK_visit` PRIMARY KEY (`VisitID`),
  CONSTRAINT `UK_visit_name` UNIQUE KEY (`VisitName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `visit_subproject_rel` (
  `VisitID` int(10) unsigned NOT NULL,
  `SubprojectID` int(10) unsigned NOT NULL,
  CONSTRAINT PK_visit_subproject_rel PRIMARY KEY (`VisitID`, `SubprojectID`),
  CONSTRAINT FK_visit_subproject_rel_VisitID FOREIGN KEY (`VisitID`)
    REFERENCES `visit`(`VisitID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FK_visit_subproject_rel_SubprojectID FOREIGN KEY (`SubprojectID`)
    REFERENCES `subproject`(`SubprojectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO visit (SELECT ID, Visit_label FROM Visit_Windows);
INSERT IGNORE INTO visit (SELECT null, Visit_label FROM session WHERE Visit_label NOT IN (SELECT VisitName FROM visit));

-- add visit from config.xml
