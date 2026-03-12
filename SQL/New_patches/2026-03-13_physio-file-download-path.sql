-- Add the column as nullable first.
ALTER TABLE `physiological_file`
ADD COLUMN `DownloadPath` VARCHAR(255) DEFAULT NULL AFTER `FilePath`;

-- Populate the download path using the file path value.
UPDATE `physiological_file`
SET `DownloadPath` = `FilePath`;

-- Add the non-null constraint once the data is populated.
ALTER TABLE `physiological_file`
MODIFY COLUMN `DownloadPath` VARCHAR(255) NOT NULL;
