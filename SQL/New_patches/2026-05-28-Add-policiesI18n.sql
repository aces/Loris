CREATE TABLE policiesI18n (
  PolicyID INT NOT NULL,
  LanguageID INT(10) UNSIGNED NOT NULL,
  Content TEXT NULL,
  SwalTitle VARCHAR(255) NULL,
  HeaderButtonText VARCHAR(255) NULL,
  AcceptButtonText VARCHAR(255) NULL,
  DeclineButtonText VARCHAR(255) NULL,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (PolicyID, LanguageID),
  CONSTRAINT policiesI18n_policy_fk
    FOREIGN KEY (PolicyID)
    REFERENCES policies (PolicyID)
    ON DELETE CASCADE,
  CONSTRAINT policiesI18n_language_fk
    FOREIGN KEY (LanguageID)
    REFERENCES language (language_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;