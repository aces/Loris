This is a walkthrough of steps for correcting and re-loading an MRI dataset when scans have been inserted with incorrect labelling.  E.g. wrong subject IDs, wrong visit label, or wrong acquisition date. 

**BETA VERSION - 2015 - These instructions should be tested, and may require updating**

_italics_ means Substitute actual values e.g. /data/_project_/data/  

### Take Backups

* Create a dump of the entire database:

``` bash
mysqldump -u MyProjectUser -h localhost MyProjectDB > MyProject_dump_`date`.sql
```
* Back up key tarchive-specific tables: tarchive, tarchive_files, tarchive_find_new_uploads, tarchive_series:

```bash
mysqldump -u MyProjectUser -h localhost MyProjectDB tarchive tarchive_files tarchive_series tarchive_find_new_uploads > MyProject_tarchiveTables_20151109.sql
```

* Back up key imaging metadata and QC tables: files, parameter_file, mri_acquisition_date, files_qcstatus, feedback_mri_comments:

```bash
mysqldump -u MyProjectUser -h localhost MyProjectDB files parameter_file mri_acquisition_dates files_qcstatus feedback_mri_comments > MyProject_tarchiveTables_20151109.sql
```

* Create duplicates of the different MRI tables:

```mysql
CREATE TABLE tarchive_bkp SELECT * FROM tarchive;
CREATE TABLE tarchive_files_bkp SELECT * FROM tarchive_files;
CREATE TABLE tarchive_series_bkp SELECT * FROM tarchive_series;
CREATE TABLE tarchive_find_new_uploads_bkp SELECT * FROM tarchive_find_new_uploads;
CREATE TABLE file_bkp SELECT * FROM files;
CREATE TABLE parameter_file_bkp SELECT * FROM parameter_file;
CREATE TABLE mri_acquisition_date_bkp SELECT * FROM mri_acquisition_dates;
```

* Make sure SeriesUID and EchoTime are populated for every entry in the files_qcstatus and feedback_mri_comments table.
If not all populated, run following queries:

```mysql
CREATE TEMPORARY TABLE SeriesUIDs AS select pf.FileID, pf.Value AS SeriesUID from parameter_file AS pf LEFT JOIN parameter_type AS pt ON pf.ParameterTypeID=pt.ParameterTypeID where pt.Name="series_instance_uid" GROUP BY SeriesUID;
UPDATE feedback_mri_comments AS fmc, SeriesUIDs AS S SET fmc.SeriesUID=S.SeriesUID where fmc.FileID=S.FileID;
```

### Move tarchive file to the incoming directory and modify the patientName in the DICOM files

#### Move tarchive

```bash
mv /data/_project_/data/tarchive/*/_CandID\_BadVisitLabel_ /data/incoming/_project_/incoming
```

#### Untar tarchive

```bash
tar -xvf /data/incoming/_project_/incoming/_Tarfile_
tar -xvzf /data/incoming/_project_/incoming/_BadPatientName.tar.gz_
```

#### Modify PatientName in all DICOMs

```mysql
dcmodify -ma PatientName="GoodPatientName" /data/incoming/_project_/incoming/_BadPatientName_/*
```

#### Remove back up files from the directory and rename DICOM folder with the good PatientName

```bash
rm /data/incoming/_project_/incoming/_BadPatientName_/*bak
mv /data/incoming/_project_/incoming/_BadPatientName_ /data/incoming/_project_/incoming/_GoodPatientName_
```

### Delete files from the filesystem

```bash
rmdir /data/_project_/data/assembly/_CandID_/_Bad\_Visit\_label_  # minc files
rm /data/_project_/data/pic/_CandID_/_Bad\_Visit\_label_               # jpeg files
rm /data/_project_/data/jiv/_CandID_/_Bad\_Visit\_label_                # jiv files
rm /data/_project_/data/tarchive/*/_CandID\_BadVisitlabel_            # tarchive file 
```

### Remove scans for the MySQL database

#### Find out the FileIDs of the minc files in the files table

```mysql
SELECT FileID, File FROM files WHERE File LIKE "%CandID_BadVisitLabel%";
```

#### Remove from the parameter_file and files tables the entries for the corresponding FileIDs

