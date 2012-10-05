CREATE TABLE data_integrity_flag (
dataflag_id INT NOT NULL AUTO_INCREMENT,
dataflag_visitlabel VARCHAR (255) NOT NULL,
dataflag_instrument VARCHAR (255) NOT NULL,
dataflag_date       DATE NOT NULL,
dataflag_status     INT NOT NULL,
dataflag_comment    TEXT NULL,
dataflag_dc_open_feedback INT NOT NULL,
latest_entry TINYINT(1) NOT NULL DEFAULT 1,
PRIMARY KEY (dataflag_id)
);
