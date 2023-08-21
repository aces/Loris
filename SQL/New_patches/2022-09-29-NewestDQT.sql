CREATE TABLE dataquery_queries (
    QueryID int(10) unsigned NOT NULL AUTO_INCREMENT,
    Query JSON NOT NULL,
    PRIMARY KEY (QueryID)
    -- FOREIGN KEY (Owner) REFERENCES users(ID)
);

CREATE TABLE dataquery_query_names (
    QueryID int(10) unsigned NOT NULL,
    UserID int(10) unsigned NOT NULL,
    Name varchar(255) NOT NULL,
    PRIMARY KEY (QueryID, UserID),
    FOREIGN KEY (QueryID) REFERENCES dataquery_queries(QueryID),
    FOREIGN KEY (UserID) REFERENCES users(ID)
);

CREATE TABLE dataquery_run_queries (
    RunID int(10) unsigned NOT NULL AUTO_INCREMENT,
    QueryID int(10) unsigned,
    UserID int(10) unsigned,
    RunTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (RunID),
    FOREIGN KEY (QueryID) REFERENCES dataquery_queries(QueryID),
    FOREIGN KEY (UserID) REFERENCES users(ID)
);
CREATE TABLE dataquery_shared_queries_rel (
    QueryID int(10) unsigned,
    SharedBy int(10) unsigned,
    FOREIGN KEY (QueryID) REFERENCES dataquery_queries(QueryID),
    FOREIGN KEY (SharedBy) REFERENCES users(ID),
    CONSTRAINT unique_share UNIQUE (QueryID, SharedBy)
);

CREATE TABLE dataquery_starred_queries_rel (
    QueryID int(10) unsigned,
    StarredBy int(10) unsigned,
    FOREIGN KEY (QueryID) REFERENCES dataquery_queries(QueryID),
    FOREIGN KEY (StarredBy) REFERENCES users(ID),
    CONSTRAINT unique_pin UNIQUE (QueryID, StarredBy)
);

CREATE TABLE dataquery_run_results (
    RunID int(10) unsigned NOT NULL AUTO_INCREMENT,
    CandID int(6) NOT NULL,
    -- JSON or same format that's streamed in?
    RowData LONGTEXT DEFAULT NULL,

    PRIMARY KEY (RunID, CandID),
    FOREIGN KEY (CandID) REFERENCES candidate(CandID),
    FOREIGN KEY (RunID) REFERENCES dataquery_run_queries(RunID)
);

CREATE TABLE dataquery_study_queries_rel (
    QueryID int(10) unsigned,
    PinnedBy int(10) unsigned,
    -- A top query shows on the top of the dataquery tool similarly
    -- to a saved query but is chosen by admins, a dashboard query
    -- shows the number of matching results on the LORIS dashboard.
    Name varchar(255) NOT NULL,
    PinType enum('topquery', 'dashboard'),
    FOREIGN KEY (QueryID) REFERENCES dataquery_queries(QueryID),
    FOREIGN KEY (PinnedBy) REFERENCES users(ID),
    CONSTRAINT unique_pin UNIQUE (QueryID, PinType)
);

INSERT INTO modules (Name, Active) VALUES ('dataquery', 'Y');
