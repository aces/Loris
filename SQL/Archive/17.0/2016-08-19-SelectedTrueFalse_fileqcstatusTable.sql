UPDATE files_qcstatus as fqc SET fqc.Selected='true' WHERE fqc.Selected <> '';
ALTER TABLE files_qcstatus CHANGE `Selected` `Selected` enum('true','false') DEFAULT NULL; 
