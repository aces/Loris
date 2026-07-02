ALTER TABLE issues_attachments ADD COLUMN `date_deleted` timestamp NULL DEFAULT NULL;

UPDATE issues_attachments
SET date_deleted = '1999-12-31 00:00:00'
WHERE deleted = 1;

ALTER TABLE issues_attachments DROP COLUMN deleted;
