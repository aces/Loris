-- Drop suspicious default

ALTER TABLE `flag`
  ALTER `SessionID` DROP DEFAULT;
