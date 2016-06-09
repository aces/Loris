ALTER TABLE mri_upload CHANGE `Processed` `InsertionComplete` tinyint(1) NOT NULL DEFAULT '0';
ALTER TABLE mri_upload CHANGE `CurrentlyProcessed` `Inserting` tinyint(1) NOT NULL DEFAULT '0';
