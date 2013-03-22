CREATE TABLE participant_status (
ID int(10) unsigned NOT NULL auto_increment,
CandID int(6) NOT NULL default '0',
UserID varchar(255) default NULL,
Examiner varchar(255) default NULL,
entry_staff varchar(255) default NULL,
data_entry_date timestamp(14) NOT NULL,
qn_2_participant_status enum('active','ineligible','dropout','decline') default NULL,
qn_3_dropout_ineligible_timing enum('1_before_visit','2_during_visit','3_after_visit','dnk','not_applicable','refusal','not_answered') default NULL,
qn_4_others_specify_text text default NULL,
qn_4_others_specify_text_not_answered enum('dnk','not_applicable','refusal','not_answered') default NULL,
qn_5_drop_out_reasons enum('1_voluntary_withdrawal','2_lost_follow_up','3_others') default NULL,
qn_5_others_specify_text text default NULL,
qn_5_others_specify_text_not_answered enum('dnk','not_applicable','refusal','not_answered') default NULL,
 PRIMARY KEY  (ID),
  UNIQUE KEY ID (ID) );




