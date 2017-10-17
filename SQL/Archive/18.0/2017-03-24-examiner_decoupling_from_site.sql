CREATE TABLE `examiners_psc_rel` (
  `examinerID` int(10) unsigned NOT NULL,
  `centerID` tinyint(2) unsigned NOT NULL,
  `active` enum('Y','N') NOT NULL DEFAULT 'Y',
  `pending_approval` enum('Y','N') NOT NULL DEFAULT 'N',
  PRIMARY KEY  (`examinerID`,`centerID`),
  KEY `FK_examiners_psc_rel_2` (`centerID`),
  CONSTRAINT `FK_examiners_psc_rel_1` FOREIGN KEY (`examinerID`) REFERENCES `examiners` (`examinerID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_examiners_psc_rel_2` FOREIGN KEY (`centerID`) REFERENCES `psc` (`CenterID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SELECT "Creating copy of `examiners` table as `examiners_17_0`" as 'Examiners';
CREATE TABLE examiners_17_0 LIKE examiners;
INSERT examiners_17_0 SELECT * FROM examiners;

-- CLEAN-UP
UPDATE examiners SET full_name = TRIM(full_name);
UPDATE examiners SET radiologist=0 WHERE radiologist IS NULL OR radiologist='';
ALTER TABLE examiners MODIFY COLUMN `radiologist` tinyint(1) NOT NULL DEFAULT 0;



-- NEW COLUMN
ALTER TABLE examiners ADD COLUMN `userID` int(10) unsigned;
ALTER TABLE examiners ADD CONSTRAINT `FK_examiners_2` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ** WARNING: The next lines will DROP column CenterID from the users table **
-- CLEAN-UP
-- ALTER TABLE examiners DROP FOREIGN KEY FK_examiners_1;
-- ALTER TABLE examiners DROP INDEX full_name;
-- ALTER TABLE examiners DROP KEY FK_examiners_1;
-- ALTER TABLE examiners DROP COLUMN `CenterID`;
-- ALTER TABLE examiners DROP COLUMN `active`;
-- ALTER TABLE examiners DROP COLUMN `pending_approval`;

-- ALTER TABLE certification ADD CONSTRAINT `FK_certifcation_2` FOREIGN KEY (`examinerID`) REFERENCES `examiners` (`examinerID`);
-- ALTER TABLE examiners ADD CONSTRAINT `U_examiners_1` UNIQUE KEY `full_name` (`full_name`);
-- UPDATE examiners SET full_name=REPLACE(full_name, '   ', ' ');
-- UPDATE examiners SET full_name=REPLACE(full_name, '  ', ' ');
-- UPDATE examiners e SET full_name=IFNULL((SELECT Real_name FROM users WHERE LOWER(TRIM(Real_name))=LOWER(e.full_name) AND pending_approval='N' LIMIT 1), e.full_name);
-- UPDATE examiners e SET e.userID=(SELECT ID FROM users WHERE TRIM(Real_name)=e.full_name AND pending_approval='N' LIMIT 1);

