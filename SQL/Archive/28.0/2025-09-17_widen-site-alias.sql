-- Widen the site alias from 3 characters to 4 characters.
ALTER TABLE `psc` MODIFY COLUMN `Alias` char(4) NOT NULL DEFAULT '';
