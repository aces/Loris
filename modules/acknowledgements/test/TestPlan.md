# Acknowledgements Module Test Plan

1. Verify that either the permission acknowledgements_view or acknowledgements_edit 
   is required to access the acknowledgements module page. [Automation Testing]
2. Access the acknowledgements module page, ensure that it renders.[Automation Testing]
3. Without acknowledgements_edit permission can not add new record.[Automation Testing]
4. Check that each dropdown has the correct options.[Manual Testing]
5. Click "Clear Form" and ensure filters are reset to same state.[Automation Testing]
6. Verify that the "Save" button on the modal window form inserts a new record in the 
   data table and that the data table is refreshed automatically.[Automation Testing]
7. Start entering information in the modal window form and close the modal window 
   without saving. A message asking 'Are You Sure?' should appear to confirm that the
   form should indeed be closed without saving the information previously entered [Automation Testing]

