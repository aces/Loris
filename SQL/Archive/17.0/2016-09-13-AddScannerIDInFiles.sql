-- Add ScannerCandID column to files, back-populate the newly added column, then add foreign key constraints 
-- NOTE: back-populating assumes that currently the candID used for phantoms is that of the scanner
ALTER TABLE files ADD `ScannerCandID` int(11) DEFAULT NULL;
UPDATE files f SET f.ScannerCandID=(SELECT s.CandID FROM session s WHERE s.ID=f.SessionID);
ALTER TABLE files ADD CONSTRAINT `files_scannerID_fk` FOREIGN KEY (`ScannerCandID`) REFERENCES mri_scanner (`CandID`);
