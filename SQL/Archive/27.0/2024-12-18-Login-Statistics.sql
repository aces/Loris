CREATE TABLE Login_Summary_Statistics (
    Title VARCHAR(255),
    Project VARCHAR(255),
    Value INT,
    QueryOrder INT,
     PRIMARY KEY (Title, Project)
);

ALTER TABLE dataquery_study_queries_rel
MODIFY COLUMN PinType enum('topquery','dashboard', 'loginpage') DEFAULT NULL;

ALTER TABLE Project
ADD COLUMN showSummaryOnLogin BOOLEAN DEFAULT TRUE;
