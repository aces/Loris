CREATE TABLE permissions_category (
    ID int(10) not null AUTO_INCREMENT,
    Description varchar(255) not null,
    PRIMARY KEY(`ID`)
);

REPLACE INTO permissions_category VALUES (1, 'Roles');
REPLACE INTO permissions_category VALUES (2, 'Permission');


ALTER TABLE permissions ADD COLUMN categoryID int(10) REFERENCES permissions_category(ID);

UPDATE permissions SET categoryID=1 WHERE type='role';
UPDATE permissions SET categoryID=2 WHERE type='permission';

-- You should run this once you're sure everything works.
-- ALTER TABLE permissions DROP COLUMN type;
