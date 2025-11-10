INSERT INTO notification_modules (module_name, operation_type, as_admin, template_file, description) VALUES
    ('issue_tracker', 'create/edit', 'N', 'issue_change.tpl', 'Notify for all issues created or edited');

INSERT INTO notification_modules_services_rel (module_id, service_id) VALUES
    ((SELECT id FROM notification_modules WHERE module_name='issue_tracker' AND operation_type='create/edit'), (SELECT id FROM notification_services WHERE service='email_text'));