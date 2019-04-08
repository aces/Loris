CREATE TABLE `visit` (
  `VisitID` int(10) unsigned NOT NULL auto_increment,
  `VisitName` varchar(100) NOT NULL,
  CONSTRAINT `visit_PK` PRIMARY KEY (`VisitID`),
  CONSTRAINT `visit_name_UK` UNIQUE KEY (`VisitName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `visit_project_subproject_rel` (
  `VisitID` int(10) unsigned NOT NULL,
  `ProjectID` int(2) NOT NULL,
  `SubprojectID` int(10) unsigned NOT NULL,
  CONSTRAINT visit_project_subproject_rel_PK PRIMARY KEY (`VisitID`, `ProjectID`, `SubprojectID`),
  CONSTRAINT visit_project_subproject_rel_VisitID_visit_VisitID_FK FOREIGN KEY (`VisitID`) 
    REFERENCES `visit`(`VisitID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT visit_project_subproject_ProjectID_visit_ProjectID_FK FOREIGN KEY (`ProjectID`)
    REFERENCES `Project`(`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT visit_project_subproject_SubprojectID_visit_SubprojectID_FK FOREIGN KEY (`SubprojectID`)
    REFERENCES `subproject`(`SubprojectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO visit (SELECT ID, Visit_label FROM Visit_Windows);
INSERT IGNORE INTO visit (SELECT null, Visit_label FROM session WHERE Visit_label NOT IN (SELECT VisitName FROM visit));

-- add visit from config.xml
