ALTER TABLE mri_protocol MODIFY ScannerID int(10) unsigned default NULL;
UPDATE mri_protocol SET ScannerID=NULL WHERE ScannerID=0;