```mysql
DELETE FROM parameter_file WHERE FileID IN (@fileIDs);
DELETE FROM files WHERE FileID IN (@fileIDs);
```

#### Find out the TarchiveID of the uploaded tarchive

```mysql
SELECT TArchiveID, ArchiveLocation FROM tarchive WHERE ArchiveLocation LIKE "%CandID_BadVisitLabel%"
```

#### Remove from the tarchive_table the tarchive

```mysql
DELETE FROM tarchive WHERE TarchiveID=$BadTarchiveID
```

#### Rename visit_label in the session table

```mysql
SELECT ID, CandID, Visit_label FROM session WHERE CandID=$CandID AND Visit_label=$BadVisitLabel
UPDATE session SET Visit_label=$GoodVisitLabel WHERE ID=$SessionID
```

### Run dicomTar.pl on the new incoming folder

```mysql
dicomTar.pl /data/incoming/_project_/incoming/_GoodPatientName_ /data/_project_/data/tarchive -database -profile prod -mri_upload_update
```

Remove -mri_upload_update option if running older pipeline versions

### Run batch_upload on the inserted tarchive file
Get the list of tarchive to process

```mysql
cd /data/_project_/data/tarchive
ls DCM* > /data/_project_/data/bin/mri/tarchive_list.txt
```

Run batch_upload on list of tarchive

```mysql
batch_uploads_tarchive < tarchive_list.txt
```

### Update files_qcstatus and feedback_mri_comments with new FileIDs:
#### Create temporary table with new FileIDs (from new files table), SeriesUID and EchoTime from files_qcstatus

```mysql
CREATE TEMPORARY TABLE FileIDs AS SELECT f.FileID, f.SeriesUID, f.EchoTime, fq.QCStatus, fq.QCFirstChangeTime, fq.QCLastChangeTime FROM files AS f LEFT JOIN files_qcstatus AS fq ON fq.SeriesUID=f.SeriesUID AND fq.EchoTime=f.EchoTime GROUP BY f.FileID;
```

#### update files_qcstatus with new FileIDs

```mysql
UPDATE files_qcstatus AS fq, FileIDs AS F SET fq.FileID=F.FileID WHERE fq.SeriesUID=F.SeriesUID AND fq.EchoTime=F.EchoTime; 
```

#### Repeat to update feedback_mri_comments table

```mysql
CREATE TEMPORARY TABLE FileIDsComments AS SELECT f.FileID, f.SeriesUID, f.EchoTime, fmc.CommentTypeID, fmc.PredefinedCommentID, fmc.Comment FROM files AS f LEFT JOIN feedback_mri_comments AS fmc ON fmc.SeriesUID=f.SeriesUID AND fmc.EchoTime=f.EchoTime GROUP BY f.FileID;
UPDATE feedback_mri_comments AS fmc, FileIDsComments AS F SET fmc.FileID=F.FileID WHERE fmc.SeriesUID=F.SeriesUID AND fmc.EchoTime=F.EchoTime;
```

### Update the selected in parameter_file table

#### in sandbox mysql database load old parameter_file and files table. Create a new table called **selecteds** with all the selected info. (don't do this on the live production database!!)

```mysql
CREATE TABLE selecteds AS SELECT f.SeriesUID,f.EchoTime,pf.* FROM parameter_file pf JOIN files f ON f.FileID=pf.FileID WHERE ParameterTypeID=1 AND value IS NOT NULL;
```

#### dump the selecteds table and load it in the live database. Create a temporary table selectedFileID with the new FileIDs to insert the selected with

```mysql
CREATE TEMPORARY_TABLE selectedFileID AS select f.FileID, f.SeriesUID, f.EchoTime, s.ParameterTypeID, s.Value, s.InsertTime FROM files f JOIN selecteds s ON s.SeriesUID=f.SeriesUID AND s.EchoTime=f.EchoTime GROUP BY f.FileID;
```

#### Insert the selecteds into parameter_file

```mysql
INSERT INTO parameter_file (FileID,ParameterTypeID,Value,InsertTime)  (SELECT FileID, ParameterTypeID,Value,InsertTime FROM selectedFileID);
```