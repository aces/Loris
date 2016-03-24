DROP TABLE IF EXISTS `genomic_file_type_enum`;
CREATE TABLE `genomic_file_type_enum` (
  `genomic_file_type` varchar(100),
  PRIMARY KEY (`genomic_file_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 
COMMENT '';

INSERT IGNORE INTO `genomic_file_type_enum` (genomic_file_type) VALUES
('Methylation beta-values'),
('Other');

DROP TABLE IF EXISTS `genomic_file`;
CREATE TABLE `genomic_file` (
  `file_id` int unsigned NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `absolute_path` varchar(255) NOT NULL,
  `description` text NULL,
  `genomic_file_type` varchar(100) NOT NULL,
  `date_inserted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_inserted` varchar(255)  NOT NULL,
  `caveat` tinyint(1) NOT NULL DEFAULT 0,
  `notes` text NULL,
  PRIMARY KEY (`file_id`),
  FOREIGN KEY (genomic_file_type) 
    REFERENCES genomic_file_type_enum (genomic_file_type)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (user_inserted) 
    REFERENCES users (UserID)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT = '';
