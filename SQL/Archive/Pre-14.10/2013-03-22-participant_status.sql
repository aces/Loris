CREATE TABLE participant_status (
        ID int(10) unsigned NOT NULL auto_increment,
        CandID int(6) UNIQUE NOT NULL default '0',
        UserID varchar(255) default NULL,
        Examiner varchar(255) default NULL,
        entry_staff varchar(255) default NULL,
        data_entry_date timestamp NOT NULL,
        participant_status integer DEFAULT NULL REFERENCES participant_status_options(ID),
        reason_specify text default NULL,
        reason_specify_status enum('dnk','not_applicable','refusal','not_answered') default NULL,
        withdrawal_reasons enum('1_voluntary_withdrawal','2_lost_follow_up','3_other') default NULL,
        withdrawal_reasons_other_specify text default NULL,
        withdrawal_reasons_other_specify_status enum('dnk','not_applicable','refusal','not_answered') default NULL,
        PRIMARY KEY  (ID),
        UNIQUE KEY ID (ID) );

