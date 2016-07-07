ALTER TABLE test_battery ADD `ProjectID` int(11) DEFAULT NULL;
ALTER TABLE test_battery ADD FOREIGN KEY (`Project_ProjectID`) REFERENCES Project(`ProjectID`);
