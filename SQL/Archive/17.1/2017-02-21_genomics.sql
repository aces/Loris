-- This can take quite a while to execute depending on the row count of the CNV table 
ALTER TABLE CNV ADD FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`);
