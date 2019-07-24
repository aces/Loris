#Configuration Test Plan

1. Verify that the Config menu item only appears in the Admin main menu if the user has permission "config".
  [Automation Test on Travis CI]
2. Verify that you can only load the configuration module if the user has permission "config".
  [Automation Test on Travis CI]
3. Load the config module. Roll over each of the config labels to see if it gives a description of that setting.
  [Automation Test on Travis CI]
4. Go through each field in the configuration module. For each field where there is a single text area or radio input to enter data, try changing the value and pressing save at the bottom of the page. Refresh the page and check that the value actually persists. Try to see if the change actually affected LORIS in some way. For example, for the project description in the dashboard settings, go to the dashboard to see if the project description actually changed.
        * Some settings will break LORIS, like changing the base path, or Main project URL, so be wary.
   [Manual Test] 
5. Each of the fields in the configuration module that have the "Add field" button are configuration values that allow multiple entries. For each of these fields:
        * try clicking the "Add field" button to see that this adds a new field to enter data. Enter data and press save at the bottom of the page. Refresh the page, check that the data saved
        * try deleting a field with the 'X' button. Press save at the bottom of the page. Refresh the page and check that the field was in fact deleted
 [Manual Test]
6. Check that by setting 'Sandbox' in the config.xml to 1, the config tag names appear in grey below their labels.
 [Automation Test]
7. Check that the fields overridden in the config.xml appear greyed out in the config module and not editable.
 [Automation Test]
8. Verify that Help section content and Developer's guide is complete, accurate and up-to-date.
 [Automation Test]
## Subproject
1. Click on the subproject link at the top of the page and confirm that it brings you to the subproject configuration page.
   [Automation Test on Travis CI]
2. Click the 'New SubprojectID' in the left column navigation. Test adding a new subproject.
   [Manual Test]
3. Test editing a currently existing subproject. Test resetting the form as well with the reset button.
   [Manual Test]
4. Test the breadcrumbs to see if you can navigate back to the main config page.
   [Automation Test]

## Project

1. Click on the project link at the top of the page and confirm that it brings you to the project configuration page.[Manual Test]
2. Click the 'New ProjectID' in the left column navigation. Try to add a new project.[Manual Test]
3. Test editing a currently existing project. Test resetting the form as well with the reset button.[Manual Test]
4. Test the breadcrumb to see if you can navigate back to the main config page.[Automation Test]
5. Go back to the project configuration page and click on the subproject link and confirm that it brings you to the subproject configuration page.[Manual Test]
