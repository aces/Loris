
ALTER TABLE `candidate` DROP INDEX `CandID`;
ALTER TABLE `candidate` DROP PRIMARY KEY ,
ADD PRIMARY KEY ( `CandID` );
ALTER TABLE `example_instrument` DROP INDEX `CommentID` ;
ALTER TABLE `flag` DROP INDEX `ID`  ;
ALTER TABLE `mri_safety` DROP INDEX `SessionID`;  
ALTER TABLE `session` DROP INDEX `ID`;
ALTER TABLE `examiners` CHANGE `centerID` `centerID` TINYINT( 2 ) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `feedback_bvl_type` CHANGE `Feedback_type` `Feedback_type` INT( 11 ) UNSIGNED NOT NULL AUTO_INCREMENT ; 
ALTER TABLE `feedback_mri_predefined_comments` CHANGE `CommentTypeID` `CommentTypeID` INT( 11 ) UNSIGNED NOT NULL DEFAULT '0' ;
ALTER TABLE `feedback_mri_comments` CHANGE `CommentTypeID` `CommentTypeID` INT( 11 ) UNSIGNED NOT NULL DEFAULT '0',
CHANGE `PredefinedCommentID` `PredefinedCommentID` INT( 11 ) UNSIGNED NULL DEFAULT NULL; 
ALTER TABLE `session` CHANGE `CenterID` `CenterID` TINYINT( 2 ) UNSIGNED NULL DEFAULT NULL ; 
ALTER TABLE `test_names` CHANGE `Sub_group` `Sub_group` INT( 11 ) UNSIGNED NULL DEFAULT NULL  ;
ALTER TABLE `test_subgroups` CHANGE `ID` `ID` INT( 11 ) UNSIGNED NOT NULL DEFAULT '0' ;
ALTER TABLE `feedback_bvl_thread` CHANGE `FeedbackID` `FeedbackID` INT( 11 ) UNSIGNED NOT NULL AUTO_INCREMENT ,
CHANGE `SessionID` `SessionID` INT( 11 ) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `feedback_bvl_entry` CHANGE `ID` `ID` INT( 11 ) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `feedback_bvl_entry` CHANGE `FeedbackID` `FeedbackID` INT( 11 ) UNSIGNED NULL DEFAULT NULL;  
ALTER TABLE `feedback_bvl_types_site` CHANGE `Feedback_type` `Feedback_type` INT( 11 ) UNSIGNED NOT NULL DEFAULT '0' ;
INSERT INTO mri_scanner set ID=9999;
UPDATE mri_scanner set ID=0 where ID=9999;
ALTER TABLE `notification_spool` CHANGE `CenterID` `CenterID` TINYINT( 2 ) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `parameter_candidate` CHANGE `CandID` `CandID` INT( 6 ) NOT NULL DEFAULT '0' ;
ALTER TABLE `parameter_type_category_rel` CHANGE `ParameterTypeID` `ParameterTypeID` INT( 11 ) UNSIGNED NOT NULL DEFAULT '0',
CHANGE `ParameterTypeCategoryID` `ParameterTypeCategoryID` INT( 11 ) UNSIGNED NOT NULL DEFAULT '0'; 
ALTER TABLE `query_gui_downloadable_queries` CHANGE `userID` `userID` INT( 11 ) UNSIGNED NULL DEFAULT NULL ;
ALTER TABLE `query_gui_stored_queries` CHANGE `userID` `userID` INT( 11 ) UNSIGNED NOT NULL DEFAULT '0';
ALTER TABLE `example_instrument` CHANGE `Examiner` `Examiner` INT( 11 ) UNSIGNED NULL DEFAULT NULL;




ALTER TABLE examiners
  ADD CONSTRAINT FK_examiners_1
      FOREIGN KEY (centerID)
      REFERENCES psc (CenterID);

ALTER TABLE feedback_bvl_thread
  ADD CONSTRAINT FK_feedback_bvl_thread_1
      FOREIGN KEY (Feedback_type)
      REFERENCES feedback_bvl_type (Feedback_type);

