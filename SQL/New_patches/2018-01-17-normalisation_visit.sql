ALTER TABLE project_rel DROP PRIMARY KEY, ADD COLUMN `ProjectSubprojectRelID` int(10) unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT FIRST;
ALTER TABLE project_rel ADD CONSTRAINT UK_project_rel_ProjectID_SubprojectID UNIQUE KEY (ProjectID, SubprojectID);

CREATE TABLE `visit` (
  `VisitID` int(10) unsigned NOT NULL auto_increment,
  `VisitName` varchar(100) NOT NULL,
  CONSTRAINT `PK_visit` PRIMARY KEY (`VisitID`),
  CONSTRAINT `UK_visit_name` UNIQUE KEY (`VisitName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `visit_project_subproject_rel` (
  `VisitProjectSubprojectRelID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `VisitID` int(10) unsigned NOT NULL,
  `ProjectSubprojectRelID` int(10) unsigned NOT NULL,
  CONSTRAINT PK_visit_project_subproject_rel PRIMARY KEY (`VisitProjectSubprojectRelID`),
  CONSTRAINT UK_visit_project_subproject_rel_VisitID_ProjectSubprojectRelID UNIQUE KEY (`VisitID`, `ProjectSubprojectRelID`),
  CONSTRAINT FK_visit_project_subproject_rel_VisitID FOREIGN KEY (`VisitID`)
    REFERENCES `visit`(`VisitID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FK_visit_project_subproject_rel_ProjectSubprojectRelID FOREIGN KEY (`ProjectSubprojectRelID`)
    REFERENCES `project_rel`(`ProjectSubprojectRelID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO visit (SELECT ID, Visit_label FROM Visit_Windows);
INSERT IGNORE INTO visit (SELECT null, Visit_label FROM session WHERE Visit_label NOT IN (SELECT VisitName FROM visit));

-- add visit from config.xml