#Configuration Test Plan

1. Verify that Config module appears in Admin main menu only if the user has permission "config".
2. Verify that you can only load the configuration module if the user has permission "config".
3. Click on all the drop down arrows to see if they expand sections properly.
4. Check that each leaf field has a form area to edit the configuration value. If there is no form area, check that there is at least a button to add a field.
5. Go through each field in the configuration module. For each field where there is a single text area to enter data, try changing the value and pressing enter. The page should refresh and you should be able to check to see if the value changed. Try to see if the change actually affected LORIS in some way. For example, for the project description in the dashboard settings, go to the dashboard to see if the project description actually changed.
	* Changing the base path will break LORIS, so keep this in mind
6. For each of the fields in the configuration module that have the "Add field" button, are configuration values that allow multiple entries. For each of these fields"
	* try clicking the "Add field" button to see that this adds a new field to enter data. Enter data and press enter. When the page refreshes, check that the data saved
	* try deleting a field with the "Remove" link. When the page refreshes, check that the field was in fact deleted
7. Verify that Help section content and Developer's guide is complete, accurate and up-to-date. 
