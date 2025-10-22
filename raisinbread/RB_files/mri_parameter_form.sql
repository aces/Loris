SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE mri_parameter_form;
LOCK TABLE mri_parameter_form WRITE;
LOAD DATA LOCAL INFILE 'mri_parameter_form.tsv' INTO TABLE mri_parameter_form
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
