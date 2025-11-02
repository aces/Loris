# Basic GUI Functionality

- This test plan tests the GUI and data access functionality of the Data Query Tool (Beta).

## Table of Contents

1. [Data Query Tool Permission](data_query-tool-permission)
2. [Data Dictionary Permission](#data-dictionary-permission)
   - [Define Fields](#define-fields)
   - [Define Filters](#define-filters)
   - [View Data](#view-data)
   - [Nested Condition groups](#nested-condition-groups)
3. [Access Profile Permission]

## Data Query Tool Permission

1. Begin by assigning your user with **no** permissions.
   - For this user, add one site, and one project, for example: Rome, Pumpernickel

2. Add the follow permission for the first basic test:
   - [x] Data Query Tool (Beta) : Cross-Modality Data
   - Load the Data Query Tool (Beta) and assert that you see: `403: Forbidden. You do not have access`

## Data Dictionary Permission

1. To begin the basic GUI functionality of the module, add the following permission:
   - [x] Data Dictionary: Parameter Type Descriptions.

2. Load the Data Query Tool (Beta) and assert that you access the module
   - Assert that you can collapse and expand the `Next Steps` window on the bottom right of the page.
   - Assert that you can expand and collapse both the `Instructions` pane and the `Recent queries` pane.

### Define Fields 
[image]

#### This portion of the test exhaustively runs through the totality of the functionality within the `>Define Fields` section [insert image] within this permission

1. Click on `Continue to Define Fields` and assert that you are taken to `>Define Fields` 
2. Assert that the `Available Fields` `field (which says "Select a category") shows 'No options'.
3. Assert that PSCID is selected **by default** in the `Selected Fields` [insert image].
4. Click on `Clear` and assert that the list is cleared (empty)
5. Click on the trash can icon [image] in the `Selected Fields` section and assert that the screen goes blank (MAKE ISSUE HERE - you can't navigate)
6. Click `Run Query` and assert that you get a swalfire error and hit `ok`
7. After hitting `ok`, assert that you are now in `View Data` [insert image]

### View Data
[image]

- Select each option in the `Header Display Format` field and
- Select each option in the `Display visits as` field and asert the following:
- [x] Display empty visits ? appears when `Inline Values (no download)` is selected
[insert image]
- Select each option in the `Display options as` field

### Define Filters

1. Click `Modify Fields` in the `Next Steps` window and assert that it replicates the behaviour of clicking `Continue to Define Fields`
2. Click on `Add Filters` and assert that you are taken into the `Current Query` Area
3. Click on `Add Condition` and assert that you see no `category` (where is says 'Select a category') and no `field options` (where it says 'Select a field') [MAKE ISSUE HERE for the word field appearing twice]`
   - In the resulting modal window [insert are you sure image], select `Cancel`, and, assert that you remain in the `Add Criteria` modal window.
4. Click on `x` again, and, this time, hit `Proceed`. Assert that you return to the `Current Query` Area
5. Click on `Add Condition` and hit `Submit`. 
   - assert that you get a swalfire modal window that says: `Invalid Field. You must select a field for the criteria` [insert image]. 
6. You will be reutned to the `Add Criteria` modal, hit submit, and `Proceed` to exit.
   - Assert that you return to the `Current Query` area.

7. Click on `Show advanced` and assert that window expands
8. Click on `Hide advanced` and assert that the window collapses

### Nested Condition Groups

1. While in `>Define Fiters`[show image], click on `Show Advanced` to access the or / and condition groups.
   - Click on `Add nested "or" condition groups` and assert that you are taken to a new Query Area with one indented greyed-out row , one non-indented non-grey row. [image]
2. Assert that by clicking on the trash can on the right you are returned to the previous Current Query Area 
3. Assert that clicking `>Define Filters` will **NOT** return you back to the previous `Query Area`. MAKE ISSUE HERE. Assert that a greyed out row has been added with the options .

#### or condition

1. Click on `Add "or" condition to group` in both the grey row and the non-grey row and assert that you are taken to the `add criteria` in both cases, and hit `x` and `Proceed` to exit and assert that you are returned to the Current Query Area with the Add "or" and Add "and" buttons in two separate rows, one grey, one non-grey
2. Click on `Add nested "or" condition groups` again
   - click on `New "or" subgroup` and assert that a new greyrow appears separated by the word `and`
3. Assert that by clicking the trash can on the right side of the row, the row is deleted.

#### and condition

1. Click on `Add "and" condition to group` in both the grey row and the non-grey row and assert that you are taken to the `add criteria` in both cases, and hit `x` and `Proceed` to exit and assert that you are returned to the Current Query Area with the Add "or" and Add "and" buttons in two separate rows, one grey, one non-grey
2. Click on `Add nested "and" condition groups` again
   - click on `New "and" subgroup` and assert that a new grey row appears separated by the word `or`
3. Assert that by clicking the trash can on the right side of the last remaining row, you are taken back to the `Current Query` Area with the window expanded
4. Assert that by clicking the trash can on the right side of the last remaining row, you are taken back to the `Current Query` Area with the window expanded.

#### Import from CSV

1. Click on `Import from CSV'
   - assert that a new modal window opens saying 'Import population From CSV'
   - select the radio buttons and assert
2. hit 'Browse' and to enter your Browser's file-picker and upload the following file tpyes:
   1. an empty file (0 bytes) ending in .<anything but csv>
   2. an empty file (0 bytes) ending in .csv

#### Now the basic GUI functionality is tested

## Access Profile Permission

- This permission adds some data to the module, opening up some GUI functionality which will be tested here.

- [x] Access Profile: Candidates and Timepoints - Own Sites

1. Click `Continue to Define Fields` and assert that you see four instruments in the `Available Fields':
`Bmi calculator`,`Medical history`,`Mri parameter`,`Radiology review`

2. Select 'Bmi calculator' and assert that you see the BMI Calculator fields: [image]
3. Assert that PSCID is selected by default in the 'Selected Fields' list

### Fields

1. Highlight the first four fields, and assert that they all appear in the `Selected fields` area on the right.
2. Assert that by de-highlighting the fourth field, it disappears from the `Selected Fields` area
3. Assert that by clicking the trash can next to the third field in the `Selected Fields` area, it is also deleted, and the field is no longer highlighted [ ISSUE - the screen scrolls here]
4. Hit `Clear` and assert that the selected fields have disappeared
5. Click `Add all` and assert that all fields have been added
6. Click `Delete all` and assert that all have been deleted
7. Click on the filter within category box and enter  lower cas `k`. 
   - Assert that it fuzzy match fields `bmi_Date_taken` and `bmi_weight_kgs` only

### Visits

1. Assert that you have a selection of visits in Default Visits
2. Assert that this list is not multi-select
3. Select `V1` and assert that it appears in grey in the `Default Visits` box.
4. Assert that `V1` has been removed from the list,
5. Remove the `V1` visit from the fourth by clicking the `x` of the visit itself (not the field)
   - assert that the visit has been removed
6. Assert that you can put the visit back into the fourth field
   - clicking the downward arrow to find it
7. Add a second field, `V2` to `Default Visits` and check each of your selected fields to see if you can add `V2`. Assert that you can not do so.
. Highlight a 5th field and assert that it takes on visit `V1` and that you can not add other visits.
[image]
8. Check the `Sync with selected fields` box [ISSUE]

### Run Query

1. Click modify fields, Select all fields with only visit `V1` and hit `Run Query`. This will take you to View Data. Assert that the screen says `Query not yet run` and that it completes the query by saying `No result found' [this could be a better, more thorough message]


#### Persistant Fields

1. Click on `Modify Fields` and assert that your field and visit selections have persisted
2. Add a second visit, V2 and check `sync with selected fields` and assert that the second visit is added on all fields in the grey highlight section and in the selected fields section. [why is this doubled]


#### find some basic meaningful queries with raisinbread data#####

### Add Filters

1. Click `Add Filters`, `Add Condition` and assert that in the category, you can see all 4 instruments
2. Assert that in the fields you can see *all* fields for each instrument
3. Select instrument: `Medical History`, Field: `Candidate Age (Months)` and hit submit

## Panels

- Re-enable the following permission :
- [x] Data Query Tool: View/Download Cross-Modality Data

1. Assert that the following panels collapse and open :

   - Instructions
   - Recent Queries
   - Next Steps (in the bottom-right corner)

2. Assert that `Continue to Define Fields` button in the main panel, and `Choose Fields` button in the `Next Steps` panel are redirecting to the same page.

## Recent Queries

1. Assert that the queries you made have their fields and filters correctly displayed
2. Assert that `text filter` immediately filters the queries.
3. Assert that clicking `Collapse queries` effectively collapses all queries.

## Icons

- Performing the following actions:
- `Star`: should have a yellow star
- `Name` a query
- `Share` should have a blue shared state
- `Rerun` a query

1. Assert that using the `Starred Only` checkbox filter only keeps the starred ones.
2. Assert that removing the `Starred Only` checkbox prints the same queries originally printed.
3. Assert that using the `Shared only` checkbox filter only keeps the shared ones
4. Assert that the  `Named Only` checkbox filter only keeps the Named ones.
5. Assert that the 'No run times' checkbox filter only keeps the `No run times`
6. Assert that mixing checkboxes returns the right query selection. Only queries that match all of the checked conditions should be displayed.
7. Remove all pinned queries and assert that there is no `Study Queries` panel at the top of the page.

## Pin

**You will need `admin` permission for the following tests.

- Click the `Pin` icon to perform the following tests 

1. With the `query name` text field empty, click the `Submit` button and assert that the error message reads:

   `Must provide a query name to pin query as.`
2. Enter a query name and uncheck the following:

   - [ ] `Pin Study Query`
   - [ ] `Pin Dashboard Summary`
   - [ ] `Pin to Login Page`

3. Click 'Submit' and assert that the error message reads : `Must pin as study query, to dashboard, or to the login page.`
4. Check the following box [x]`Pin Study Query`

   - click the submit button and assert that the query is now pinned at the top of the page in the `Study Queries` panel
5. Go to LORIS main page by clicking the **LORIS** name in the top-left corner

   - assert that the query is **not** displayed inside the right-side `Study Queries` panel
6. Return to the module's splash page and pin a query, only checking the `Pin Dashboard Summary`

   - Assert that the query is **not** pinned at the top of the page in the `Study Queries` panel
7. Assert that the query is displayed inside the `Study Queries` panel on the right side
8. Click the pinned query. Assert that `Loaded Query` is displayed.
9. Pin a query with `Pin Study Query`. Assert the selected query is displayed in **both** the dataquery module Study Query Section and in the LORIS login page.
10. `Pin Dashboard Summary` and `Pin to Login Page` options.
   -  Assert that `Study Queries` in the dataquery module **and** `Study Queries` in LORIS welcome page **and** `Data in LORIS` on the LORIS Login Page are displayed.

   - Assert that the query is now pinned at the top of the page, in `Study Queries` panel.

11. Assert that: `starred queries` are available in the right side `Starred Queries` panel.

12. Assert that: clicking on any `starred query` sends you back to dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).

13. Assert that: clicking on any `study query` sends you back to the dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).
