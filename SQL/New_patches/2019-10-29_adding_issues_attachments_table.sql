CREATE TABLE `issues_attachments` (
    `issueID` int(11) NOT NULL,
    `file_uuid` varchar(36) NOT NULL,
    `date_added` timestamp NOT NULL DEFAULT current_timestamp(),
    `file_name` varchar(255) NOT NULL DEFAULT '',
    `deleted` tinyint(1) NOT NULL DEFAULT 0,
    `user` varchar(255) NOT NULL DEFAULT '',
    `description` text DEFAULT NULL,
    `file_size` int(20) DEFAULT NULL,
    PRIMARY KEY (`issueID`,`file_uuid`)
) DEFAULT CHARSET=utf8mb4;

INSERT INTO `ConfigSettings` (`ID`, `Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`)
VALUES
(105, 'IssueTrackerDataPath', 'Path to Issue Tracker data files', 1, 0, 'web_path', 26, 'Issue Tracker Data Path', 8);

INSERT INTO `Config` (`ID`, `ConfigID`, `Value`)
VALUES
(105, 105, '/data/issue_tracker/');
