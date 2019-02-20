# Instrument Manager Test Plan

1. User has access to Instrument Manager only if they have permission “instrument_manager”.
   [Automation Testing]
2. Check that `Instrument Manager` menu-item exists on a default install under Admin menu-item 
   [Automation Testing]
3. Check that the warning text is accurate if the `project/instruments` or `project/sql_tables` directories are not writable by Apache. The select file/upload panel should only be there if it's writable.
   [Manual Testing]
4. Take the sample .linst instrument file `test_all_fields.linst` in `docs/instruments` and upload it in Instrument Manager.
Check that instrument gets installed properly - instruments/ tables_sql/ . 
Also check the paths in the code - eg uploaded instruments in the instruments directory with right permissions.
   [Manual Testing]
5. Check generate_tables_sql_and_testNames.php was performed on the instrument and output(logfile and tables: instrument_subtests, test_names, instrument table itself) was generated correctly.
   [Manual Testing]
6. Check that instruments' metadata in the table displayed in Instrument Manager are labeled accurately.
   [Manual Testing]
7. Take a second sample .linst instrument file, load it via the Instrument Manager.  
Then alter the linst file so that it doesn't exactly match the instrument table already loaded in mysql.  (type, number of fields, fieldname spelling)
Check that function CheckTable performs the appropriate checks (catches these discrepancies) on the instrument builder files and validates them properly - 
eg "Table Valid" column is valid when instrument fields match up and "Pages Valid" is valid when subpages are valid.
   [Manual Testing]
