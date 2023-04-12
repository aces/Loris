DELETE FROM Config WHERE ConfigID IN (SELECT ID FROM ConfigSettings WHERE Name='css');
DELETE FROM ConfigSettings WHERE Name='css';

DELETE FROM Config WHERE ConfigID IN (SELECT ID FROM ConfigSettings WHERE Name='rowsPerPage');
DELETE FROM ConfigSettings WHERE Name='rowsPerPage';
