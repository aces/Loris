INSERT INTO test_names (Test_name, Full_name, Sub_group) SELECT 'bmi', 'BMI Calculator', ID FROM test_subgroups WHERE Subgroup_name = 'Instruments';


INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V1' FROM cohort WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V2' FROM cohort WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V3' FROM cohort WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V4' FROM cohort WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V5' FROM cohort WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V6' FROM cohort WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V1' FROM cohort WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V2' FROM cohort WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V3' FROM cohort WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V4' FROM cohort WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V5' FROM cohort WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', CohortID, 'V6' FROM cohort WHERE title = 'Stale';
