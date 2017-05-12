WARNINGS;
SET SQL_NOTES=1;

SELECT 'Delete duplicate entries' as 'Step #1';
DELETE 
    i
FROM 
    instrument_subtests i
LEFT JOIN
    (
        SELECT 
            ID,
            Subtest_name AS keep 
        FROM 
            instrument_subtests 
        GROUP BY keep
    ) AS KeepRows 
ON
  i.ID = KeepRows.ID
WHERE KeepRows.ID IS NULL;

SELECT 'Alter instrument_subtests to force unique Subtest_name' as 'Step #2';
ALTER TABLE `instrument_subtests`
ADD UNIQUE KEY `Subtest_name` (`Subtest_name`);

SELECT 'Patch complete' as 'Status';
