ALTER TABLE test_battery CHANGE firstVisit firstVisit enum('Y','N') DEFAULT NULL;
UPDATE test_battery SET firstVisit = NULL Where firstVisit = 'N';
