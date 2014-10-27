CREATE TABLE files_qcstatus (
    FileQCID int(11) PRIMARY KEY auto_increment,
    FileID int(11) UNIQUE NULL,
    SeriesUID varchar(64) UNIQUE NULL,
    QCStatus enum('Pass', 'Fail'),
    QCFirstChangeTime int(10) unsigned,
    QCLastChangeTime int(10) unsigned
);
