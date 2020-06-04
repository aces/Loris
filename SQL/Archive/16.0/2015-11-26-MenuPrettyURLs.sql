-- Candidate Menu
update LorisMenu SET Link='/candidate_list/' WHERE Link='main.php?test_name=candidate_list';
update LorisMenu SET Link='/new_profile/' WHERE Link='main.php?test_name=new_profile';

-- Clinical Menu
update LorisMenu SET Link='/reliability/' WHERE Link="main.php?test_name=reliability";
update LorisMenu SET Link='/conflict_resolver/' WHERE Link="main.php?test_name=conflict_resolver";
update LorisMenu SET Link='/examiner/' WHERE Link="main.php?test_name=examiner";
update LorisMenu SET Link='/training/' WHERE Link="main.php?test_name=training";

-- Imaging Menu
update LorisMenu SET Link='/final_radiological_review/' WHERE Link="main.php?test_name=final_radiological_review";
update LorisMenu SET Link='/dicom_archive/' WHERE Link="main.php?test_name=dicom_archive";
update LorisMenu SET Link='/imaging_browser/' WHERE Link="main.php?test_name=imaging_browser";
update LorisMenu SET Link='/mri_violations/' WHERE Link="main.php?test_name=mri_violations";
update LorisMenu SET Link='/imaging_uploader/' WHERE Link="main.php?test_name=imaging_uploader";

-- Reports menu
update LorisMenu SET Link='/statistics/' WHERE Link="main.php?test_name=statistics";

-- Tools menu
update LorisMenu SET Link='/datadict/' WHERE Link="main.php?test_name=datadict";
update LorisMenu SET Link='/document_repository/' WHERE Link="main.php?test_name=document_repository";
update LorisMenu SET Link='/data_integrity_flag/' WHERE Link="main.php?test_name=data_integrity_flag";
update LorisMenu SET Link='/data_team_helper/' WHERE Link="main.php?test_name=data_team_helper";
update LorisMenu SET Link='/instrument_builder/' WHERE Link="main.php?test_name=instrument_builder";
update LorisMenu SET Link='/genomic_browser/' WHERE Link="main.php?test_name=genomic_browser";

-- Admin menu
update LorisMenu SET Link='/user_accounts/' WHERE Link="main.php?test_name=user_accounts";
update LorisMenu SET Link='/survey_accounts/' WHERE Link="main.php?test_name=survey_accounts";
update LorisMenu SET Link='/help_editor/' WHERE Link="main.php?test_name=help_editor";
update LorisMenu SET Link='/instrument_manager/' WHERE Link="main.php?test_name=instrument_manager";
update LorisMenu SET Link='/configuration/' WHERE Link="main.php?test_name=configuration";
update LorisMenu SET Link='/server_process_manager/' WHERE Link="main.php?test_name=server_process_manager";
