SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `mri_protocol`;
LOCK TABLES `mri_protocol` WRITE;
INSERT INTO `mri_protocol` (`ID`, `Center_name`, `ScannerID`, `Scan_type`, `TR_min`, `TR_max`,`TE_min`, `TE_max`, `TI_min`,`TI_max`, `series_description_regex`) VALUES (1000,'ZZZZ',9,48,'8000','14000','80','130','0','200',NULL);
INSERT INTO `mri_protocol` (`ID`, `Center_name`, `ScannerID`, `Scan_type`, `TR_min`, `TR_max`,`TE_min`, `TE_max`, `TI_min`,`TI_max`, `series_description_regex`) VALUES (1001,'ZZZZ',9,40,'1900','2700','10','30','0','500',NULL);
INSERT INTO `mri_protocol` (`ID`, `Center_name`, `ScannerID`, `Scan_type`, `TR_min`, `TR_max`,`TE_min`, `TE_max`, `TI_min`,`TI_max`, `series_description_regex`) VALUES (1002,'ZZZZ',9,44,'2000','2500','2','5',NULL,NULL,NULL);
INSERT INTO `mri_protocol` (`ID`, `Center_name`, `ScannerID`, `Scan_type`, `TR_min`, `TR_max`,`TE_min`, `TE_max`, `TI_min`,`TI_max`, `series_description_regex`) VALUES (1003,'ZZZZ',9,45,'3000','9000','100','550',NULL,NULL,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
