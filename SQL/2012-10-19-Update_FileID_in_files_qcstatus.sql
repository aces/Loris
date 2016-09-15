CREATE TEMPORARY TABLE FileIDs AS SELECT pf.FileID, pf.Value AS SeriesUID, fq.QCStatus, fq.QCFirstChangeTime, fq.QCLastChangeTime FROM files AS f LEFT JOIN parameter_file AS pf ON f.FileID=pf.FileID LEFT JOIN parameter_type AS pt ON pt.ParameterTypeID=pf.ParameterTypeID LEFT JOIN files_qcstatus AS fq ON fq.SeriesUID=pf.Value where pt.Name='series_instance_uid' GROUP BY SeriesUID;

UPDATE files_qcstatus AS fq, FileIDs AS F SET fq.FileID=F.FileID where fq.SeriesUID=F.SeriesUID;

UPDATE feedback_mri_comments AS fmc, FileIDs AS F SET fmc.FileID=F.FileID where fmc.SeriesUID=F.SeriesUID;

DROP TEMPORARY TABLE FileIDs;
