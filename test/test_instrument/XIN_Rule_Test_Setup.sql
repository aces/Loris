INSERT INTO test_names(Test_name, Full_name,Sub_group,isDirectEntry) VALUES ('XIN_Rule_Test','XIN RULE TEST',1, false);
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Stage, SubprojectID, Visit_label) VALUES ('XIN_Rule_Test', 0, 0, 'Visit', 1, YOUR_VL_HERE);

CREATE TABLE `XIN_Rule_Test` (
`CommentID` varchar(255) NOT NULL default '',

                            `UserID` varchar(255) default NULL,

                            `Examiner` varchar(255) default NULL,

                            `Testdate` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                            `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL default 'Incomplete',
`q1` enum('A','B','C','D') default NULL,
`q2` enum('A','B','C','D') default NULL,
`q3` varchar(255) default NULL,
`q3_status` enum('not_answered') default NULL,
`q4` varchar(255) default NULL,
`q4_status` enum('not_answered') default NULL,
`q5` varchar(255) default NULL,
`q5_status` enum('not_answered') default NULL,
`q6` varchar(255) default NULL,
`q6_status` enum('not_answered') default NULL,
PRIMARY KEY  (`CommentID`)

              ) ENGINE=InnoDB DEFAULT CHARSET=utf8;