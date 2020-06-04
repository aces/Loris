CREATE TABLE `medical_history` (
`CommentID` varchar(255) NOT NULL default '',

                            `UserID` varchar(255) default NULL,

                            `Examiner` varchar(255) default NULL,

                            `Testdate` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                            `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL default 'Incomplete',
`Date_taken` date default NULL,
`Candidate_Age` varchar(255) default NULL,
`Window_Difference` varchar(255) default NULL,
`arthritis` enum('yes','no') default NULL,
`arthritis_age` varchar(255) default NULL,
`arthritis_age_status` enum('not_answered') default NULL,
`pulmonary_issues` enum('yes','no') default NULL,
`pulmonary_issues_specific` varchar(255) default NULL,
`hypertension` enum('yes','no') default NULL,
`hypertension_while_pregnant` enum('yes','no') default NULL,
`hypertension_while_pregnant_age` varchar(255) default NULL,
`hypertension_while_pregnant_age_status` enum('not_answered') default NULL,
`concussion_or_head_trauma` enum('yes','no') default NULL,
`concussion_1_description` varchar(255) default NULL,
`concussion_1_hospitalized` enum('yes','no') default NULL,
`concussion_1_age` varchar(255) default NULL,
`concussion_2_description` varchar(255) default NULL,
`concussion_2_hospitalized` enum('yes','no') default NULL,
`concussion_2_age` varchar(255) default NULL,
`concussion_3_description` varchar(255) default NULL,
`concussion_3_hospitalized` enum('yes','no') default NULL,
`concussion_3_age` varchar(255) default NULL,
`current_concussion_symptoms` varchar(255) default NULL,
PRIMARY KEY  (`CommentID`)

              ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
