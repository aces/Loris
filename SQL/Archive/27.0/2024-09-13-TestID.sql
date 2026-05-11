ALTER TABLE flag ADD COLUMN TestID int(10) unsigned AFTER test_name;
ALTER TABLE flag ADD CONSTRAINT FOREIGN KEY (TestID) REFERENCES test_names(ID);

UPDATE flag f SET TestID=(SELECT ID FROM test_names tn WHERE f.test_name=tn.test_name);

ALTER TABLE flag MODIFY COLUMN TestID int(10) unsigned NOT NULL;
