CREATE INDEX SessionSubproject ON session (SubprojectID);
CREATE INDEX SessionActive ON session (Active);
CREATE INDEX CandidateActive ON candidate (Active);

CREATE INDEX FeedbackCandidate ON feedback_bvl_thread (CandID);

CREATE INDEX CandidateCenterID ON candidate (CenterID);
CREATE INDEX SessionCenterID ON session(CenterID);
