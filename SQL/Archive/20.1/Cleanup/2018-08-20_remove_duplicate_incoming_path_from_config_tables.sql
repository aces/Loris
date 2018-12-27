--
-- Removing the unused IncomingPath configuration setting
--

DELETE FROM Config
  WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='IncomingPath');

DELETE FROM ConfigSettings WHERE Name='IncomingPath';
