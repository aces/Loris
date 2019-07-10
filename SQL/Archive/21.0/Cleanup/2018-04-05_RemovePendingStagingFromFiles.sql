-- Remove the PendingStaging field from the files table as discussed during
-- the LORIS imaging meeting of February 2nd, 2018
ALTER TABLE files
  DROP KEY staging_filetype_outputtype,
  DROP COLUMN PendingStaging;