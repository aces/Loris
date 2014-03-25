CREATE TABLE `participant_accounts` (
      `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
      `SessionID` int(6) DEFAULT NULL,
      `Test_name` varchar(255) DEFAULT NULL,
      `Email` varchar(255) DEFAULT NULL,
      `Status` enum('Created','Sent','In Progress','Complete') DEFAULT NULL,
      `OneTimePassword` varchar(8) DEFAULT NULL,
      `CommentID` varchar(255) DEFAULT NULL,
      `UserEaseRating` varchar(1) DEFAULT NULL,
      `UserComments` text,
      PRIMARY KEY (`ID`)
);

CREATE TABLE participant_emails(
    Test_name varchar(255) NOT NULL PRIMARY KEY REFERENCES test_names(Test_name),
    DefaultEmail TEXT NULL
);

ALTER TABLE test_names ADD COLUMN IsDirectEntry BOOLEAN;

UPDATE permissions SET description='User Management / Survey Participant Management' WHERE code='user_accounts';
