UPDATE `test_battery` SET `DoubleDataEntryEnabled`='N' WHERE `DoubleDataEntryEnabled` IS NULL;
ALTER TABLE `test_battery` MODIFY `DoubleDataEntryEnabled` enum('Y','N') NOT NULL DEFAULT 'N';
