ALTER TABLE psc MODIFY `PSCArea` varchar(150);
ALTER TABLE psc MODIFY `Address` varchar(150);
ALTER TABLE psc MODIFY `City` varchar(150);
ALTER TABLE psc MODIFY `StateID` tinyint(2) unsigned;
ALTER TABLE psc MODIFY `ZIP` varchar(12);
ALTER TABLE psc MODIFY `Phone1` varchar(12);
ALTER TABLE psc MODIFY `Phone2` varchar(12);
ALTER TABLE psc MODIFY `Contact1` varchar(150);
ALTER TABLE psc MODIFY `Contact2` varchar(150);
ALTER TABLE psc MODIFY `Account` varchar(8);
ALTER TABLE psc MODIFY `Study_site` enum('N','Y') default 'Y';

