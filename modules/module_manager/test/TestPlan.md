# Module Manager Test Plan

1. Access the module manager page and make sure the page renders.  
2. Change maximum rows per page. Ensure that the number of rows displayed changes correspondingly each time.  
3. Navigate through pages by selecting the page numbers at the top right of the result section and the bottom right of the result section.  
4. Navigate from first to last page & vice versa using the double arrows at the top right of the result section and the bottom right of the result section.  
5. Download the table as CSV. Make sure that the file downloads and that the contents of the file correspond exactly to the contents of the results table, including column and row order.  
6. Select some filters to reduce the size of the data set. Click to download the table as CSV. Make sure that the file downloads and that the contents of the file correspond exactly to the filtered results displayed in the table, including column and row order.  
7. Select filters in each category, make sure that the results change corresponding to what is selected.  
8. Select combinations of various filters, make sure that the results change corresponding to what is selected.  
9. Select several filters to reduce the size of the data set, and then select clear filters. Make sure that it returns to the full data set and that each filter is cleared.  
10. Click on the column header to make sure that the rows re-organize to be ordered by the selected column. Click the same one again to make sure that it now organizes in reverse order. Try this with each of the columns.  
11. Verify that the module loads with either `module_manager_view` or `module_manager_edit` permissions [automated]
12. Verify that the module has a permission denied error with neither of the above permissions [automated]
13. Verify that the "Active" column is a dropdown with the edit permission, but plain text without
14. Verify that the "Active" filter works in either of the above cases
15. With the edit permission, change the active status of a module. There should be a success message.
16. Reload the page and verify that the status was, in fact, successfully modified and saved to the database.
17. Verify that deactivating a module removes it from the LORIS menu (you will need to reload after modifying for the menu to be updated) and that activating it re-adds it.
18. With the edit permission, access the page. From the backend or another tab, remove the edit permission and modify the "Active" status of a module. Verify that instead of a success message you received an error message and the module status was not modified.

