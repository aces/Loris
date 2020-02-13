CREATE TABLE `issues_attachments` (
    `ID` int NOT NULL AUTO_INCREMENT,
    `issueID` int(11) NOT NULL,
    `file_hash` varchar(40) NOT NULL,
    `date_added` timestamp NOT NULL DEFAULT current_timestamp(),
    `file_name` varchar(255) NOT NULL DEFAULT '',
    `deleted` tinyint(1) NOT NULL DEFAULT 0,
    `user` varchar(255) NOT NULL DEFAULT '',
    `description` text DEFAULT NULL,
    `file_size` int(20) DEFAULT NULL,
    `mime_type` varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`ID`)
) DEFAULT CHARSET=utf8mb4;

INSERT INTO `ConfigSettings` (`ID`, `Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`)
VALUES
(106, 'IssueTrackerDataPath', 'Path to Issue Tracker data files', 1, 0, 'web_path', 26, 'Issue Tracker Data Path', 8);

INSERT INTO `Config` (`ID`, `ConfigID`, `Value`)
VALUES
(106, 106, '/data/issue_tracker/');
