SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `candidate_consent_rel`;
LOCK TABLES `candidate_consent_rel` WRITE;
INSERT INTO `candidate_consent_rel` (`CandidateID`, `ConsentID`, `Status`, `DateGiven`, `DateWithdrawn`) VALUES ('587630', 1, 'no', '2015-12-31', '2015-12-31');
INSERT INTO `candidate_consent_rel` (`CandidateID`, `ConsentID`, `Status`, `DateGiven`, `DateWithdrawn`) VALUES ('300001', 1, 'yes', '2015-12-31', NULL);
UNLOCK TABLES;
INSERT INTO `candidate_consent_rel` (`CandidateID`, `ConsentID`, `Status`, `DateGiven`, `DateWithdrawn`) VALUES ('300005', 1, 'yes', '2015-10-30', NULL);
SET FOREIGN_KEY_CHECKS=1;
