# Data Dictionary - Test Plan  

1. Check that you have access to the Data Dictionary if the user has one or more of 
these permissions: 
   - data_dict (_"Data Dictionary: View Parameter Type Descriptions"_)
   - data_dict_edit (_"Data Dictionary: Edit Parameter Type Descriptions"_) or superuser (_"Superuser - supersedes all permissions"_).
  [Automation Testing]
2. Check that the 'Source From' multiselect filter field contains all the instrument names.
  [Automation Testing]
3. Perform various searches and validate the results. 
 - Use any combination of the available search criteria. 
 - Make sure that when you choose "Empty" in the 'Description Status' filter dropdown, all the rows 
 returned have an empty description.
  [Automation Testing]
4. Check that selecting multiple instruments returns all relevant results.
5. Check that the table can be sorted according to any column (ascending and descending).
  [Automation Testing]
6. Check that pushing the "Clear Filter" button sets resets all filters to empty
  [Automation Testing]
7. Check that if (and only if) you have the 'data_dict_edit' permission you can edit 
the Description field (by clicking on the text of the description). Edit a description, access the Candidate Profile page and 
access the Data Dictionary page again. Make sure the edit was saved.
  [Automation Testing]
8. Check that you can navigate through the search result pages (both by clicking on
the numbers and arrows in the bottom right corner of the table).
  [Automation Testing]
9. Check that the maximum rows displayed dropdown works, also check that the
download table as CSV works as well.
  [Automation Testing]
10. Check that the `tools/exporters/data_dictionary_builder.php` works. Try changing
field names in an instrument before running the script and make sure that the 
corresponding entries in Data Dictionary are updated correctly.
