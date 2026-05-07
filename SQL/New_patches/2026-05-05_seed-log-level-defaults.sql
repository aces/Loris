UPDATE Config c
JOIN ConfigSettings cs ON c.ConfigID = cs.ID
SET c.Value = CASE cs.Name
    WHEN 'database_log_level' THEN 'warning'
    WHEN 'request_log_level' THEN 'warning'
    WHEN 'exception_log_level' THEN 'warning'
    WHEN 'profiler_log_level' THEN 'none'
END
WHERE cs.Name IN (
    'database_log_level',
    'request_log_level',
    'exception_log_level',
    'profiler_log_level'
)
AND (c.Value IS NULL OR c.Value = '');

INSERT INTO Config (ConfigID, Value)
SELECT cs.ID, CASE cs.Name
    WHEN 'database_log_level' THEN 'warning'
    WHEN 'request_log_level' THEN 'warning'
    WHEN 'exception_log_level' THEN 'warning'
    WHEN 'profiler_log_level' THEN 'none'
END
FROM ConfigSettings cs
LEFT JOIN Config c ON c.ConfigID = cs.ID
WHERE cs.Name IN (
    'database_log_level',
    'request_log_level',
    'exception_log_level',
    'profiler_log_level'
)
AND c.ID IS NULL;
