/* WARNING: be sure to run the 2016-03-10-MoveSelectedTo_files_qcstatus_table_delete_from_parameter_file.sql SQL patch before run the delete statement */
/*Remove all Selected values from parameter_file*/
DELETE FROM parameter_file WHERE ParameterTypeID=(SELECT ParameterTypeID FROM parameter_type WHERE Name='Selected');
