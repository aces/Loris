SET FOREIGN_KEY_CHECKS=0;
ALTER TABLE mri_parameter_form 
ADD COLUMN  `fieldmapBOLD_Scan_Done` enum('yes','partial','no') DEFAULT NULL,
ADD COLUMN  `fieldmapBOLD_number_attempts` varchar(255) DEFAULT NULL,
ADD COLUMN  `fieldmapBOLD_comments` text,
ADD COLUMN  `t1_Scan_Done` enum('yes','partial','no') DEFAULT NULL,
ADD COLUMN  `t1_number_attempts` varchar(255) DEFAULT NULL,
ADD COLUMN  `t1_comments` text,
ADD COLUMN  `t2_Scan_Done` enum('yes','partial','no') DEFAULT NULL,
ADD COLUMN  `t2_number_attempts` varchar(255) DEFAULT NULL,
ADD COLUMN  `t2_comments` text,
ADD COLUMN  `fMRI_Scan_Done` enum('yes','partial','no') DEFAULT NULL,
ADD COLUMN  `fMRI_number_attempts` varchar(255) DEFAULT NULL,
ADD COLUMN  `fMRI_comments` text,
ADD COLUMN  `dwi25_Scan_Done` enum('yes','partial','no') DEFAULT NULL,
ADD COLUMN  `dwi25_number_attempts` varchar(255) DEFAULT NULL,
ADD COLUMN  `dwi25_comments` text,
ADD COLUMN  `dwi65_Scan_Done` enum('yes','partial','no') DEFAULT NULL,
ADD COLUMN  `dwi65_number_attempts` varchar(255) DEFAULT NULL,
ADD COLUMN  `dwi65_comments` text,
ADD COLUMN  `fieldmapDWI_Scan_Done` enum('yes','partial','no') DEFAULT NULL,
ADD COLUMN  `fieldmapDWI_number_attempts` varchar(255) DEFAULT NULL,
ADD COLUMN  `fieldmapDWI_comments` text;

UPDATE mri_parameter_form SET fieldmapBOLD_Scan_Done=(case FLOOR((RAND() * 3)) when 0 then 'yes' when 1 then 'partial' when 2 then 'no' end) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET t1_Scan_Done=(case FLOOR((RAND() * 3)) when 0 then 'yes' when 1 then 'partial' when 2 then 'no' end) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET t2_Scan_Done=(case FLOOR((RAND() * 3)) when 0 then 'yes' when 1 then 'partial' when 2 then 'no' end) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET fMRI_Scan_Done=(case FLOOR((RAND() * 3)) when 0 then 'yes' when 1 then 'partial' when 2 then 'no' end) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET dwi25_Scan_Done=(case FLOOR((RAND() * 3)) when 0 then 'yes' when 1 then 'partial' when 2 then 'no' end) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET dwi65_Scan_Done=(case FLOOR((RAND() * 3)) when 0 then 'yes' when 1 then 'partial' when 2 then 'no' end) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET fieldmapDWI_Scan_Done=(case FLOOR((RAND() * 3)) when 0 then 'yes' when 1 then 'partial' when 2 then 'no' end) WHERE Date_taken IS NOT NULL;


UPDATE mri_parameter_form SET fieldmapBOLD_number_attempts=(FLOOR((RAND() * 10))) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET t1_number_attempts=(FLOOR((RAND() * 10))) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET t2_number_attempts=(FLOOR((RAND() * 10))) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET fMRI_number_attempts=(FLOOR((RAND() * 10))) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET dwi25_number_attempts=(FLOOR((RAND() * 10))) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET dwi65_number_attempts=(FLOOR((RAND() * 10))) WHERE Date_taken IS NOT NULL;
UPDATE mri_parameter_form SET fieldmapDWI_number_attempts=(FLOOR((RAND() * 10))) WHERE Date_taken IS NOT NULL;
SET FOREIGN_KEY_CHECKS=1;
