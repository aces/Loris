-- Renames media_write front display name.
ALTER TABLE
    `permissions`
MODIFY COLUMN
    `action` enum(
        'View',
        'Create',
        'Edit',
        'Download',
        'Upload',
        'Delete',
        'View/Create',
        'View/Edit',
        'View/Download',
        'View/Upload',
        'View/Create/Edit',
        'Create/Edit',
        'Edit/Upload',
        'Edit/Upload/Delete',
        'Edit/Upload/Hide'
    )
AFTER `moduleID`;

UPDATE
    `permissions`
SET
    `action` = 'Edit/Upload/Hide'
WHERE
    `code` = 'media_write';
