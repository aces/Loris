CREATE TABLE `permission_categories` (
 `id` INTEGER unsigned NOT NULL AUTO_INCREMENT,
 `category` varchar(255),
 `label` varchar(255),
 PRIMARY KEY (`id`),
 UNIQUE KEY `category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `permission_categories_permissions_rel` (
  `permission_category_id` INTEGER unsigned NOT NULL,
  `permission_id` INTEGER unsigned NOT NULL,
  PRIMARY KEY  (`permission_category_id`,`permission_id`),
  CONSTRAINT `FK_permission_categories_permissions_rel_1` FOREIGN KEY (`permission_category_id`) REFERENCES `permission_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_permission_categories_permissions_rel_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users_permission_categories_rel` (
  `user_id` INTEGER unsigned NOT NULL,
  `permission_category_id` INTEGER unsigned NOT NULL,
  PRIMARY KEY  (`user_id`,`permission_category_id`),
  CONSTRAINT `FK_permission_category_rel_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_permission_category_rel_2` FOREIGN KEY (`permission_category_id`) REFERENCES `permission_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;