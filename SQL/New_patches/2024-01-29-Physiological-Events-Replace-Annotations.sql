-- Dropping all tables regarding annotations
DROP TABLE physiological_annotation_archive;
DROP TABLE physiological_annotation_rel;
DROP TABLE physiological_annotation_instance;
DROP TABLE physiological_annotation_parameter;
DROP TABLE physiological_annotation_label;
DROP TABLE physiological_annotation_file;
DROP TABLE physiological_annotation_file_type;

-- Event files are always associated to Projects, sometimes exclusively (dataset-scope events.json files)
-- Add ProjectID and make PhysiologicalFileID DEFAULT NULL (ProjectID should ideally not be NULLable)
ALTER TABLE `physiological_event_file`
  CHANGE `PhysiologicalFileID` `PhysiologicalFileID` int(10) unsigned DEFAULT NULL,
  ADD COLUMN `ProjectID` int(10) unsigned DEFAULT NULL AFTER `PhysiologicalFileID`,
  ADD KEY `FK_physiological_event_file_project_id` (`ProjectID`),
  ADD CONSTRAINT `FK_physiological_event_file_project_id`
    FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`);
