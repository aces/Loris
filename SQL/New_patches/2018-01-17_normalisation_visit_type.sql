CREATE TABLE `visit` (
  `VisitID` int(10) unsigned NOT NULL auto_increment,
  `Label` varchar(255) NOT NULL,
  `LegacyLabel` varchar(255) DEFAULT NULL,
  CONSTRAINT visit_PK PRIMARY KEY (`VisitID`),
  CONSTRAINT visit_legacy_label_UK UNIQUE KEY (`LegacyLabel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `visit_project_subproject_rel` (
  `VisitProjetSubProjetID` int unsigned NOT NULL auto_increment,
  `VisitID` int(10) unsigned NOT NULL,
  `ProjectID` int(2) DEFAULT NULL,
  `SubprojectID` int(10) unsigned DEFAULT NULL,
  CONSTRAINT visit_project_subprojet_rel_PK PRIMARY KEY (`VisitProjetSubProjetID`),
  CONSTRAINT visit_project_subprojet_rel_UK UNIQUE KEY (`VisitID`, `ProjectID`, `SubprojectID`),
  CONSTRAINT visit_project_subproject_rel_VisitID_visit_VisitID_FK FOREIGN KEY (`VisitID`) 
    REFERENCES `visit`(`VisitID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT visit_project_subproject_ProjectID_visit_ProjectID_FK FOREIGN KEY (`ProjectID`)
    REFERENCES `Project`(`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT visit_project_subproject_SubprojectID_visit_SubProjectID_FK FOREIGN KEY (`SubprojectID`)
    REFERENCES `subproject`(`SubprojectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


