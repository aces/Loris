DELETE TABLE IF EXISTS login_summary_statistics;
DELETE TABLE IF EXISTS Login_Summary_Statistics;
CREATE TABLE login_summary_statistics (
    Title VARCHAR(255),
    Project VARCHAR(255),
    Value INT,
    QueryOrder INT,
    PRIMARY KEY (Title, Project)
);