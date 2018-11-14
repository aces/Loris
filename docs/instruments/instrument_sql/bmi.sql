CREATE TABLE `bmi` (
`CommentID` varchar(255) NOT NULL default '',

                            `UserID` varchar(255) default NULL,

                            `Examiner` varchar(255) default NULL,

                            `Testdate` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                            `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL default 'Incomplete',
`Date_taken` date default NULL,
`Candidate_Age` varchar(255) default NULL,
`Window_Difference` varchar(255) default NULL,
`unit_classification` enum('metric','standard') default NULL,
`height_feet` numeric default NULL,
`height_feet_status` enum('not_answered') default NULL,
`height_inches` numeric default NULL,
`height_inches_status` enum('not_answered') default NULL,
`weight_lbs` numeric default NULL,
`weight_lbs_status` enum('not_answered') default NULL,
`height_cms` numeric default NULL,
`height_cms_status` enum('not_answered') default NULL,
`weight_kgs` numeric default NULL,
`weight_kgs_status` enum('not_answered') default NULL,
`bmi` varchar(255) default NULL,
`bmi_category` varchar(255) default NULL,
PRIMARY KEY  (`CommentID`)

              ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
