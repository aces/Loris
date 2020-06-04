INSERT INTO test_names (Test_name, Full_name, Sub_group) SELECT 'bmi', 'BMI Calculator', ID FROM test_subgroups WHERE Subgroup_name = 'Instruments';


INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V1' FROM subproject WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V2' FROM subproject WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V3' FROM subproject WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V4' FROM subproject WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V5' FROM subproject WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V6' FROM subproject WHERE title = 'Fresh';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V1' FROM subproject WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V2' FROM subproject WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V3' FROM subproject WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V4' FROM subproject WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V5' FROM subproject WHERE title = 'Stale';
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label)
  SELECT 'bmi', 1, 2147483647, 'Y', 'Visit', SubprojectID, 'V6' FROM subproject WHERE title = 'Stale';
