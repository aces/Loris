INSERT INTO `ConfigSettings`
    (
        `Name`,
        `Description`,
        `Visible`,
        `AllowMultiple`,
        `DataType`,
        `Parent`,
        `Label`,
        `OrderNumber`
    )
SELECT
    'issue_tracker_url',
    'The *new* bug/issue tracker url',
    1,
    0,
    'text',
    (
        SELECT
            `ID`
        FROM
            `ConfigSettings`
        WHERE
            `Name` = 'www'
    ),
    'Issue Tracker URL',
    3
;
INSERT INTO
    `Config` (`ConfigID`, `Value`)
SELECT
    (
        SELECT
            `ID`
        FROM
            `ConfigSettings`
        WHERE
            `Name` = 'issue_tracker_url'
    ),
    COALESCE(
        (
            SELECT
                `Value`
            FROM
                `Config`
            WHERE
                `ConfigID` = (
                    SELECT
                        `ID`
                    FROM
                        `ConfigSettings`
                    WHERE
                        `Name` = 'mantis_url'
                )
        ),
        '/issue_tracker'
    );

UPDATE
    `ConfigSettings`
SET
    `Visible` = FALSE
WHERE
    `Name` = 'mantis_url';