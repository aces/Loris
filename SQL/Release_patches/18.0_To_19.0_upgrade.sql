DELIMITER $$

CREATE PROCEDURE `change_psc_centerid_column_definition`()
BEGIN

  DECLARE v_finish INTEGER DEFAULT 0;

  DECLARE v_schema_name VARCHAR(255) DEFAULT database();
  DECLARE v_table_name VARCHAR(255) DEFAULT "";
  DECLARE v_column_name VARCHAR(255) DEFAULT "";
  DECLARE v_constraint_name VARCHAR(255) DEFAULT "";
  DECLARE v_column_default VARCHAR(255) DEFAULT "";
  DECLARE v_nullable VARCHAR(255) DEFAULT "";

  DECLARE stmt VARCHAR(1024);

  DECLARE c_constraints CURSOR FOR
    SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME FROM tmp_centerid_contraints;

  DECLARE CONTINUE HANDLER FOR NOT FOUND
    SET v_finish = 1;

  -- Cleanup the notification_spool table in case of bad datetime format.
  CREATE TEMPORARY TABLE hist_tmp AS 
    (SELECT h.changeDate, h.primaryVals FROM history h WHERE h.tbl='notification_spool' AND h.col='TimeSpooled');

  CREATE TEMPORARY TABLE hist_list_tmp AS 
    (SELECT h.primaryVals FROM history h WHERE h.tbl='notification_spool' AND h.col='TimeSpooled');

  UPDATE notification_spool SET TimeSpooled=(SELECT ChangeDate FROM hist_tmp WHERE primaryVals=NotificationID) WHERE NotificationID IN (SELECT primaryVals FROM hist_list_tmp);

  DROP TABLE hist_tmp;
  DROP TABLE hist_list_tmp;

  -- Store the current foreign keys for the cursor.
  CREATE TEMPORARY TABLE tmp_centerid_contraints SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = v_schema_name AND ((TABLE_NAME = 'psc' AND LOWER(COLUMN_NAME) = 'centerid') OR (REFERENCED_TABLE_NAME = 'psc' AND LOWER(REFERENCED_COLUMN_NAME) = 'centerid')) AND TABLE_NAME != 'psc';

  -- Drop foreign keys
  OPEN c_constraints;
  
  drop_constraints: LOOP
    FETCH c_constraints INTO v_table_name, v_column_name, v_constraint_name;

    IF v_finish = 1 THEN
      LEAVE drop_constraints;
    END IF;

    SET @SQL := CONCAT('ALTER TABLE ',v_table_name,' DROP FOREIGN KEY ',v_constraint_name);
    SELECT @SQL;
    PREPARE stmt FROM @SQL;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

  END LOOP drop_constraints;
  CLOSE c_constraints;
  
  SET v_finish = false;
  OPEN c_constraints;
  alter_tables: LOOP
    FETCH c_constraints INTO v_table_name, v_column_name, v_constraint_name;
    
    IF v_finish = 1 THEN
      LEAVE alter_tables;
    END IF;

    SELECT IFNULL(CONCAT('DEFAULT ', COLUMN_DEFAULT), ''), IF(IS_NULLABLE = 'YES', '', 'NOT NULL') INTO v_column_default, v_nullable FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = v_schema_name AND TABLE_NAME = v_table_name AND column_name = v_column_name;
    SET @SQL := CONCAT('ALTER TABLE ',v_table_name,' CHANGE ',v_column_name,' ',v_column_name,' INTEGER UNSIGNED ',v_nullable,' ', v_column_default);    

    SELECT @SQL;
    PREPARE stmt FROM @SQL;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

  END LOOP alter_tables;
  CLOSE c_constraints;

  ALTER TABLE psc CHANGE `CenterID` `CenterID` integer unsigned NOT NULL AUTO_INCREMENT;

  SET v_finish = false;
  OPEN c_constraints;
  add_constraints: LOOP
    FETCH c_constraints INTO v_table_name, v_column_name, v_constraint_name;

    IF v_finish = 1 THEN
      LEAVE add_constraints;
    END IF;

    SET @SQL := CONCAT('ALTER TABLE ',v_table_name,' ADD CONSTRAINT `',v_constraint_name,'` FOREIGN KEY (`',v_column_name,'`) REFERENCES `psc` (`CenterID`)');
    SELECT @SQL;
    PREPARE stmt FROM @SQL;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

  END LOOP add_constraints;
  CLOSE c_constraints;

  DROP TABLE tmp_centerid_contraints;

  SELECT 'Success' as 'Exit';

END $$
DELIMITER ;

