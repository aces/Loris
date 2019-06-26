SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `mri_violations_log`;
LOCK TABLES `mri_violations_log` WRITE;
INSERT INTO `mri_violations_log` (`LogID`, `TimeRun`, `SeriesUID`, `TarchiveID`, `MincFile`, `PatientName`, `CandID`, `Visit_label`, `CheckID`, `Scan_type`, `Severity`, `Header`, `Value`, `ValidRange`, `ValidRegex`) VALUES (1,'2016-08-15 19:06:21','1.3.12.2.1107.5.2.32.35182.2011081518290483992141556.0.0.0',17,'assembly/300135/V1/mri/native/loris_300135_V1_t1_001.mnc','MTL135_300135_V1',300135,'V1',NULL,44,'warning','Manual Caveat Set by admin',NULL,NULL,NULL);
INSERT INTO `mri_violations_log` (`LogID`, `TimeRun`, `SeriesUID`, `TarchiveID`, `MincFile`, `PatientName`, `CandID`, `Visit_label`, `CheckID`, `Scan_type`, `Severity`, `Header`, `Value`, `ValidRange`, `ValidRegex`) VALUES (2,'2016-08-15 19:06:56','1.3.12.2.1107.5.2.32.35182.2011081518290483992141556.0.0.0',17,'assembly/300135/V1/mri/native/loris_300135_V1_t1_001.mnc','MTL135_300135_V1',300135,'V1',NULL,44,'warning','Manual Caveat Set by admin',NULL,NULL,NULL);
INSERT INTO `mri_violations_log` (`LogID`, `TimeRun`, `SeriesUID`, `TarchiveID`, `MincFile`, `PatientName`, `CandID`, `Visit_label`, `CheckID`, `Scan_type`, `Severity`, `Header`, `Value`, `ValidRange`, `ValidRegex`) VALUES (3,'2016-08-15 19:06:58','1.3.12.2.1107.5.2.32.35182.2011081518290483992141556.0.0.0',17,'assembly/300135/V1/mri/native/loris_300135_V1_t1_001.mnc','MTL135_300135_V1',300135,'V1',NULL,44,'warning','Manual Caveat Set by admin',NULL,NULL,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