ALTER TABLE feedback_mri_predefined_comments
  ADD CONSTRAINT FK_feedback_mri_predefined_comments_1
      FOREIGN KEY (CommentTypeID)
      REFERENCES feedback_mri_comment_types (CommentTypeID);

ALTER TABLE files
  ADD CONSTRAINT FK_files_1
      FOREIGN KEY (SessionID)
      REFERENCES session (ID)
      ON DELETE CASCADE    
      ON UPDATE CASCADE;

ALTER TABLE files
  ADD CONSTRAINT FK_files_2
      FOREIGN KEY (AcquisitionProtocolID)
      REFERENCES mri_scan_type (ID);

ALTER TABLE flag
  ADD CONSTRAINT FK_flag_2
      FOREIGN KEY (Test_name)
      REFERENCES test_names (Test_name);

ALTER TABLE flag
  ADD CONSTRAINT FK_flag_1
      FOREIGN KEY (SessionID)
      REFERENCES session (ID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;

ALTER TABLE mri_scanner
  ADD CONSTRAINT FK_mri_scanner_1
      FOREIGN KEY (CandID)
      REFERENCES candidate (CandID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;

ALTER TABLE session
  ADD CONSTRAINT FK_session_1
      FOREIGN KEY (CandID)
      REFERENCES candidate (CandID);

ALTER TABLE session
  ADD CONSTRAINT FK_session_2
      FOREIGN KEY (CenterID)
      REFERENCES psc (CenterID);

ALTER TABLE test_names
  ADD CONSTRAINT FK_test_names_1
      FOREIGN KEY (Sub_group)
      REFERENCES test_subgroups (ID);

ALTER TABLE users
  ADD CONSTRAINT FK_users_1
      FOREIGN KEY (CenterID)
      REFERENCES psc (CenterID);

ALTER TABLE candidate
  ADD CONSTRAINT FK_candidate_1
      FOREIGN KEY (CenterID)
      REFERENCES psc (CenterID);

ALTER TABLE feedback_bvl_entry
  ADD CONSTRAINT FK_feedback_bvl_entry_1
      FOREIGN KEY (FeedbackID)
      REFERENCES feedback_bvl_thread (FeedbackID);

ALTER TABLE feedback_bvl_types_site
  ADD CONSTRAINT FK_feedback_bvl_types_site_1
      FOREIGN KEY (Feedback_type)
      REFERENCES feedback_bvl_type (Feedback_type);

ALTER TABLE feedback_bvl_types_site
  ADD CONSTRAINT FK_feedback_bvl_types_site_2
      FOREIGN KEY (CenterID)
      REFERENCES psc (CenterID);

ALTER TABLE feedback_mri_comments
  ADD CONSTRAINT FK_feedback_mri_comments_1
      FOREIGN KEY (CommentTypeID)
      REFERENCES feedback_mri_comment_types (CommentTypeID);

ALTER TABLE feedback_mri_comments
  ADD CONSTRAINT FK_feedback_mri_comments_2
      FOREIGN KEY (PredefinedCommentID)
      REFERENCES feedback_mri_predefined_comments (PredefinedCommentID);

ALTER TABLE feedback_mri_comments
  ADD CONSTRAINT FK_feedback_mri_comments_3
      FOREIGN KEY (FileID)
      REFERENCES files (FileID);

ALTER TABLE feedback_mri_comments
  ADD CONSTRAINT FK_feedback_mri_comments_4
      FOREIGN KEY (SessionID)
      REFERENCES session (ID);

ALTER TABLE hardcopy_requests
  ADD CONSTRAINT FK_hardcopy_requests_1
      FOREIGN KEY (CenterID)
      REFERENCES psc (CenterID);

ALTER TABLE instrument_subtests
  ADD CONSTRAINT FK_instrument_subtests_1
      FOREIGN KEY (Test_name)
      REFERENCES test_names (Test_name);

ALTER TABLE mri_acquisition_dates
  ADD CONSTRAINT FK_mri_acquisition_dates_1
      FOREIGN KEY (SessionID)
      REFERENCES session (ID);

ALTER TABLE mri_protocol
  ADD CONSTRAINT FK_mri_protocol_1
      FOREIGN KEY (ScannerID)
      REFERENCES mri_scanner (ID);

ALTER TABLE notification_spool
  ADD CONSTRAINT FK_notification_spool_1
      FOREIGN KEY (NotificationTypeID)
      REFERENCES notification_types (NotificationTypeID);

ALTER TABLE notification_spool
  ADD CONSTRAINT FK_notification_spool_2
      FOREIGN KEY (CenterID)
      REFERENCES psc (CenterID);

ALTER TABLE parameter_candidate
  ADD CONSTRAINT FK_parameter_candidate_1
      FOREIGN KEY (ParameterTypeID)
      REFERENCES parameter_type (ParameterTypeID);

ALTER TABLE parameter_candidate
  ADD CONSTRAINT FK_parameter_candidate_2
      FOREIGN KEY (CandID)
      REFERENCES candidate (CandID);

ALTER TABLE parameter_session
  ADD CONSTRAINT FK_parameter_session_1
      FOREIGN KEY (SessionID)
      REFERENCES session (ID);

ALTER TABLE parameter_session
  ADD CONSTRAINT FK_parameter_session_2
      FOREIGN KEY (ParameterTypeID)
      REFERENCES parameter_type (ParameterTypeID);

ALTER TABLE parameter_type_category_rel
  ADD CONSTRAINT FK_parameter_type_category_rel_1
      FOREIGN KEY (ParameterTypeID)
      REFERENCES parameter_type (ParameterTypeID);

ALTER TABLE parameter_type_category_rel
  ADD CONSTRAINT FK_parameter_type_category_rel_2
      FOREIGN KEY (ParameterTypeCategoryID)
      REFERENCES parameter_type_category (ParameterTypeCategoryID);

ALTER TABLE query_gui_downloadable_queries
  ADD CONSTRAINT FK_query_gui_downloadable_queries_1
      FOREIGN KEY (userID)
      REFERENCES users (ID)
      ON DELETE NO ACTION
      ON UPDATE CASCADE;

ALTER TABLE query_gui_stored_queries
  ADD CONSTRAINT FK_query_gui_stored_queries_1
      FOREIGN KEY (userID)
      REFERENCES users (ID)
      ON DELETE NO ACTION
      ON UPDATE CASCADE;

ALTER TABLE test_battery
  ADD CONSTRAINT FK_test_battery_1
      FOREIGN KEY (Test_name)
      REFERENCES test_names (Test_name);

ALTER TABLE user_perm_rel
  ADD CONSTRAINT FK_user_perm_rel_1
      FOREIGN KEY (userID)
      REFERENCES users (ID)
   ON DELETE CASCADE
   ON UPDATE CASCADE;

ALTER TABLE user_perm_rel
  ADD CONSTRAINT FK_user_perm_rel_2
      FOREIGN KEY (permID)
      REFERENCES permissions (permID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;

ALTER TABLE example_instrument
  ADD CONSTRAINT FK_example_instrument_2
      FOREIGN KEY (UserID)
      REFERENCES users (UserID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;

ALTER TABLE example_instrument
  ADD CONSTRAINT FK_example_instrument_1
      FOREIGN KEY (CommentID)
      REFERENCES flag (CommentID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;

ALTER TABLE example_instrument
  ADD CONSTRAINT FK_example_instrument_3
      FOREIGN KEY (Examiner)
      REFERENCES examiners (examinerID);

ALTER TABLE parameter_file
  ADD CONSTRAINT FK_parameter_file_1
      FOREIGN KEY (FileID)
      REFERENCES files (FileID);

ALTER TABLE parameter_file
  ADD CONSTRAINT FK_parameter_file_2
      FOREIGN KEY (ParameterTypeID)
      REFERENCES parameter_type (ParameterTypeID);



-- To get rid of orphaned parameter_session entries
-- create temporary table ToDel select s.* from parameter_session s left outer join parameter_type t on (s.ParameterTypeID=t.ParameterTypeID) where t.ParameterTypeID is null;
-- delete parameter_session from parameter_session inner join ToDel on parameter_session.ParameterTypeID = ToDel.ParameterTypeID;
--
