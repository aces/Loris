-- Create 'Download' operation notification for 'publication' module
INSERT INTO notification_modules (module_name, operation_type, as_admin, template_file, description)
VALUES ('publication', 'download', 'N', 'notifier_publication_download.tpl', 'Publication: File Downloaded');

-- Create permission_rels -- Use same as publication/edit
INSERT INTO notification_modules_perm_rel (notification_module_id, perm_id)
    SELECT nm.id, nmpr.perm_id
    FROM notification_modules AS nm
    JOIN notification_modules_perm_rel AS nmpr
    ON notification_module_id = (
        SELECT id
        FROM notification_modules
        WHERE module_name = 'publication'
        AND operation_type = 'edit'
    )
    WHERE module_name = 'publication'
    AND operation_type = 'download'

-- Create service_rel (email_text) -- Derive from publication/edit
INSERT INTO notification_modules_services_rel (module_id, service_id)
SELECT nm.id, nmsr.service_id
FROM notification_modules AS nm
    JOIN notification_modules_services_rel AS nmsr
    ON module_id = (
      SELECT id
      FROM notification_modules
      WHERE module_name = 'publication'
        AND operation_type = 'edit'
    )
WHERE module_name = 'publication'
AND operation_type = 'download'