call change_psc_centerid_column_definition();
DROP PROCEDURE `change_psc_centerid_column_definition`;
DROP TABLE empty_queries;
-- Add TarchiveID foreign key to MRIcandidateErrors
ALTER TABLE MRICandidateErrors
  ADD CONSTRAINT `FK_tarchive_MRICandidateError_1`
    FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`);

-- Add TarchiveID foreign key to mri_violations_log
ALTER TABLE mri_violations_log
  ADD CONSTRAINT `FK_tarchive_mriViolationsLog_1`
    FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`);

-- Add TarchiveID foreign key to files
ALTER TABLE files
  ADD CONSTRAINT `FK_files_TarchiveID`
    FOREIGN KEY (`TarchiveSource`) REFERENCES `tarchive` (`TarchiveID`);

-- Add FileID foreign key to files_qcstatus
ALTER TABLE files_qcstatus
  MODIFY COLUMN `FileID` INT(10) UNSIGNED UNIQUE NULL,
  ADD CONSTRAINT `FK_filesqcstatus_FileID`
    FOREIGN KEY (`FileID`) REFERENCES `files` (`FileID`);

-- Add SessionID and TarchiveID foreign keys to mri_upload
ALTER TABLE mri_upload
  ADD CONSTRAINT `FK_mriupload_SessionID`
    FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
  ADD CONSTRAINT `FK_mriupload_TarchiveID`
    FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`);

-- Add ScanType foreign key in mri_protocol_checks
ALTER TABLE mri_protocol_checks
  ADD CONSTRAINT `FK_mriProtocolChecks_ScanType`
    FOREIGN KEY (`Scan_type`) REFERENCES `mri_scan_type` (`ID`);

-- Add SessionID foreign key in tarchive
ALTER TABLE tarchive
  ADD CONSTRAINT `FK_tarchive_sessionID`
    FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`);

DROP TABLE IF EXISTS tarchive_find_new_uploads;

-- Alter table mri_protocol_violated_scans to add TarchiveID
ALTER TABLE mri_protocol_violated_scans 
  ADD TarchiveID INT(11) AFTER PSCID,
  ADD CONSTRAINT `FK_mri_violated_1` FOREIGN KEY (`TarchiveID`) 
        REFERENCES `tarchive` (`TarchiveID`);

-- Populate mri_protocol_violated_scans.TarchiveID in joining 
-- with tarchive_series table using SeriesUID
UPDATE mri_protocol_violated_scans 
  LEFT JOIN tarchive_series ts USING (SeriesUID) 
  SET mri_protocol_violated_scans.TarchiveID=ts.TarchiveID;
alter table help drop column projectContent;
-- CNV
-- Add fields from genome_loc table
ALTER TABLE `CNV`
  ADD COLUMN `Chromosome` varchar(255) DEFAULT NULL,
  ADD COLUMN `Strand` varchar(255) DEFAULT NULL,
  ADD COLUMN `EndLoc` int(11) DEFAULT NULL,
  ADD COLUMN `StartLoc` int(11) DEFAULT NULL;

-- Add fields from gene table
ALTER TABLE `CNV`
  ADD COLUMN `Symbol` varchar(255) DEFAULT NULL,
  ADD COLUMN `Name` varchar(255) DEFAULT NULL,
  ADD COLUMN `NCBIID` varchar(255) DEFAULT NULL,
  ADD COLUMN `OfficialSymbol` varchar(255) DEFAULT NULL,
  ADD COLUMN `OfficialName` text;

-- Fill those fields
UPDATE CNV t JOIN genome_loc gl USING (GenomeLocID) set t.Chromosome = gl.Chromosome, t.Strand = gl.Strand, t.EndLoc = gl.EndLoc, t.StartLoc = gl.StartLoc;
UPDATE CNV t JOIN gene g USING (GenomeLocID) set t.Symbol = g.Symbol, t.Name = g.Name, t.NCBIID = g.NCBIID, t.OfficialSymbol = g.OfficialSymbol, t.OfficialName = g.OfficialName;

-- Remove the FOREIGN KEY using constraint name from infomration_schema.
SET @constraint_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE table_name = 'CNV' AND CONSTRAINT_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME = 'genome_loc');
SET @s = (SELECT IF(@constraint_name IS NULL,"SELECT 'There is no foreign key between CNV and genome_loc table' as Message",CONCAT("ALTER TABLE CNV DROP FOREIGN KEY ", @constraint_name)));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the reference column
ALTER TABLE CNV 
  DROP COLUMN GenomeLocID;

