SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `candidate_consent_rel`;
LOCK TABLES `candidate_consent_rel` WRITE;
INSERT INTO `candidate_consent_rel` (`CandidateID`, `ConsentID`, `Status`, `DateGiven`, `DateWithdrawn`) VALUES (162,1,'yes','2015-12-31',NULL);
INSERT INTO `candidate_consent_rel` (`CandidateID`, `ConsentID`, `Status`, `DateGiven`, `DateWithdrawn`) VALUES (166,1,'yes','2015-10-30',NULL);
INSERT INTO `candidate_consent_rel` (`CandidateID`, `ConsentID`, `Status`, `DateGiven`, `DateWithdrawn`) VALUES (1004,1,'no','2015-12-31','2015-12-31');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
