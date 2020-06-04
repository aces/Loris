-- Add ScannerCandID column to files, back-populate the newly added column from parameter_file table, then add foreign key constraints 
ALTER TABLE files ADD `ScannerID` int(10) unsigned default NULL;
CREATE TEMPORARY TABLE ScannerIDs AS SELECT pf.FileID, pf.Value AS ScannerID FROM parameter_file AS pf LEFT JOIN parameter_type AS pt ON pf.ParameterTypeID=pt.ParameterTypeID WHERE pt.Name='ScannerID';
UPDATE files AS f, ScannerIDs AS S SET f.ScannerID=S.ScannerID where f.FileID=S.FileID;
ALTER TABLE files ADD CONSTRAINT `FK_files_scannerID` FOREIGN KEY (`ScannerID`) REFERENCES mri_scanner (`ID`);
