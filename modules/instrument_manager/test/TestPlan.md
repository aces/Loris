# Instrument Manager Test Plan

1. User has access to Instrument Manager only if they have permission `instrument_manager_read` or `instrument_manager_write`.
   [Automation Testing]
2. Check that `Instrument Manager` menu-item exists on a default install under Admin menu-item 
   [Automation Testing]
3. Check that the warning text is accurate if the `project/instruments` or `project/tables_sql` directories are not writable by Apache. The select file/upload panel should only be there if it's writable.
   [Manual Testing]
4. Take the sample .linst instrument file `test_all_fields.linst` in `docs/instruments` and upload it in Instrument Manager.
Check that instrument gets installed properly. (New files should exist in `project/instruments/` & `project/tables_sql/`.) 
Also check the paths in the code - eg uploaded instruments in the instruments directory with right permissions.
   [Manual Testing]
5. Upload the same instrument again. Ensure that a 409 Conflict response is returned and that an appropriate error message is displayed.
6. Check generate_tables_sql_and_testNames.php was performed on the instrument and that the output (i.e. the log file and the tables `instrument_subtests` and `test_names` as well as the instrument table itself) was generated and is correct.
   [Manual Testing]
7. Check that instrument's metadata in the table displayed in Instrument Manager are labeled accurately.
   [Manual Testing]
8. Take a second sample .linst instrument file, load it via the Instrument Manager.  
Then alter the linst file so that it doesn't exactly match the instrument table already loaded in mysql.  (type, number of fields, fieldname spelling)
Check that function CheckTable performs the appropriate checks (catches these discrepancies) on the instrument builder files and validates them properly - 
eg "Table Valid" column is valid when instrument fields match up and "Pages Valid" is valid when subpages are valid.
   [Manual Testing]
