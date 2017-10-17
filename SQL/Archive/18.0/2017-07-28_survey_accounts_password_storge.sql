-- The OneTimePassword storage capacity should be extended according to new key generation logic

ALTER TABLE participant_accounts MODIFY COLUMN OneTimePassword VARCHAR(16) ;
