INSERT INTO test_names (Test_name, Full_name, Sub_group) SELECT 'radiology_review', 'Radiology review', ID FROM test_subgroups WHERE Subgroup_name = 'Imaging';

INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'radiology_review', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V1' FROM subproject WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'radiology_review', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V1' FROM subproject WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'radiology_review', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V2' FROM subproject WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'radiology_review', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V2' FROM subproject WHERE title = 'Fresh';
