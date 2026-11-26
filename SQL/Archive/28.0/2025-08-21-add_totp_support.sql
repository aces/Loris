ALTER TABLE users ADD COLUMN TOTPSecret binary(64) DEFAULT NULL AFTER PasswordChangeRequired;
