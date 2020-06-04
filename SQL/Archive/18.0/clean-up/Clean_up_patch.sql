-- 2016-11-21-CreateUserSitesRelTable.sql
ALTER TABLE users DROP foreign key FK_users_1;
ALTER TABLE users DROP column `CenterID`;

-- 2017-03-24-examiner_decoupling_from_site.sql
ALTER TABLE examiners DROP FOREIGN KEY FK_examiners_1;

ALTER TABLE examiners DROP INDEX full_name;

ALTER TABLE examiners DROP KEY FK_examiners_1;

ALTER TABLE examiners DROP COLUMN `CenterID`;

ALTER TABLE examiners DROP COLUMN `active`;

ALTER TABLE examiners DROP COLUMN `pending_approval`;


ALTER TABLE certification ADD CONSTRAINT `FK_certifcation_2` FOREIGN KEY (`examinerID`) REFERENCES `examiners` (`examinerID`);

ALTER TABLE examiners ADD CONSTRAINT `U_examiners_1` UNIQUE KEY `full_name` (`full_name`);

UPDATE examiners SET full_name=REPLACE(full_name, '   ', ' ');
UPDATE examiners SET full_name=REPLACE(full_name, '  ', ' ');
UPDATE examiners e SET full_name=IFNULL((SELECT Real_name FROM users WHERE LOWER(TRIM(Real_name))=LOWER(e.full_name) AND pending_approval='N' LIMIT 1), e.full_name);

UPDATE examiners e SET e.userID=(SELECT ID FROM users WHERE TRIM(Real_name)=e.full_name AND pending_approval='N' LIMIT 1);



