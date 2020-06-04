INSERT INTO test_names (Test_name, Full_name, Sub_group) SELECT 'aosi', 'AOSI', ID FROM test_subgroups WHERE Subgroup_name = 'Instruments';

INSERT INTO instrument_subtests (Test_name, Subtest_name, Description, Order_number) VALUES('aosi', 'aosi_page1', 'Item Adminstration', 1);
INSERT INTO instrument_subtests (Test_name, Subtest_name, Description, Order_number) VALUES('aosi', 'aosi_page2', 'General Observations', 2);


INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label) VALUES('aosi', 1, 2147483647, 'Y', 'Visit', NULL, 'V1');
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label) VALUES('aosi', 1, 2147483647, 'Y', 'Visit', NULL, 'V2');
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label) VALUES('aosi', 1, 2147483647, 'Y', 'Visit', NULL, 'V3');

