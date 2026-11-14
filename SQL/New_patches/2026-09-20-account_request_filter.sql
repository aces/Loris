-- =============================================================================
-- Author:    Priyavrat Dev Sharma
-- Purpose:   Creates the account_request_filter table to block or allow
--            account requests by email address or domain.
-- =============================================================================

CREATE TABLE IF NOT EXISTS `account_request_filter` (
  `BlockID`      INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Type`         VARCHAR(32)      NOT NULL
                 COMMENT 'Rule type: BlockedEmail, BlockedDomain, AllowedEmail, AllowedDomain',
  `Value`        VARCHAR(255)     NOT NULL
                 COMMENT 'Normalized lowercase email or domain (e.g. user@spam.com or mailinator.com)',
  `IsNormalized` TINYINT(1)       NOT NULL DEFAULT 1
                 COMMENT '1 if sub-address plus-tags (+tag) were stripped before storing',
  `IsActive`     TINYINT(1)       NOT NULL DEFAULT 1
                 COMMENT '1 = active rule, 0 = soft-deleted (audit row kept)',
  `AddedByUser`  VARCHAR(255)     DEFAULT NULL
                 COMMENT 'UserID of the admin who created this rule',
  `DateAdded`    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ExpiresAt`    TIMESTAMP        NULL DEFAULT NULL
                 COMMENT 'Optional: leave NULL for permanent rules, set a date for temporary bans',
  `Reason`       VARCHAR(512)     DEFAULT NULL
                 COMMENT 'Audit note explaining why this rule was added',
  PRIMARY KEY (`BlockID`),
  UNIQUE KEY `UK_type_value` (`Type`, `Value`),
  KEY `idx_type_active` (`Type`, `IsActive`),
  CONSTRAINT `FK_blocklist_added_by`
    FOREIGN KEY (`AddedByUser`) REFERENCES `users` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `CHK_blocklist_type`
    CHECK (`Type` IN ('BlockedEmail', 'BlockedDomain', 'AllowedEmail', 'AllowedDomain'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  COMMENT='Stores rules for blocking or allowing account request signups';
