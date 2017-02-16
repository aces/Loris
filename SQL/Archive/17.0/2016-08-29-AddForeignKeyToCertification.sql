ALTER TABLE `certification` MODIFY `testID` int(10) UNSIGNED NOT NULL;

ALTER TABLE `certification` ADD CONSTRAINT `FK_certification` FOREIGN KEY (`testID`) REFERENCES `test_names` (`ID`);