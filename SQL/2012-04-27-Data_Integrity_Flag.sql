CREATE TABLE `data_integrity_flag` (
                `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
                `Name` varchar(255) DEFAULT '',
                `initial_check` enum('','1','2','3') DEFAULT null,
                `Comment` text  DEFAULT Null,
                `Last_access` DATETIME DEFAULT null,
                `percent_completed` int(11) unsigned DEFAULT NULL,
                `Visit_label` varchar(255) DEFAULT '',
                `initial_check_date` date DEFAULT null,
                 UNIQUE KEY `Visit_lable_Name` (`Name`,`Visit_label`), 
                 PRIMARY KEY (`ID`));


/**Changes to feedback_bvl_thread table***/
ALTER table feedback_bvl_thread add column FieldName text; 
INSERT INTO feedback_bvl_thread (fieldname) values("Across All Fields");

