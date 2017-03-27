ALTER TABLE issues DROP FOREIGN KEY `fk_issues_5`;
ALTER TABLE issues ADD CONSTRAINT `fk_issues_5` FOREIGN KEY (`centerID`) REFERENCES `psc` (`CenterID`);
