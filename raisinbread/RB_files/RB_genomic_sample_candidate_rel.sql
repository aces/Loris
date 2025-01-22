SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `genomic_sample_candidate_rel`;
LOCK TABLES `genomic_sample_candidate_rel` WRITE;
INSERT INTO `genomic_sample_candidate_rel` (`sample_label`, `CandID`) VALUES ('sl573847',300165);
INSERT INTO `genomic_sample_candidate_rel` (`sample_label`, `CandID`) VALUES ('sl573848',300165);
INSERT INTO `genomic_sample_candidate_rel` (`sample_label`, `CandID`) VALUES ('sl573851',300162);
INSERT INTO `genomic_sample_candidate_rel` (`sample_label`, `CandID`) VALUES ('sl573852',300139);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
