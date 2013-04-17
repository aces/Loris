CREATE TABLE participant_status_options (
        ID int(10) unsigned NOT NULL auto_increment,
        Description varchar(255) default NULL,
        Required boolean default NULL,
        PRIMARY KEY  (ID),
        UNIQUE KEY ID (ID) );


INSERT INTO participant_status_options (Description, Required) VALUES ('active', false);
INSERT INTO participant_status_options (Description, Required) VALUES ('ineligible', true);
INSERT INTO participant_status_options (Description, Required) VALUES ('withdrawal', true);
INSERT INTO participant_status_options (Description, Required) VALUES ('death', false);
INSERT INTO participant_status_options (Description, Required) VALUES ('other', true);
