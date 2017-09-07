WARNINGS;
SET SQL_NOTES=1;

SELECT 'Delete duplicate entries' as 'Step #1';
DELETE 
FROM 
	instrument_subtests 
USING 
	instrument_subtests,
	instrument_subtests to_keep 
WHERE 
	instrument_subtests.ID < to_keep.ID 
	AND instrument_subtests.Test_name = to_keep.Test_name
	AND instrument_subtests.Subtest_name = to_keep.Subtest_name;

SELECT 'Alter instrument_subtests to force unique Subtest_name' as 'Step #2';
ALTER TABLE `instrument_subtests`
ADD UNIQUE KEY `unique_index` (`Test_name`, `Subtest_name`);

SELECT 'Patch complete' as 'Status';
