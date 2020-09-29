# Data Dictionary - Test Plan  

1. Check that you have access to the Data Dictionary if the user has one or more of 
these permissions: 
   - data_dict
   - data_dict_edit or superuser.
  [Automation Testing]
2. Check that the instruments combo box contains all the instrument names.
  [Automation Testing]
3. Perform various searches and validate the results. 
 - Use any combination of the available search criteria. 
 - Make sure that when performing a keyword search the algorithm takes column Name, 
 SourceField and Description into account. 
 - Make sure that when you choose "Empty" in the Description combo box, all the rows 
 returned have an empty description.
  [Automation Testing]
4. Check that selecting multiple instruments returns all relevant results.
5. Check that the table can be sorted according to any column (ascending and descending).
  [Automation Testing]
6. Check that pushing the Clear button sets the Description search field to 'All', 
the Instruments search field to 'All instruments', clears the search keyword text 
field and performs a search with these criteria. Validate the results.
  [Automation Testing]
7. Check that if (and only if) you have the 'data_dict_edit' permission you can edit 
the Description field. Edit a description, access the Candidate Profile page and 
access the Data Dictionary page again. Make sure the edit was saved.
  [Automation Testing]
8. Make sure that search keywords are not case-sensitive and that when you specify 
more than one keyword, the search returns entries that match the whole string.
  [Automation Testing] 
9. Check that you can navigate through the search result pages (both by clicking on 
the numbers and arrows in the bottom right corner of the table).
  [Automation Testing]
10. Check that the maximum rows displayed dropdown works, also check that the 
download table as CSV works as well.
  [Automation Testing]
11. Check that the `tools/exporters/data_dictionary_builder.php` works. Try changing 
field names in an instrument before running the script and make sure that the 
corresponding entries in Data Dictionary are updated correctly.
