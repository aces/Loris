ALTER TABLE tarchive_files ADD `TarchiveSeriesID` INT(11) DEFAULT NULL;
ALTER TABLE tarchive_files ADD CONSTRAINT `tarchive_files_TarchiveSeriesID_fk` FOREIGN KEY (`TarchiveSeriesID`) REFERENCES tarchive_series(`TarchiveSeriesID`);
