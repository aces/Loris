# add ordering column (tinyint) to battery
ALTER TABLE test_battery ADD instr_order tinyint after firstVisit;
# add ordering column (tinyint) to test_subgroups
ALTER TABLE test_subgroups ADD group_order tinyint after Subgroup_name;