-- SNP
-- Add fields from genome_loc table
ALTER TABLE `SNP`
  ADD COLUMN `Chromosome` varchar(255) DEFAULT NULL,
  ADD COLUMN `Strand` varchar(255) DEFAULT NULL,
  ADD COLUMN `EndLoc` int(11) DEFAULT NULL,
  ADD COLUMN `StartLoc` int(11) DEFAULT NULL;

-- Add fields from gene table
ALTER TABLE `SNP`
  ADD COLUMN `Symbol` varchar(255) DEFAULT NULL,
  ADD COLUMN `Name` varchar(255) DEFAULT NULL,
  ADD COLUMN `NCBIID` varchar(255) DEFAULT NULL,
  ADD COLUMN `OfficialSymbol` varchar(255) DEFAULT NULL,
  ADD COLUMN `OfficialName` text;

-- Fill thos fields
UPDATE SNP t JOIN genome_loc gl USING (GenomeLocID) set t.Chromosome = gl.Chromosome, t.Strand = gl.Strand, t.EndLoc = gl.EndLoc, t.StartLoc = gl.StartLoc;
UPDATE SNP t JOIN gene g USING (GenomeLocID) set t.Symbol = g.Symbol, t.Name = g.Name, t.NCBIID = g.NCBIID, t.OfficialSymbol = g.OfficialSymbol, t.OfficialName = g.OfficialName;

-- Remove the FOREIGN KEY using constraint name from infomration_schema.
SET @constraint_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE table_name = 'SNP' AND CONSTRAINT_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME = 'genome_loc');
SET @s = (SELECT IF(@constraint_name IS NULL,"SELECT 'There is no foreign key between SNP and genome_loc table' as Message",CONCAT("ALTER TABLE SNP DROP FOREIGN KEY ", @constraint_name)));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the reference column
ALTER TABLE SNP 
  DROP COLUMN GenomeLocID;

-- genomic_cpg_annotation
-- Add fields from genome_loc table
ALTER TABLE `genomic_cpg_annotation`
  ADD COLUMN `Chromosome` varchar(255) DEFAULT NULL,
  ADD COLUMN `Strand` varchar(255) DEFAULT NULL,
  ADD COLUMN `EndLoc` int(11) DEFAULT NULL,
  ADD COLUMN `StartLoc` int(11) DEFAULT NULL;

-- Fill thos fields
UPDATE genomic_cpg_annotation t JOIN genome_loc gl ON (location_id = GenomeLocID) set t.Chromosome = gl.Chromosome, t.Strand = gl.Strand, t.EndLoc = gl.EndLoc, t.StartLoc = gl.StartLoc;

-- Remove the FOREIGN KEY using constraint name from infomration_schema.
SET @constraint_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE table_name = 'genomic_cpg_annotation' AND CONSTRAINT_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME = 'genome_loc');
SET @s = (SELECT IF(@constraint_name IS NULL,"SELECT 'There is no foreign key between genomic_cpg_annotation and genome_loc table' as Message",CONCAT("ALTER TABLE genomic_cpg_annotation DROP FOREIGN KEY ", @constraint_name)));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the reference column
ALTER TABLE genomic_cpg_annotation
  DROP COLUMN location_id;

RENAME TABLE genome_loc TO to_be_deleted_genome_loc;
RENAME TABLE gene TO to_be_deleted_gene;

-- DROP TABLE to_be_deleted_genome_loc;
-- DROP TABLE to_be_deleted_gene;

ALTER TABLE `genomic_cpg_annotation` 
ADD INDEX `index3` (`Chromosome` ASC, `StartLoc` ASC, `EndLoc` ASC, `Strand` ASC);

ALTER TABLE `CNV` 
ADD INDEX `index4` (`Chromosome` ASC, `StartLoc` ASC, `EndLoc` ASC, `Strand` ASC);

ALTER TABLE `SNP` 
ADD INDEX `index3` (`Chromosome` ASC, `StartLoc` ASC, `EndLoc` ASC, `Strand` ASC);
WARNINGS;
SET SQL_NOTES=1;

SELECT 'Delete Menu Permission' as 'Step #1';
DELETE FROM LorisMenuPermissions WHERE MenuID IN
    (SELECT ID FROM LorisMenu WHERE Link = 'final_radiological_review/');

SELECT 'Delete Menu Entry' as 'Step #2';
DELETE FROM LorisMenu WHERE Link = 'final_radiological_review/';

SELECT 'Patch complete' as 'Status';
ALTER TABLE mri_upload CHANGE `Inserting` `Inserting` tinyint(1) DEFAULT NULL;
