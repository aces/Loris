INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) 
SELECT 'MRI Upload', 'main.php?test_name=mri_upload', Parent, 4 from LorisMenu WHERE Label = 'Imaging';
