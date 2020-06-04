DELETE FROM media USING media, media m1 
  WHERE media.date_uploaded < m1.date_uploaded AND media.file_name = m1.file_name;

ALTER TABLE `media`
ADD UNIQUE INDEX `file_name` (`file_name`);
