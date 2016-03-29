-- Candidate Menu
UPDATE LorisMenu SET Link='candidate_list/' WHERE Link='main.php?test_name=candidate_list';
UPDATE LorisMenu SET Link='new_profile/' WHERE Link='main.php?test_name=new_profile';

-- Clinical Menu
UPDATE LorisMenu SET Link='reliability/' WHERE Link='main.php?test_name=reliability';
UPDATE LorisMenu SET Link='conflict_resolver/' WHERE Link='main.php?test_name=conflict_resolver';
UPDATE LorisMenu SET Link='examiner/' WHERE Link='main.php?test_name=examiner';
UPDATE LorisMenu SET Link='training/' WHERE Link='main.php?test_name=training';

-- Imaging Menu
UPDATE LorisMenu SET Link='final_radiological_review/' WHERE Link='main.php?test_name=final_radiological_review';
UPDATE LorisMenu SET Link='dicom_archive/' WHERE Link='main.php?test_name=dicom_archive';
UPDATE LorisMenu SET Link='imaging_browser/' WHERE Link='main.php?test_name=imaging_browser';
UPDATE LorisMenu SET Link='mri_violations/' WHERE Link='main.php?test_name=mri_violations';
UPDATE LorisMenu SET Link='imaging_uploader/' WHERE Link='main.php?test_name=imaging_uploader';

-- Reports menu
UPDATE LorisMenu SET Link='statistics/' WHERE Link='main.php?test_name=statistics';
UPDATE LorisMenu SET Link='dqt/' WHERE Link='/dqt/';
-- Tools menu
UPDATE LorisMenu SET Link='datadict/' WHERE Link='main.php?test_name=datadict';
UPDATE LorisMenu SET Link='document_repository/' WHERE Link='main.php?test_name=document_repository';
UPDATE LorisMenu SET Link='data_integrity_flag/' WHERE Link='main.php?test_name=data_integrity_flag';
UPDATE LorisMenu SET Link='data_team_helper/' WHERE Link='main.php?test_name=data_team_helper';
UPDATE LorisMenu SET Link='instrument_builder/' WHERE Link='main.php?test_name=instrument_builder';
UPDATE LorisMenu SET Link='genomic_browser/' WHERE Link='main.php?test_name=genomic_browser';

-- Admin menu
UPDATE LorisMenu SET Link='user_accounts/' WHERE Link='main.php?test_name=user_accounts';
UPDATE LorisMenu SET Link='survey_accounts/' WHERE Link='main.php?test_name=survey_accounts';
UPDATE LorisMenu SET Link='help_editor/' WHERE Link='main.php?test_name=help_editor';
UPDATE LorisMenu SET Link='instrument_manager/' WHERE Link='main.php?test_name=instrument_manager';
UPDATE LorisMenu SET Link='configuration/' WHERE Link='main.php?test_name=configuration';
UPDATE LorisMenu SET Link='server_process_manager/' WHERE Link='main.php?test_name=server_processes_manager';
