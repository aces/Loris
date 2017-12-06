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
