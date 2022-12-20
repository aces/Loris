CREATE TABLE `testnames_permissions_rel` (
    `TestID` int(10) unsigned NOT NULL,
    `permID` int(10) unsigned NOT NULL,
    PRIMARY KEY  (`TestID`,`permID`),
    CONSTRAINT `FK_testnames_permissions_rel_test` FOREIGN KEY (`TestID`) REFERENCES `test_names` (`ID`),
    CONSTRAINT `FK_testnames_permissions_rel_perm` FOREIGN KEY (`permID`) REFERENCES `permissions` (`permID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
