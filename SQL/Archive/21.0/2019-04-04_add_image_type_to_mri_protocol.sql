-- Add an image_type column to be used for scan identification 
-- in the mri_protocol and mri_protocol_violated_scans tables

ALTER TABLE mri_protocol 
  ADD COLUMN `image_type` varchar(255) default NULL;

ALTER TABLE mri_protocol_violated_scans
  ADD COLUMN `image_type` varchar(255) default NULL;
