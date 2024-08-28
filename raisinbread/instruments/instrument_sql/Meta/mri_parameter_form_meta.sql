INSERT INTO test_names (Test_name, Full_name, Sub_group) SELECT 'mri_parameter_form', 'MRI Parameter Form', ID FROM test_subgroups WHERE Subgroup_name = 'Imaging';

INSERT INTO instrument_subtests (Test_name, Subtest_name, Description, Order_number) VALUES ('mri_parameter_form', 'mri_parameter_form_page1', 'Page 1', 1);

INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V1', 'Y' FROM cohort WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V1', 'Y' FROM cohort WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V1', 'Y' FROM cohort WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V1', 'Y' FROM cohort WHERE title = 'High Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V2', 'Y' FROM cohort WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V2', 'Y' FROM cohort WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V2', 'Y' FROM cohort WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V2', 'Y' FROM cohort WHERE title = 'High Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V3', 'Y' FROM cohort WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V3', 'Y' FROM cohort WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V3', 'Y' FROM cohort WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V3', 'Y' FROM cohort WHERE title = 'High Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V4', 'Y' FROM cohort WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V4', 'Y' FROM cohort WHERE title = 'High Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V5', 'Y' FROM cohort WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V5', 'Y' FROM cohort WHERE title = 'High Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V6', 'Y' FROM cohort WHERE title = 'Low Yeast';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, DoubleDataEntryEnabled)
  SELECT 'mri_parameter_form', 1, 2147483647, 'Y', 'Visit', CohortID, 'V6', 'Y' FROM cohort WHERE title = 'High Yeast';
