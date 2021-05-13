ALTER TABLE participant_accounts DROP COLUMN Email;
DELETE FROM history WHERE tbl='participant_accounts' AND col='Email';
