CREATE TABLE `ack_center_affiliation` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `centerId` tinyint(2) UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 NOT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `center_id_2` (`centerId`,`title`),
  CONSTRAINT `ack_center_affiliation_ibfk_1` FOREIGN KEY (`centerId`) REFERENCES `psc` (`CenterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ack_center_degree` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `centerId` tinyint(2) UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 NOT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `center_id_2` (`centerId`,`title`),
  CONSTRAINT `ack_center_degree_ibfk_1` FOREIGN KEY (`centerId`) REFERENCES `psc` (`CenterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ack_center_role` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `centerId` tinyint(2) UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 NOT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `center_id_2` (`centerId`,`title`),
  CONSTRAINT `ack_center_role_ibfk_1` FOREIGN KEY (`centerId`) REFERENCES `psc` (`CenterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `acknowledgement` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `centerId` tinyint(2) UNSIGNED NOT NULL,
  `fullName` varchar(255) CHARACTER SET utf8 NOT NULL,
  `citationName` varchar(255) CHARACTER SET utf8 NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `inStudyAtPresent` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `center_id` (`centerId`),
  CONSTRAINT `acknowledgement_ibfk_1` FOREIGN KEY (`centerId`) REFERENCES `psc` (`CenterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `acknowledgement_affiliation` (
  `acknowledgementId` bigint(20) UNSIGNED NOT NULL,
  `affiliationId` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`acknowledgementId`,`affiliationId`),
  KEY `acknowledgement_affiliation_ibfk_2` (`affiliationId`),
  CONSTRAINT `acknowledgement_affiliation_ibfk_1` FOREIGN KEY (`acknowledgementId`) REFERENCES `acknowledgement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `acknowledgement_affiliation_ibfk_2` FOREIGN KEY (`affiliationId`) REFERENCES `ack_center_affiliation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `acknowledgement_degree` (
  `acknowledgementId` bigint(20) UNSIGNED NOT NULL,
  `degreeId` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`acknowledgementId`,`degreeId`),
  KEY `acknowledgement_degree_ibfk_2` (`degreeId`),
  CONSTRAINT `acknowledgement_degree_ibfk_1` FOREIGN KEY (`acknowledgementId`) REFERENCES `acknowledgement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `acknowledgement_degree_ibfk_2` FOREIGN KEY (`degreeId`) REFERENCES `ack_center_degree` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `acknowledgement_role` (
  `acknowledgementId` bigint(20) UNSIGNED NOT NULL,
  `roleId` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`acknowledgementId`,`roleId`),
  KEY `acknowledgement_role_ibfk_2` (`roleId`),
  CONSTRAINT `acknowledgement_role_ibfk_1` FOREIGN KEY (`acknowledgementId`) REFERENCES `acknowledgement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `acknowledgement_role_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `ack_center_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;