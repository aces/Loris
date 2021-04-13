ALTER TABLE permissions
    ADD COLUMN `moduleID` int(11) unsigned AFTER `description`,
    ADD COLUMN `action` enum (
    'View',
    'Create',
    'Edit',
    'Download',
    'Upload',
    'Delete',
    'View/Create',
    'View/Edit',
    'View/Download',
    'View/Upload',
    'View/Create/Edit',
    'Create/Edit',
    'Edit/Upload',
    'Edit/Upload/Delete') AFTER `moduleID`;

UPDATE permissions SET description='User Accounts - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='user_accounts'), action='View/Create/Edit' WHERE code='user_accounts';
UPDATE permissions SET description='User Accounts - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='user_accounts'), action='View/Create/Edit' WHERE code='user_accounts_multisite';
UPDATE permissions SET description='Help documentation', moduleID=(SELECT ID FROM modules WHERE Name='help_editor'), action='Edit' WHERE code='context_help';
UPDATE permissions SET description='Feedback Threads', moduleID=(SELECT ID FROM modules WHERE Name='bvl_feedback'), action='Create/Edit' WHERE code='bvl_feedback';
UPDATE permissions SET description='Status', moduleID=(SELECT ID FROM modules WHERE Name='imaging_browser'), action='Edit' WHERE code='imaging_browser_qc';
UPDATE permissions SET description='Send to DCC', moduleID=(SELECT ID FROM modules WHERE Name='instrument_list') WHERE code='send_to_dcc';
UPDATE permissions SET description='Reverse Send from DCC', moduleID=(SELECT ID FROM modules WHERE Name='instrument_list') WHERE code='unsend_to_dcc';
UPDATE permissions SET description='Candidates and Timepoints - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='candidate_list'), action='View' WHERE code='access_all_profiles';
UPDATE permissions SET description='Candidates and Timepoints - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='candidate_list'), action='View/Create' WHERE code='data_entry';
UPDATE permissions SET description='Add and Certify Examiners - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='examiner') WHERE code='examiner_view';
UPDATE permissions SET description='Add and Certify Examiners - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='examiner') WHERE code='examiner_multisite';
UPDATE permissions SET description='Resolve Conflicts', moduleID=(SELECT ID FROM modules WHERE Name='conflict_resolver') WHERE code='conflict_resolver';
UPDATE permissions SET description='Parameter Type Descriptions', moduleID=(SELECT ID FROM modules WHERE Name='datadict'), action='View' WHERE code='data_dict_view';
UPDATE permissions SET description='Violated Scans - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='mri_violations'), action='View' WHERE code='violated_scans_view_allsites';
UPDATE permissions SET description='Settings', moduleID=(SELECT ID FROM modules WHERE Name='configuration'), action='View/Edit' WHERE code='config';
UPDATE permissions SET description='Imaging Scans - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='imaging_browser'), action='View' WHERE code='imaging_browser_view_site';
UPDATE permissions SET description='Imaging Scans - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='imaging_browser'), action='View' WHERE code='imaging_browser_view_allsites';
UPDATE permissions SET description='DICOMs - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='dicom_archive'), action='View' WHERE code='dicom_archive_view_allsites';
UPDATE permissions SET description='Instrument Forms', moduleID=(SELECT ID FROM modules WHERE Name='instrument_builder'), action='Create/Edit' WHERE code='instrument_builder';
UPDATE permissions SET description='Parameter Type Descriptions', moduleID=(SELECT ID FROM modules WHERE Name='datadict'), action='Edit' WHERE code='data_dict_edit';
UPDATE permissions SET description='Candidate Information', moduleID=(SELECT ID FROM modules WHERE Name='candidate_parameters'), action='View' WHERE code='candidate_parameter_view';
UPDATE permissions SET description='Candidate Information', moduleID=(SELECT ID FROM modules WHERE Name='candidate_parameters'), action='Edit' WHERE code='candidate_parameter_edit';
UPDATE permissions SET description='Genomic Data - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='genomic_browser'), action='View' WHERE code='genomic_browser_view_site';
UPDATE permissions SET description='Genomic Data - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='genomic_browser'), action='View' WHERE code='genomic_browser_view_allsites';
UPDATE permissions SET description='Documents', moduleID=(SELECT ID FROM modules WHERE Name='document_repository'), action='View' WHERE code='document_repository_view';
UPDATE permissions SET description='Documents', moduleID=(SELECT ID FROM modules WHERE Name='document_repository'), action='Delete' WHERE code='document_repository_delete';
UPDATE permissions SET description='Processes', moduleID=(SELECT ID FROM modules WHERE Name='server_processes_manager'), action='View' WHERE code='server_processes_manager';
UPDATE permissions SET description='Imaging Scans', moduleID=(SELECT ID FROM modules WHERE Name='imaging_uploader'), action='View/Upload' WHERE code='imaging_uploader';
UPDATE permissions SET description='Acknowledgee List', moduleID=(SELECT ID FROM modules WHERE Name='acknowledgements'), action='View' WHERE code='acknowledgements_view';
UPDATE permissions SET description='Acknowledgee List', moduleID=(SELECT ID FROM modules WHERE Name='acknowledgements'), action='Edit' WHERE code='acknowledgements_edit';
UPDATE permissions SET description='Cross-Modality Data', moduleID=(SELECT ID FROM modules WHERE Name='dataquery'), action='View/Download' WHERE code='dataquery_view';
UPDATE permissions SET description='Genomic Files', moduleID=(SELECT ID FROM modules WHERE Name='genomic_browser'), action='Upload' WHERE code='genomic_data_manager';
UPDATE permissions SET description='Candidate Media Files', moduleID=(SELECT ID FROM modules WHERE Name='media'), action='Edit/Upload/Delete' WHERE code='media_write';
UPDATE permissions SET description='Candidate Media Files', moduleID=(SELECT ID FROM modules WHERE Name='media'), action='View/Download' WHERE code='media_read';
UPDATE permissions SET description='Create/Edit Own Issues and Comment on All Issues', moduleID=(SELECT ID FROM modules WHERE Name='issue_tracker') WHERE code='issue_tracker_reporter';
UPDATE permissions SET description='Close/Edit/Re-assign/Comment on All Issues', moduleID=(SELECT ID FROM modules WHERE Name='issue_tracker') WHERE code='issue_tracker_developer';
UPDATE permissions SET description='Phantom Scans - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='imaging_browser'), action='View' WHERE code='imaging_browser_phantom_allsites';
UPDATE permissions SET description='Phantom Scans - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='imaging_browser'), action='View' WHERE code='imaging_browser_phantom_ownsite';
UPDATE permissions SET description='Release Files', moduleID=(SELECT ID FROM modules WHERE Name='data_release'), action='View' WHERE code='data_release_view';
UPDATE permissions SET description='Release Files', moduleID=(SELECT ID FROM modules WHERE Name='data_release'), action='Upload' WHERE code='data_release_upload';
UPDATE permissions SET description='Grant Other Users Access to Releases', moduleID=(SELECT ID FROM modules WHERE Name='data_release') WHERE code='data_release_edit_file_access';
UPDATE permissions SET description='Installed Instruments', moduleID=(SELECT ID FROM modules WHERE Name='instrument_manager'), action='View' WHERE code='instrument_manager_read';
UPDATE permissions SET description='Upload and Install Instruments', moduleID=(SELECT ID FROM modules WHERE Name='instrument_manager') WHERE code='instrument_manager_write';
UPDATE permissions SET description='Publication Projects', moduleID=(SELECT ID FROM modules WHERE Name='publication'), action='View' WHERE code='publication_view';
UPDATE permissions SET description='Propose Publication Projects', moduleID=(SELECT ID FROM modules WHERE Name='publication') WHERE code='publication_propose';
UPDATE permissions SET description='Accept/Reject Publication Projects', moduleID=(SELECT ID FROM modules WHERE Name='publication') WHERE code='publication_approve';
UPDATE permissions SET description='Dates of Birth', moduleID=(SELECT ID FROM modules WHERE Name='candidate_parameters'), action='Edit' WHERE code='candidate_dob_edit';
UPDATE permissions SET description='EEGs - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='electrophysiology_browser'), action='View' WHERE code='electrophysiology_browser_view_allsites';
UPDATE permissions SET description='EEGs - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='electrophysiology_browser'), action='View' WHERE code='electrophysiology_browser_view_site';
UPDATE permissions SET description='Battery Entries', moduleID=(SELECT ID FROM modules WHERE Name='battery_manager'), action='View' WHERE code='battery_manager_view';
UPDATE permissions SET description='Battery Entries', moduleID=(SELECT ID FROM modules WHERE Name='battery_manager'), action='Create/Edit' WHERE code='battery_manager_edit';
UPDATE permissions SET description='Installed Modules', moduleID=(SELECT ID FROM modules WHERE Name='module_manager'), action='View' WHERE code='module_manager_view';
UPDATE permissions SET description='Installed Modules', moduleID=(SELECT ID FROM modules WHERE Name='module_manager'), action='Edit' WHERE code='module_manager_edit';
UPDATE permissions SET description='Dates of Death', moduleID=(SELECT ID FROM modules WHERE Name='candidate_parameters'), action='Edit' WHERE code='candidate_dod_edit';
UPDATE permissions SET description='Violated Scans - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='mri_violations'), action='View' WHERE code='violated_scans_view_ownsite';
UPDATE permissions SET description='Documents', moduleID=(SELECT ID FROM modules WHERE Name='document_repository'), action='Edit/Upload' WHERE code='document_repository_edit';
UPDATE permissions SET description='Candidate Surveys', moduleID=(SELECT ID FROM modules WHERE Name='survey_accounts'), action='View' WHERE code='survey_accounts_view';
UPDATE permissions SET description='Flagged Imaging Entries', moduleID=(SELECT ID FROM modules WHERE Name='imaging_qc'), action='View' WHERE code='imaging_quality_control_view';
UPDATE permissions SET description='Flagged Behavioural Entries', moduleID=(SELECT ID FROM modules WHERE Name='behavioural_qc'), action='View' WHERE code='behavioural_quality_control_view';

