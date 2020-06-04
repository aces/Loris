-- Change the type of mri_protocol_checks' ValidMin and ValidMax columns to be decimals 
-- instead of INT as these columns can contain decimal values.
ALTER TABLE mri_protocol_checks CHANGE `ValidMin` `ValidMin` decimal(10,4) DEFAULT NULL;
ALTER TABLE mri_protocol_checks CHANGE `ValidMax` `ValidMax` decimal(10,4) DEFAULT NULL;
