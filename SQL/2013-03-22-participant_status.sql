CREATE TABLE participant_status (
        ID int(10) unsigned NOT NULL auto_increment,
        CandID int(6) NOT NULL default '0',
        UserID varchar(255) default NULL,
        Examiner varchar(255) default NULL,
        entry_staff varchar(255) default NULL,
        data_entry_date timestamp NOT NULL,
        participant_status int(6) default NULL,
        ineligible_others_specify text default NULL,
        ineligible_others_specify_not_answered enum('dnk','not_applicable','refusal','not_answered') default NULL,
        drop_out_reasons enum('1_voluntary_withdrawal','2_lost_follow_up','3_others') default NULL,
        drop_out_reasons_others_specify text default NULL,
        drop_out_reasons_others_specify_not_answered enum('dnk','not_applicable','refusal','not_answered') default NULL,
        `other_reasons` text,
        `other_reasons_not_answered` enum('dnk','not_applicable','refusal','not_answered') DEFAULT NULL,
        PRIMARY KEY  (ID),
        UNIQUE KEY ID (ID) );

