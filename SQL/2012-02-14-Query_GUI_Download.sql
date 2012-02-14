CREATE TABLE query_gui_user_files (
    UserFileID integer auto_increment primary key,
    UserID integer REFERENCES users(ID),
    filename varchar(255),
    downloadDate timestamp DEFAULT CURRENT_TIMESTAMP,
    md5sum varchar(32),
    status enum('ready', 'packaging', 'expired')
);
