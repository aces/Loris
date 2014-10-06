#Configuration Test Plan

1. Check permissions. You should only be able to access the page if you have the config permission.
2. Click on all the drop down arrows to see if they expand sections properly.
3. Check that each leaf field has a form area to edit the configuration value. If there is no form area, check that there is at least a button to add a field.
4. Go through each field in the configuration module. For each field where there is a single text area to enter data, try changing the value and pressing enter. The page should refresh and you should be able to check to see if the value changed. Try to see if the change actually affected LORIS in some way. For example, for the project description in the dashboard settings, go to the dashboard to see if the project description actually changed.
* Some field changes may break LORIS (like some of the path settings), so keep this in mind
6. For each of the fields in the configuration module that have the "Add field" button, are configuration values that allow multiple entries. For each of these fields"
* try clicking the "Add field" button to see that this adds a new field to enter data. Enter data and press enter. When the page refreshes, check that the data saved
* try deleting a field with the "Remove" link. When the page refreshes, check that the field was in fact deleted