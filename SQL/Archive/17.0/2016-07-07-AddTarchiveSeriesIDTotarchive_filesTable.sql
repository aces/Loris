ALTER TABLE tarchive_files ADD `TarchiveSeriesID` INT(11) DEFAULT NULL;
ALTER TABLE tarchive_files ADD FOREIGN KEY (`tarchive_series_TarchiveSeriesID`) REFERENCES tarchive_series(`TarchiveSeriesID`);
