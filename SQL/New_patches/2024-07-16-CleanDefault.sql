-- Drop nonsensical defaults and put use right type for others.

ALTER TABLE `users`
  ALTER `Privilege` SET DEFAULT 0;

ALTER TABLE `candidate`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `candidate`
  ALTER `RegistrationCenterID` DROP DEFAULT;

ALTER TABLE `session`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `instrument_subtests`
  ALTER `Order_number` SET DEFAULT 0;

ALTER TABLE `flag`
  ALTER `SessionID` DROP DEFAULT;

ALTER TABLE `tarchive`
  ALTER `AcquisitionCount` SET DEFAULT 0;

ALTER TABLE `tarchive`
  ALTER `NonDicomFileCount` SET DEFAULT 0;

ALTER TABLE `tarchive`
  ALTER `DicomFileCount` SET DEFAULT 0;

ALTER TABLE `tarchive`
  ALTER `sumTypeVersion` SET DEFAULT 0;

ALTER TABLE `tarchive`
  ALTER `uploadAttempt` SET DEFAULT 0;

ALTER TABLE `tarchive`
  ALTER `PendingTransfer` SET DEFAULT 0;

ALTER TABLE `tarchive_series`
  ALTER `TarchiveID` DROP DEFAULT;

ALTER TABLE `tarchive_series`
  ALTER `SeriesNumber` SET DEFAULT 0;

ALTER TABLE `tarchive_series`
  ALTER `NumberOfFiles` SET DEFAULT 0;

ALTER TABLE `tarchive_files`
  ALTER `TarchiveID` DROP DEFAULT;

ALTER TABLE `hrrt_archive`
  ALTER `EcatFileCount` SET DEFAULT 0;

ALTER TABLE `hrrt_archive`
  ALTER `NonEcatFileCount` SET DEFAULT 0;

ALTER TABLE `hrrt_archive_files`
  ALTER `HrrtArchiveID` DROP DEFAULT;

ALTER TABLE `mri_processing_protocol`
  ALTER `InsertTime` SET DEFAULT 0;

ALTER TABLE `files`
  ALTER `SessionID` DROP DEFAULT;

ALTER TABLE `files`
  ALTER `InsertTime` SET DEFAULT 0;

ALTER TABLE `files`
  ALTER `SourceFileID` DROP DEFAULT;

ALTER TABLE `mri_upload`
  ALTER `InsertionComplete` SET DEFAULT 0;

ALTER TABLE `mri_upload`
  ALTER `IsTarchiveValidated` SET DEFAULT 0;

ALTER TABLE `document_repository_categories`
  ALTER `parent_id` DROP DEFAULT;

ALTER TABLE `document_repository`
  ALTER `EARLI` SET DEFAULT 0;

ALTER TABLE `document_repository`
  ALTER `hide_video` SET DEFAULT 0;

ALTER TABLE `notification_types`
  ALTER `private` SET DEFAULT 0;

ALTER TABLE `notification_spool`
  ALTER `NotificationTypeID` DROP DEFAULT;

ALTER TABLE `notification_spool`
  ALTER `ProcessID` DROP DEFAULT;

ALTER TABLE `participant_status`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `participant_status_history`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `certification`
  ALTER `examinerID` DROP DEFAULT;

ALTER TABLE `media`
  ALTER `hide_file` SET DEFAULT 0;

ALTER TABLE `parameter_type`
  ALTER `Queryable` SET DEFAULT 1;

ALTER TABLE `parameter_type`
  ALTER `IsFile` SET DEFAULT 0;

ALTER TABLE `parameter_type_category_rel`
  ALTER `ParameterTypeID` DROP DEFAULT;

ALTER TABLE `parameter_type_category_rel`
  ALTER `ParameterTypeCategoryID` DROP DEFAULT;

ALTER TABLE `parameter_candidate`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `parameter_candidate`
  ALTER `ParameterTypeID` DROP DEFAULT;

ALTER TABLE `parameter_candidate`
  ALTER `InsertTime` SET DEFAULT 0;

ALTER TABLE `parameter_session`
  ALTER `SessionID` DROP DEFAULT;

ALTER TABLE `parameter_session`
  ALTER `ParameterTypeID` DROP DEFAULT;

ALTER TABLE `parameter_session`
  ALTER `InsertTime` SET DEFAULT 0;

ALTER TABLE `SNP_candidate_rel`
  ALTER `SNPID` DROP DEFAULT;

ALTER TABLE `SNP_candidate_rel`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `feedback_mri_predefined_comments`
  ALTER `CommentTypeID` DROP DEFAULT;

ALTER TABLE `feedback_mri_comments`
  ALTER `CommentTypeID` DROP DEFAULT;
