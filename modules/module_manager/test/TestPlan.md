# Module Manager Test Plan

1. Verify that the module loads with either `module_manager_view` or `module_manager_edit`
   permissions [automated]
2. Verify that the module has a permission denied error with neither of the above permissions
   [automated]
3. Verify that the "Active" column is a dropdown with the edit permission, but plain text without
4. Verify that the "Active" filter works in either of the above cases
5. With the edit permission, change the active status of a module. There should be a success
   message.
6. Reload the page and verify that the status was, in fact, successfully modified and saved to
   the database.
7. Verify that deactivating a module removes it from the LORIS menu (you will need to
   reload after modifying for the menu to be updated) and that activating it re-adds it.
8. With the edit permission, access the page. From the backend or another tab, remove the edit
   permission and modify the "Active" status of a module. Verify that instead of a success message 
   you received an error message and the module status was not modified.

