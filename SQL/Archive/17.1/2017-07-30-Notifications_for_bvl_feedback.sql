INSERT INTO notification_modules (module_name, operation_type, as_admin, template_file, description) VALUES
  ('bvl_feedback', 'new', 'N', 'notifier_bvl_feedback_new.tpl', 'Behavioural Feedback: New Feedback'),
  ('bvl_feedback', 'open', 'N', 'notifier_bvl_feedback_open.tpl', 'Behavioural Feedback: Feedback Opened'),
  ('bvl_feedback', 'close', 'N', 'notifier_bvl_feedback_close.tpl', 'Behavioural Feedback: Feedback Closed'),
  ('bvl_feedback', 'comment', 'N', 'notifier_bvl_feedback_Comment.tpl', 'Behavioural Feedback: New Comment');

INSERT INTO notification_modules_services_rel
SELECT nm.id, ns.id
    FROM notification_modules nm
        JOIN notification_services ns
    WHERE nm.module_name='bvl_feedback' AND ns.service='email_text';

INSERT INTO notification_modules_perm_rel
SELECT nm.id, p.permID
    FROM notification_modules nm
        JOIN permissions p
    WHERE nm.module_name='bvl_feedback' AND p.code='bvl_feedback';



