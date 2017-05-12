-- Add the after to make sure that the column order are the same
ALTER TABLE genomic_files ADD COLUMN `couchdb_doc_id` varchar(255) DEFAULT NULL;
CREATE TABLE fileset ( `fileset_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `origin` varchar(255), `timestamp_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`fileset_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- Add the after to make sure that the column order are the same
ALTER TABLE genomic_files ADD COLUMN `fileset_id` INT UNSIGNED DEFAULT NULL;
ALTER TABLE genomic_files ADD CONSTRAINT `genomic_files_ibfk_2` FOREIGN KEY (`fileset_id`) REFERENCES `fileset` (`fileset_id`);
-- Add the foreign key between genomic_files.format and genomic_file_format ('Sample Sheet' , 'Dataframe', 'Matrix', 'Variable Annotations')
