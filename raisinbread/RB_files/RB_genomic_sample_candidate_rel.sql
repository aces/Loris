SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `genomic_sample_candidate_rel`;
LOCK TABLES `genomic_sample_candidate_rel` WRITE;
INSERT INTO `genomic_sample_candidate_rel` (`sample_label`, `CandidateID`) VALUES ('sl573847',326);
INSERT INTO `genomic_sample_candidate_rel` (`sample_label`, `CandidateID`) VALUES ('sl573848',326);
INSERT INTO `genomic_sample_candidate_rel` (`sample_label`, `CandidateID`) VALUES ('sl573851',323);
INSERT INTO `genomic_sample_candidate_rel` (`sample_label`, `CandidateID`) VALUES ('sl573852',300);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
