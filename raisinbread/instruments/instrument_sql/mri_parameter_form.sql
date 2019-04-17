CREATE TABLE `mri_parameter_form` (
`CommentID` varchar(255) NOT NULL default '',

                            `UserID` varchar(255) default NULL,

                            `Examiner` varchar(255) default NULL,

                            `Testdate` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                            `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL default 'Incomplete',
`Date_taken` date default NULL,
`Candidate_Age` varchar(255) default NULL,
`Window_Difference` varchar(255) default NULL,
`mri_dataset_name` varchar(255) default NULL,
`type_of_data` enum('participant','human_phantom','geometric_phantom') default NULL,
`site` enum('64','30','60','40','1','7','8','54','61','58','21','47','59','53','10','48','18','66','11','13','15','20','22','16','44','46','49','69','17','55','32','62','63','57','56','6','65','26','25','71','28','73','5','38','68','36','67','29','43','34','52','50','72','37','70','51') default NULL,
`total_duration_hours` varchar(255) default NULL,
`total_duration_hours_status` enum('not_answered') default NULL,
`total_duration_minutes` varchar(255) default NULL,
`total_duration_minutes_status` enum('not_answered') default NULL,
`mri_operator_name` varchar(255) default NULL,
`scan_date` date default NULL,
`3d_t1w_Scan_Done` enum('yes','partial','no') default NULL,
`3d_t1w_number_attempts` varchar(255) default NULL,
`3d_t1w_comments` text default NULL,
`2d_flair_Scan_Done` enum('yes','partial','no') default NULL,
`2d_flair_number_attempts` varchar(255) default NULL,
`2d_flair_comments` text default NULL,
PRIMARY KEY  (`CommentID`)

              ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
