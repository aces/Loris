-- =============================================================================
-- Author:    Priyavrat Dev Sharma (priyavrat.sharma@mcin.ca)
-- Purpose:   Create dedicated account_requests staging table to isolate unvetted 
--            accounts from users (Issue #11248)
-- =============================================================================

CREATE TABLE IF NOT EXISTS `account_requests` (
  `ID`                   INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `UserID`               VARCHAR(255)     NOT NULL DEFAULT '',
  `Password_hash`        VARCHAR(255)     DEFAULT NULL,
  `Real_name`            VARCHAR(255)     DEFAULT NULL,
  `First_name`           VARCHAR(255)     DEFAULT NULL,
  `Last_name`            VARCHAR(255)     DEFAULT NULL,
  `Degree`               VARCHAR(255)     DEFAULT NULL,
  `Position_title`       VARCHAR(255)     DEFAULT NULL,
  `Institution`          VARCHAR(255)     DEFAULT NULL,
  `Department`           VARCHAR(255)     DEFAULT NULL,
  `Address`              VARCHAR(255)     DEFAULT NULL,
  `City`                 VARCHAR(255)     DEFAULT NULL,
  `State`                VARCHAR(255)     DEFAULT NULL,
  `Zip_code`             VARCHAR(255)     DEFAULT NULL,
  `Country`              VARCHAR(255)     DEFAULT NULL,
  `Phone`                VARCHAR(15)      DEFAULT NULL,
  `Fax`                  VARCHAR(255)     DEFAULT NULL,
  `Email`                VARCHAR(255)     NOT NULL DEFAULT '',
  `account_request_date` DATE             DEFAULT NULL,
  `Status`               VARCHAR(32)      NOT NULL DEFAULT 'Pending',
  `RejectedByUser`       VARCHAR(255)     DEFAULT NULL,
  `RejectedAt`           TIMESTAMP        NULL DEFAULT NULL,
  `RejectionReason`      VARCHAR(1024)    DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_account_requests_email` (`Email`),
  UNIQUE KEY `UK_account_requests_userid` (`UserID`),
  CONSTRAINT `CHK_account_requests_status` CHECK (`Status` IN ('Pending', 'Approved', 'Rejected'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
