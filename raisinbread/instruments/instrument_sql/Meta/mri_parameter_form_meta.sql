INSERT INTO test_names (Test_name, Full_name, Sub_group) SELECT 'mri_parameter_form', 'MRI Parameter Form', ID FROM test_subgroups WHERE Subgroup_name = 'Imaging';

INSERT INTO instrument_subtests (Test_name, Subtest_name, Description, Order_number) VALUES ('mri_parameter_form', 'mri_parameter_form_page1', 'Page 1', 1);

INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V1' FROM subproject WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V1' FROM subproject WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V1' FROM subproject WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V1' FROM subproject WHERE title = 'High Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V2' FROM subproject WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V2' FROM subproject WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V2' FROM subproject WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V2' FROM subproject WHERE title = 'High Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V3' FROM subproject WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V3' FROM subproject WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V3' FROM subproject WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V3' FROM subproject WHERE title = 'High Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V4' FROM subproject WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V4' FROM subproject WHERE title = 'High Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V5' FROM subproject WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V5' FROM subproject WHERE title = 'High Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V6' FROM subproject WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V6' FROM subproject WHERE title = 'High Yeast';