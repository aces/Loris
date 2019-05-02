ALTER TABLE project_rel DROP PRIMARY KEY, ADD COLUMN `ProjectSubprojectID` int(10) unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT FIRST;
ALTER TABLE project_rel ADD CONSTRAINT UK_project_rel_ProjectID_SubprojectID UNIQUE KEY (ProjectID, SubprojectID);

CREATE TABLE `visit` (
  `VisitID` int(10) unsigned NOT NULL auto_increment,
  `VisitName` varchar(100) NOT NULL,
  CONSTRAINT `PK_visit` PRIMARY KEY (`VisitID`),
  CONSTRAINT `UK_visit_name` UNIQUE KEY (`VisitName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `visit_project_subproject_rel` (
  `VisitProjectSubprojectID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `VisitID` int(10) unsigned NOT NULL,
  `ProjectSubprojectID` int(10) unsigned NOT NULL,
  CONSTRAINT PK_visit_project_subproject_rel PRIMARY KEY (`VisitProjectSubprojectID`),
  CONSTRAINT UK_visit_project_subproject_rel_VisitID_ProjectSubprojectID UNIQUE KEY (`VisitID`, `ProjectSubprojectID`),
  CONSTRAINT FK_visit_project_subproject_rel_VisitID FOREIGN KEY (`VisitID`)
    REFERENCES `visit`(`VisitID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FK_visit_project_subproject_rel_ProjectSubprojectID FOREIGN KEY (`ProjectSubprojectID`)
    REFERENCES `project_rel`(`ProjectSubprojectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO visit (SELECT ID, Visit_label FROM Visit_Windows);
INSERT IGNORE INTO visit (SELECT null, Visit_label FROM session WHERE Visit_label NOT IN (SELECT VisitName FROM visit));

-- add visit from config.xml