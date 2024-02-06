# Configuration Test Plan

1. Make sure the _Configuration_ entry in the _Admin_ menu only appears if the logged in 
user has the _Configuration: View/Edit Settings_ (`config`) and that the user can 
only access the module when given the permission.
  [Automation Test on Travis CI]
2. Load the config module. Roll over each of the config labels to see if it gives a 
description of that setting.
  [Automation Test on Travis CI]
3. Go through at least 1 field of each type (text, radio button, multiple entries, ...) 
in the configuration module. For each field where there is a single text area or 
radio input to enter data, try changing the value and pressing save at the bottom of 
the page. Refresh the page and check that the value actually persists. Try to see if 
the change actually affected LORIS in some way. For example, for the project description 
in the dashboard settings, go to the dashboard to see if the project description actually changed.
   [Manual Test]
   >Some settings will break LORIS, like changing the base path, or Main project 
 URL, so be wary.
4. Boolean configurations in the database can be either set to `1/0` or `true/false`.
   - make sure that changing the value from the module does not alter the type of 
   boolean (`1/0` or `true/false`) in the database but only alters it's value. 
   - manually change, in the database, the type of boolean (from `true/false` to `1/0`
    for example) and make sure that updating the value from the front end subsequently 
    only changes the value again without reverting the type to `true/false`.
  [Manual Test]
5. Choose a field in the configuration module that have the 
"Add field" button. These are configuration values that allow multiple entries. 
   - try clicking the "Add field" button to see that this adds a new field to enter 
   data. Enter data and press save at the bottom of the page. Refresh the page, check
   that the data saved
   - try deleting a field with the 'X' button. A dialog box should ask for confirmation.
   Try canceling and accepting the delete action.
   Refresh the page and check that the field was in fact deleted if the action was confirmed.
   Check that if the field is empty, the dialog box is not displayed when trying to delete the empty field.
  [Manual Test]
6. Check that by setting 'Sandbox' in the config.xml to 1, the config tag names 
appear in grey below their labels.
  [Automation Test]
7. Check that the fields overridden in the config.xml appear greyed out in the config 
module and not editable.
  [Automation Test]
8. Verify that Help section content and Developer's guide is complete, accurate and 
up-to-date.
  [Manual Test]
 
## Cohort

1. Click on the cohort link at the top of the page and confirm that it brings you
to the cohort configuration page.
  [Automation Test on Travis CI]
2. Click the 'New CohortID' in the left column navigation. Test adding a new 
cohort.
  [Manual Test]
3. Test editing a currently existing cohort. Test resetting the form as well with
the reset button.
  [Manual Test]
4. Test the breadcrumbs to see if you can navigate back to the main config page.
  [Automation Test]

## Project

1. Click on the project link at the top of the page and confirm that it brings you to
the project configuration page.
  [Manual Test]
2. Click the 'New ProjectID' in the left column navigation. Try to add a new project.
  [Manual Test]
3. Test editing a currently existing project. Test resetting the form as well with 
the reset button.
  [Manual Test]
4. Confirm that the related cohorts are correct. This information comes from the 
project_cohort_rel table in the database.
  [Manual Test]
5. Test the breadcrumb to see if you can navigate back to the main config page.
  [Automation Test]
6. Go back to the project configuration page. Click on the cohort link at the top of the page and
confirm that it brings you to the cohort configuration page.
  [Manual Test]

## Diagnosis Evolution 

1. Click on the diagnosis evolution link at the top of the page and confirm that it brings you to
the diagnosis trajectory configuration page.
  [Manual Test]
2. Click the 'New Diagnosis Trajectory' tab in the left column navigation. Try to add a new trajectory.
  [Manual Test]
3. Test that you cannot add a diagnosis trajectory for any source field or instrument that does not exist in the selected visit. Also test that you can add multiple source fields.
  [Manual Test]
4. Validate that you cannot create duplicate trajectory names.
  [Manual Test]
5. Validate that you cannot duplicate an order number within the same project.
  [Manual Test]
6. Test editing a currently existing trajectory. Test resetting the form as well with 
the reset button.
  [Manual Test]
7. Test deleting a currently existing trajectory. 
8. Test the breadcrumb to see if you can navigate back to the main config page.
  [Automation Test]
