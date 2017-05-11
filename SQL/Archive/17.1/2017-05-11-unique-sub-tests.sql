WARNINGS;
SET SQL_NOTES=1;

SELECT 'Alter instrument_subtests to force unique Subtest_name' as 'Step #1';
ALTER TABLE `instrument_subtests`
ADD UNIQUE KEY `Subtest_name` (`Subset_name`);

SELECT 'Patch complete' as 'Status';
