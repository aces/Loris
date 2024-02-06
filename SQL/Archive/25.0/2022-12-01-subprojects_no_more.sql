ALTER TABLE subproject RENAME TO cohort;
ALTER TABLE project_subproject_rel RENAME TO project_cohort_rel;
ALTER TABLE visit_project_subproject_rel RENAME TO visit_project_cohort_rel;

ALTER TABLE cohort CHANGE `SubprojectID` `CohortID` int(10) unsigned NOT NULL auto_increment;
ALTER TABLE project_cohort_rel CHANGE `ProjectSubprojectRelID` `ProjectCohortRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE project_cohort_rel CHANGE `SubprojectID` `CohortID` int(10) unsigned NOT NULL;
ALTER TABLE session CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE test_battery CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_checks_group_target CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_group_target CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE visit_project_cohort_rel CHANGE `VisitProjectSubprojectRelID` `VisitProjectCohortRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE visit_project_cohort_rel CHANGE `ProjectSubprojectRelID` `ProjectCohortRelID` int(10) unsigned NOT NULL;


/**
REVERT PATCH

ALTER TABLE cohort RENAME TO subproject;
ALTER TABLE project_cohort_rel RENAME TO project_subproject_rel;
ALTER TABLE visit_project_cohort_rel RENAME TO visit_project_subproject_rel;

ALTER TABLE subproject CHANGE `CohortID` `SubprojectID` int(10) unsigned NOT NULL auto_increment;
ALTER TABLE project_subproject_rel CHANGE `ProjectCohortRelID` `ProjectSubprojectRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE project_subproject_rel CHANGE `CohortID` `SubprojectID` int(10) unsigned NOT NULL;
ALTER TABLE session CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE test_battery CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_checks_group_target CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_group_target CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE visit_project_subproject_rel CHANGE `VisitProjectCohortRelID` `VisitProjectSubprojectRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE visit_project_subproject_rel CHANGE `ProjectCohortRelID` `ProjectSubprojectRelID` int(10) unsigned NOT NULL;
 */
