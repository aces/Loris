ALTER TABLE session DROP COLUMN scan_done;

DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name="useScanDone");

DELETE FROM ConfigSettings WHERE Name='useScanDone';
