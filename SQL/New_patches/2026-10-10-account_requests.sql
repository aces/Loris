-- =============================================================================
-- Author:    Priyavrat Dev Sharma (priyavrat.sharma@mcin.ca)
-- Purpose:   Create dedicated account_requests staging table to isolate unvetted 
--            accounts from users (Issue #11248)
-- =============================================================================

CREATE TABLE IF NOT EXISTS `account_requests` (
  `ID`                   INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `UserID`               VARCHAR(255)     NOT NULL DEFAULT '',
  `First_name`           VARCHAR(255)     NOT NULL DEFAULT '',
  `Last_name`            VARCHAR(255)     NOT NULL DEFAULT '',
  `Email`                VARCHAR(255)     NOT NULL DEFAULT '',
  `CenterID`             INT(10) UNSIGNED NOT NULL,
  `ProjectID`            INT(10) UNSIGNED NOT NULL,
  `language_preference`  INT UNSIGNED     DEFAULT NULL,
  `Examiner`             TINYINT(1)       NOT NULL DEFAULT 0,
  `Radiologist`          TINYINT(1)       NOT NULL DEFAULT 0,
  `account_request_date` DATE             NOT NULL,
  `last_request_date`    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `request_count`        INT UNSIGNED     NOT NULL DEFAULT 1,
  `initial_ip_address`   VARCHAR(45)      DEFAULT NULL,
  `last_ip_address`      VARCHAR(45)      DEFAULT NULL,
  `Status`               VARCHAR(32)      NOT NULL DEFAULT 'Pending',
  `ApprovedAt`           TIMESTAMP        NULL DEFAULT NULL,
  `ApprovedByUser`       VARCHAR(255)     DEFAULT NULL,
  `RejectedByUser`       VARCHAR(255)     DEFAULT NULL,
  `RejectedAt`           TIMESTAMP        NULL DEFAULT NULL,
  `RejectionReason`      VARCHAR(1024)    DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_account_requests_email`  (`Email`),
  UNIQUE KEY `UK_account_requests_userid` (`UserID`),
  CONSTRAINT `FK_account_requests_center`   FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `FK_account_requests_project`  FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`),
  CONSTRAINT `FK_account_requests_lang`     FOREIGN KEY (`language_preference`) REFERENCES `language` (`language_id`),
  CONSTRAINT `FK_account_requests_appr_by`  FOREIGN KEY (`ApprovedByUser`) REFERENCES `users` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `FK_account_requests_rej_by`   FOREIGN KEY (`RejectedByUser`) REFERENCES `users` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `CHK_account_requests_status`  CHECK (`Status` IN ('Pending', 'Approved', 'Rejected', 'Blocked'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
