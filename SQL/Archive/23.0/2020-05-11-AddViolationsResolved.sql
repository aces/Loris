-- ------------------------------------------------------------------------------------
--                                                                                   --
-- This SQL patch examines every record in table mri_violations_log that has         --
-- column `Header` set to 'Manual Caveat Set by <username>'. If there is not a       --
-- corresponding record in table violations_resolved that flags this violation       --
-- as having been inserted with flag, it adds it.                                    --
--                                                                                   --
-- ------------------------------------------------------------------------------------

INSERT INTO violations_resolved (hash, ExtID, TypeTable, User, ChangeDate, Resolved)
  SELECT 
      md5(concat_WS(':', MincFile, PatientName, SeriesUID, TimeRun)), 
      LogID, 
      'mri_violations_log',
      SUBSTRING_INDEX(Header, ' ', -1),
      TimeRun,
      'inserted_flag'
  FROM mri_violations_log
  WHERE Header LIKE 'Manual Caveat Set by %'
  AND NOT EXISTS (
      SELECT 1 
      FROM violations_resolved 
      WHERE ExtID=LogID
      AND TypeTable='mri_violations_log'
  );
