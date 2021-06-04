CREATE TABLE `dqt_queries` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `hash` char(40) NOT NULL,
  `content` text NOT NULL,
  `creator` int(10) unsigned NOT NULL,
  `creation_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`creator`, `hash`),
  KEY `U_dqt_queries_1` (`id`),
  KEY `FK_dqt_queries_1` (`creator`),
  CONSTRAINT `FK_dqt_queries_1` FOREIGN KEY (`creator`) REFERENCES `users` (`ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `dqt_shared_queries` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `shared_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`shared_id`),
  KEY `U_dqt_shared_queries_1` (`id`),
  CONSTRAINT `FK_dqt_shared_queries_1` FOREIGN KEY (`shared_id`) REFERENCES `dqt_queries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
