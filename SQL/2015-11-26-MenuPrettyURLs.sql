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
