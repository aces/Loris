-- Remove the 'url' configuration. The config is no longer used by LORIS, but overrides
-- or custom project modules may depend on it.
DELETE FROM Config WHERE ConfigID IN (Select ID FROM ConfigSettings WHERE Name='url');
DELETE FROM ConfigSettings WHERE Name='url';
