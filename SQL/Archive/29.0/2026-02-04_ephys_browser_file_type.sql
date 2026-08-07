CREATE TABLE `ephys_browser_file_type` (
  `Type` varchar(12) NOT NULL PRIMARY KEY,
  CONSTRAINT `FK_ephys_browser_file_type`
    FOREIGN KEY (`Type`)
    REFERENCES `ImagingFileTypes` (`type`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `ImagingFileTypes` (type, description) VALUES
  ('ctf', 'CTF data format (MEG)');

INSERT INTO `ephys_browser_file_type` (Type)
VALUES
  ('set'),
  ('bdf'),
  ('vhdr'),
  ('vsm'),
  ('edf'),
  ('cnt'),
  ('ctf'),
  ('archive');
