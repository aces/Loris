ALTER TABLE SNP ADD COLUMN `MinorAllele` enum('A','C','T','G') DEFAULT NULL AFTER `ReferenceBase`;
