CREATE TABLE `issues_attachments` (
    `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `issueID` int(11) unsigned NOT NULL,
    `file_hash` varchar(64) NOT NULL,
    `date_added` timestamp NOT NULL DEFAULT current_timestamp(),
    `file_name` varchar(255) NOT NULL DEFAULT '',
    `deleted` tinyint(1) NOT NULL DEFAULT 0,
    `user` varchar(255) NOT NULL DEFAULT '',
    `description` text DEFAULT NULL,
    `file_size` int(20) DEFAULT NULL,
    `mime_type` varchar(255) NOT NULL DEFAULT '',
    CONSTRAINT `fk_issues_attachments_issue` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`),
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
VALUES('IssueTrackerDataPath', 'Path to Issue Tracker data files', 1, 0, 'web_path', 26, 'Issue Tracker Data Path', 8);

INSERT INTO Config (ConfigID, Value)
SELECT
    ID,
    '/data/issue_tracker/'
FROM
    ConfigSettings
WHERE
        Name = "IssueTrackerDataPath";
