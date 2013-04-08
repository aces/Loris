CREATE TABLE participant_status_options (
ID int(10) unsigned NOT NULL auto_increment,
Description varchar(255) default NULL,
 PRIMARY KEY  (ID),
  UNIQUE KEY ID (ID) );
 

INSERT INTO participant_status_options (Description) VALUES ('active');
INSERT INTO participant_status_options (Description) VALUES ('ineligible');
INSERT INTO participant_status_options (Description) VALUES ('dropout');
INSERT INTO participant_status_options (Description) VALUES ('death');
INSERT INTO participant_status_options (Description) VALUES ('others');
