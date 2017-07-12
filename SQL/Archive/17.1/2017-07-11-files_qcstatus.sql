alter table files_qcstatus modify Selected enum('','true', 'false') DEFAULT NULL;
alter table files_qcstatus modify QCStatus enum('','Pass', 'Fail') DEFAULT NULL;
