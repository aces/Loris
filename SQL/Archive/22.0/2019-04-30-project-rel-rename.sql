RENAME TABLE project_rel TO project_subproject_rel;

-- Change fields to math their respective reference keys
ALTER TABLE project_subproject_rel CHANGE `SubprojectID` `SubprojectID` int(10) unsigned NOT NULL;

ALTER TABLE project_subproject_rel ADD CONSTRAINT `FK_project_subproject_rel_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE;
ALTER TABLE project_subproject_rel ADD CONSTRAINT `FK_project_subproject_rel_SubprojectID` FOREIGN KEY (`SubprojectID`) REFERENCES `subproject` (`SubprojectID`) ON DELETE CASCADE;

