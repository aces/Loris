-- This is for LORIS instance that source the schema of LORIS v15.04.
-- The ExonicFunction column got added in 15.10 but there was a missing patch.
SET @s = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = 'SNP'
        AND table_schema = DATABASE()
        AND column_name = 'ExonicFunction'
    ) > 0,
    "SELECT 'conform' as 'SNP table structure check'",
    "ALTER TABLE SNP ADD `ExonicFunction` enum('nonsynonymous','unknown') DEFAULT NULL AFTER `Damaging`"
));

PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
