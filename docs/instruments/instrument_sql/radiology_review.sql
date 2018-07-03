CREATE TABLE `radiology_review` (
`CommentID` varchar(255) NOT NULL default '',

                            `UserID` varchar(255) default NULL,

                            `Examiner` varchar(255) default NULL,

                            `Testdate` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                            `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL default 'Incomplete',
`Date_taken` date default NULL,
`Candidate_Age` varchar(255) default NULL,
`Window_Difference` varchar(255) default NULL,
`Scan_done` enum('no','yes','not_answered') default NULL,
`MRI_date` date default NULL,
`MRI_date_status` enum('not_answered') default NULL,
`Review_date` date default NULL,
`Review_date_status` enum('not_answered') default NULL,
`Review_results` enum('normal','abnormal','atypical','not_answered') default NULL,
`abnormal_atypical_exclusionary` enum('exclusionary','non_exclusionary','not_answered') default NULL,
`Incidental_findings` text default NULL,
`Incidental_findings_status` enum('not_answered') default NULL,
PRIMARY KEY  (`CommentID`)

              ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
