# Data Dictionary - Test Plan

1. Check that you have access to the Data Dictionary if the user has one or more of
these permissions:
   - data_dict_view (_"Data Dictionary: View Field Descriptions"_)
   - data_dict_edit (_"Data Dictionary: Edit Field Descriptions"_) or superuser
   (_"Superuser - supersedes all permissions"_).
  [Automation Testing]
2. Check that the 'Module' filter dropdown lists only the active modules that the
logged-in user can access and that actually provide a dictionary (e.g. `instruments`,
`imaging_browser`, `candidate_parameters`).
  [Automation Testing]
3. Check that the 'Category' filter dropdown is empty until a Module is selected, and
that once a Module is selected it is populated only with the categories of that module.
Changing the selected Module updates the Category options accordingly.
  [Automation Testing]
4. Perform various searches and validate the results.
 - Use any combination of the available filters ('Module', 'Category', 'Field Name',
 'Description', 'Description Status', 'Data Scope', 'Data Type', 'Data Cardinality',
 'Visits' and 'Cohort').
 - Make sure that when you choose "Empty" in the 'Description Status' filter dropdown,
 all the rows returned have an empty description.
  [Automation Testing]
5. Check that the 'Visits' and 'Cohort' multiselect filters return all relevant results
when more than one value is selected.
6. Check that the table can be sorted according to any column (ascending and descending).
  [Automation Testing]
7. Check that pushing the "Clear Filter" button resets all filters to empty.
  [Automation Testing]
8. Check that if (and only if) you have the 'data_dict_edit' permission, the edit
(pencil) icon appears on the Description column. Click it, change the text in the
"Edit Description" popup and click "Modify". Confirm the row's Description Status shows
"Modified" and displays "(edited)". Navigate away (e.g. the Candidate Profile page) and
return to the Data Dictionary; make sure the edit was saved.
  [Automation Testing]
9. Check that you can navigate through the search result pages (both by clicking on
the numbers and arrows in the bottom right corner of the table).
  [Automation Testing]
10. Check that the maximum rows displayed dropdown works, also check that the
download table as CSV works as well.
  [Automation Testing]
11. Module enable/disable behaviour. Using the Module Manager (Admin > Modules),
disable a module that provides a dictionary (e.g. `imaging_browser` or
`candidate_parameters`). Reload the Data Dictionary and confirm:
 - The module's fields no longer appear in the table.
 - The module is no longer an option in the 'Module' filter.
 - Selecting any remaining module repopulates the 'Category' filter with only that
 module's categories.
Re-enable the module and confirm its fields, 'Module' filter option, and 'Category'
filter options reappear.
12. Per-user module access. Log in as a user who does NOT have access to a specific
module that provides a dictionary. Confirm that, by design, the dictionary entries
(fields), the 'Module' filter option, and the related 'Category' options for that
module are NOT visible to that user, even though the module is active. Log in as a user
WITH access to that module and confirm the same entries and filter options are now
visible.
