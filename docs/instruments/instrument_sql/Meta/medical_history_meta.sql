INSERT INTO test_names (Test_name, Full_name, Sub_group) SELECT 'medical_history', 'Medical History', ID FROM test_subgroups WHERE Subgroup_name = 'Instruments';

INSERT INTO instrument_subtests (Test_name, Subtest_name, Description, Order_number) VALUES('medical_history', 'medical_history_page1', 'Page 1', 1);
INSERT INTO instrument_subtests (Test_name, Subtest_name, Description, Order_number) VALUES('medical_history', 'medical_history_page2', 'Page 2', 2);
INSERT INTO instrument_subtests (Test_name, Subtest_name, Description, Order_number) VALUES('medical_history', 'medical_history_page3', 'Page 3', 3);

INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label) VALUES('medical_history', 1, 2147483647, 'Y', 'Visit', NULL, 'V1');
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label) VALUES('medical_history', 1, 2147483647, 'Y', 'Visit', NULL, 'V2');
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label) VALUES('medical_history', 1, 2147483647, 'Y', 'Visit', NULL, 'V3');
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label) VALUES('medical_history', 1, 2147483647, 'Y', 'Visit', NULL, 'V4');
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label) VALUES('medical_history', 1, 2147483647, 'Y', 'Visit', NULL, 'V5');
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label) VALUES('medical_history', 1, 2147483647, 'Y', 'Visit', NULL, 'V6');