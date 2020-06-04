-- This SQL patch contains all the necessary alterations to the LORIS default schema to
-- accommodate the Raisin Bread data-only  schema import.

ALTER TABLE participant_status
  ADD COLUMN `raisin_consent` enum('yes','no','not_answered') DEFAULT NULL,
  ADD COLUMN `bread_consent` enum('yes','no','not_answered') DEFAULT NULL,
  ADD COLUMN `raisin_consent_date` date DEFAULT NULL,
  ADD COLUMN `bread_consent_date` date DEFAULT NULL,
  ADD COLUMN `raisin_consent_withdrawal` date DEFAULT NULL,
  ADD COLUMN `bread_consent_withdrawal` date DEFAULT NULL;

ALTER TABLE consent_info_history
  ADD COLUMN `raisin_consent` enum('yes','no','not_answered') DEFAULT NULL,
  ADD COLUMN `bread_consent` enum('yes','no','not_answered') DEFAULT NULL,
  ADD COLUMN `raisin_consent_date` date DEFAULT NULL,
  ADD COLUMN `bread_consent_date` date DEFAULT NULL,
  ADD COLUMN `raisin_consent_withdrawal` date DEFAULT NULL,
  ADD COLUMN `bread_consent_withdrawal` date DEFAULT NULL;