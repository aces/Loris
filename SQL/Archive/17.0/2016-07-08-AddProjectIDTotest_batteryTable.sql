ALTER TABLE test_battery ADD `ProjectID` int(11) DEFAULT NULL;
ALTER TABLE test_battery ADD FOREIGN KEY (`project_ProjectID`) REFERENCES project(`ProjectID`);
