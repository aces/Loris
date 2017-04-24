INSERT IGNORE INTO
    Config (`ID`, `ConfigID`, `Value`)
SELECT
    (
        SELECT
            ID
        FROM
            Config
        WHERE
            ConfigID = tracker.ID
    ),
    tracker.ID,
    '/issue_tracker'
FROM
    (
        SELECT
            ID
        FROM
            ConfigSettings
        WHERE
            `Name` = 'mantis_url'
    ) AS tracker;