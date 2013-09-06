CREATE TABLE participant_accounts(
    ID integer unsigned not null auto_increment PRIMARY KEY,
    SessionID int(6),
    Test_name varchar(255),
    Email varchar(255),
    Complete enum('Yes', 'No'),
    OneTimePassword varchar(8) 
);
