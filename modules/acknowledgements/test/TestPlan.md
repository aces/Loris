# Acknowledgements Module Test Plan

Covered by integration tests with 100% coverage.

1. Verify that either the permission acknowledgements_view or acknowledgements_edit 
   is required to access the acknowledgements module page. [Automation Testing]
2. Access the acknowledgements module page, ensure that it renders.[Automation Testing]
3. Verify that a new record can not be added Without acknowledgements_edit permission [Automation Testing]
4. Check that each dropdown has the correct options.[Manual Testing]
5. Click "Clear Filter" and ensure filters are reset the default state.[Automation Testing]
6. Verify that the "Save" button on the modal window form inserts a new record in the 
   data table and that the data table is refreshed automatically.[Automation Testing]
7. Start entering information in the modal window form and close the modal window 
   without saving. A message asking 'Are You Sure?' should appear to confirm that the
   form should indeed be closed without saving the information previously entered [Automation Testing]
8. Modify the "citation_policy" setting in the LORIS configuration module and ensure that the citation policy
   at the top of the page is modified.[Automation Testing]
