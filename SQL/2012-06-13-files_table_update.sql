CREATE TEMPORARY TABLE FileIDs as SELECT pf.FileID , pf.Value as SeriesUID,f.QCStatus, f.QCFirstChangeTime, f.QCLastChangeTime  FROM parameter_file pf 
JOIN parameter_type pt USING (ParameterTypeID) 
JOIN files f ON (f.FileID = pf.FileID)
WHERE pt.Name='series_instance_uid';

INSERT INTO files_qcstatus (FileID, SeriesUID,QCStatus,QCFirstChangeTime,QCLastChangeTime) SELECT FileID, SeriesUID, QCStatus, QCFirstChangeTime,QCLastChangeTime  FROM FileIDs;

ALTER TABLE files drop column QCStatus;
ALTER TABLE files drop column QCFirstChangeTime;
ALTER TABLE files drop column QCLastChangeTime;

