SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE mri_parameter_form WRITE;
TRUNCATE TABLE mri_parameter_form;
LOAD DATA LOCAL INFILE 'mri_parameter_form.tsv' INTO TABLE mri_parameter_form
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
