SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `genomic_cpg`;
LOCK TABLES `genomic_cpg` WRITE;
INSERT INTO `genomic_cpg` (`sample_label`, `cpg_name`, `beta_value`) VALUES ('sl573847','CPG_573847',1.000);
INSERT INTO `genomic_cpg` (`sample_label`, `cpg_name`, `beta_value`) VALUES ('sl573848','CPG_573848',1.000);
INSERT INTO `genomic_cpg` (`sample_label`, `cpg_name`, `beta_value`) VALUES ('sl573851','CPG_573851',1.000);
INSERT INTO `genomic_cpg` (`sample_label`, `cpg_name`, `beta_value`) VALUES ('sl573852','CPG_573852',1.000);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
