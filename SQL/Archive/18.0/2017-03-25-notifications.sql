-- ad phone to users
ALTER TABLE users ADD COLUMN `Phone` varchar(15) default NULL;

-- Associates modules with the service available for each
CREATE TABLE `notification_modules` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `module_name` varchar(100) NOT NULL,
      `operation_type` varchar(100) NOT NULL,
      `as_admin` enum('Y','N') NOT NULL DEFAULT 'N',
      `template_file` varchar(100) NOT NULL,
      `description` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY (`module_name`),
      UNIQUE(module_name,operation_type)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Associates modules with the service available for each
CREATE TABLE `notification_services` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `service` VARCHAR(50) NOT NULL,
      PRIMARY KEY (`id`),
      UNIQUE(service)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- saves users preferences for notification type
CREATE TABLE `notification_modules_services_rel` (
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      PRIMARY KEY (`module_id`,`service_id`),
      KEY `FK_notification_modules_services_rel_1` (`module_id`),
      KEY `FK_notification_modules_services_rel_2` (`service_id`),
      CONSTRAINT `FK_notification_modules_services_rel_1` FOREIGN KEY (`module_id`) REFERENCES `notification_modules` (`id`),
      CONSTRAINT `FK_notification_modules_services_rel_2` FOREIGN KEY (`service_id`) REFERENCES `notification_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- saves users preferences for notification type
CREATE TABLE `users_notifications_rel` (
      `user_id` int(10) unsigned NOT NULL,
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      PRIMARY KEY (`user_id`,`module_id`,`service_id`),
      KEY `FK_notifications_users_rel_1` (`user_id`),
      KEY `FK_notifications_users_rel_2` (`module_id`),
      KEY `FK_notifications_users_rel_3` (`service_id`),
      CONSTRAINT `FK_notifications_users_rel_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`),
      CONSTRAINT `FK_notifications_users_rel_2` FOREIGN KEY (`module_id`) REFERENCES `notification_modules` (`id`),
      CONSTRAINT `FK_notifications_users_rel_3` FOREIGN KEY (`service_id`) REFERENCES `notification_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- history log
CREATE TABLE `notification_history` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      `date_sent` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `trigger_user` int(10) unsigned NOT NULL,
      `target_user` int(10) unsigned NOT NULL,
      PRIMARY KEY (`id`),
      KEY `FK_notification_history_1` (`trigger_user`),
      KEY `FK_notification_history_2` (`target_user`),
      CONSTRAINT `FK_notification_history_1` FOREIGN KEY (`trigger_user`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE ,
      CONSTRAINT `FK_notification_history_2` FOREIGN KEY (`target_user`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- basic notification service
INSERT INTO notification_services (service) VALUES
('email_text');

-- Pre-implemented notifications
INSERT INTO notification_modules (module_name, operation_type, as_admin, template_file, description) VALUES
  ('media', 'upload', 'N', 'notifier_media_upload.tpl', 'Media: New File Uploaded'),
  ('media', 'download', 'N', 'notifier_media_download.tpl', 'Media: File Downloaded'),
  ('document_repository', 'new_category', 'N', 'notifier_document_repository_new_category.tpl', 'Document Repository: New Category'),
  ('document_repository', 'upload', 'N', 'notifier_document_repository_upload.tpl', 'Document Repository: New Document Uploaded'),
  ('document_repository', 'delete', 'N', 'notifier_document_repository_delete.tpl', 'Document Repository: Document Deleted'),
  ('document_repository', 'edit', 'N', 'notifier_document_repository_edit.tpl', 'Document Repository: Document Edited');

-- enable doc repo basic text emails
INSERT INTO notification_modules_services_rel SELECT nm.id, ns.id FROM notification_modules nm JOIN notification_services ns WHERE nm.module_name='document_repository' AND ns.service='email_text';

-- Transfer Document repository notifications to new system
INSERT INTO users_notifications_rel SELECT u.ID, nm.id, ns.id FROM users u JOIN notification_modules nm JOIN notification_services ns WHERE nm.module_name='document_repository' AND ns.service='email_text' AND u.Doc_Repo_Notifications='Y';

-- permissions for each notification module
CREATE TABLE `notification_modules_perm_rel` (
      `notification_module_id` int(10) unsigned NOT NULL,
      `perm_id` int(10) unsigned NOT NULL default '0',
      CONSTRAINT `FK_notification_modules_perm_rel_1` FOREIGN KEY (`notification_module_id`) REFERENCES `notification_modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT `FK_notification_modules_perm_rel_2` FOREIGN KEY (`perm_id`) REFERENCES `permissions` (`permID`) ON DELETE CASCADE ON UPDATE CASCADE,
      PRIMARY KEY (`notification_module_id`,`perm_id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- populate notification perm table
INSERT INTO notification_modules_perm_rel SELECT nm.id, p.permID FROM notification_modules nm JOIN permissions p WHERE nm.module_name='media' AND (p.code='media_write' OR p.code='media_read');
INSERT INTO notification_modules_perm_rel SELECT nm.id, p.permID FROM notification_modules nm JOIN permissions p WHERE nm.module_name='document_repository' AND (p.code='document_repository_view' OR p.code='document_repository_delete');
