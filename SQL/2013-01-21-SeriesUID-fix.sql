/* Add SeriesUID and EchoTime to the files table */
alter table files add SeriesUID varchar(64) NULL after FileID;
alter table files add EchoTime double NULL after SeriesUID;

/* Add SeriesUID and EchoTime to the files_qcstatus table */
alter table files_qcstatus drop index SeriesUID;
alter table files_qcstatus add EchoTime double NULL after SeriesUID;

/* Add SeriesUID and EchoTime to the feedback_mri_comments table */
alter table feedback_mri_comments add SeriesUID varchar(64) NULL after FileID;
alter table feedback_mri_comments add EchoTime double NULL after SeriesUID;


/* Populate SeriesUID and EchoTime in files, files_qcstatus and feedback_mri_comments tables*/
CREATE TEMPORARY TABLE SeriesUIDs AS select pf.FileID, pf.Value AS SeriesUID from parameter_file AS pf LEFT JOIN parameter_type AS pt ON pf.ParameterTypeID=pt.ParameterTypeID where pt.Name="series_instance_uid";
CREATE TEMPORARY TABLE EchoTime AS select pf.FileID, pf.Value AS EchoTime from parameter_file AS pf LEFT JOIN parameter_type AS pt ON pf.ParameterTypeID=pt.ParameterTypeID where pt.Name="echo_time";
/* feedback_mri_comments */
UPDATE feedback_mri_comments AS fmc, SeriesUIDs AS S SET fmc.SeriesUID=S.SeriesUID where fmc.FileID=S.FileID;
UPDATE feedback_mri_comments AS fmc, EchoTime AS et SET fmc.EchoTime=et.EchoTime where fmc.FileID=et.FileID;
/* files */
UPDATE files AS f, SeriesUIDs AS S SET f.SeriesUID=S.SeriesUID where f.FileID=S.FileID;
UPDATE files AS f, EchoTime AS et SET f.EchoTime=et.EchoTime where f.FileID=et.FileID;
/* files_qcstatus */
UPDATE files_qcstatus AS fqc, SeriesUIDs AS S SET fqc.SeriesUID=S.SeriesUID where fqc.FileID=S.FileID;
UPDATE files_qcstatus AS fqc, EchoTime AS et SET fqc.EchoTime=et.EchoTime where fqc.FileID=et.FileID;
