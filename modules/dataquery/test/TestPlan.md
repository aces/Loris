# Data Query Tool Test Plan

- This test plan tests the Data Query Tool (Beta) by adding permissions incrementally to see how the module changes its GUI and data access behaviour.
- Each Section of the Global Table of Contents has its own table of contents.
- Begin by assigning your user with **no** permissions, and for this user, add one site, and one project, for example: Rome, Pumpernickel. Then Add the follow permission for the first basic permission test:

- [x] Data Query Tool (Beta) : Cross-Modality Data
- Load the Data Query Tool (Beta) and assert that you see: `403: Forbidden. You do not have access`

[ISSUE: I think it's counter-intuitive to add the permission only to find out you don't have access and that, actually, you also need data dictionary permission to access the module]

Now we will add permissions incrementally according to the following Global Table of Contents:

## Global Table of Contents

1. [Data Dictionary Permission](#data-dictionary-permission)
2. [Access Profile Permission](#access-profile-permission)
3. [Candidate Parameters](#candidate-parameters-permission)
4. [Instruments Data Permission](#instruments-data-permission)

[ISSUE is the miniumum permissions schema actually ALL of these ? Should they be separate ?]

## Data Dictionary Permission

This section tests the basic GUI functionality of the module **without access to any fields or their data**

### Table of Contents

1. [Define Fields](#define-fields)
2. [Define Filters](#define-filters)
   - [Nested Condition Groups](#nested-condition-groups)
      - [or condition](#or-condition)
      - [and condition](#and-condition)
3. [Import from CSV](#import-from-csv)
4. [View Data](#view-data)

### Data Query Tool (Beta)

![alt text](<Screenshot from 2025-11-03 11-19-45.png>)

- Add the following permission:
  - [x] Data Dictionary: Parameter Type Descriptions.

1. Load the Data Query Tool (Beta) and assert that you access the module
2. Assert that you can collapseThis section tests the basic GUI functionality of the module **without access to any fields or their data** and expand the `Next Steps` window on the bottom right of the page.
3. Assert that you can expand and collapse the `Study Queries` pane, the`Instructions` pane, and the `Recent queries` pane.

## Define Fields

![alt text](<Screenshot from 2025-11-01 17-15-00.png>)

The user can navigate to `Define Fields` in 2 ways:

1. Click on `Continue to Define Fields` in the `Instructions` pane.
2. Click on `Modify Fields` in `Next Steps`

- Within the `Instructions` pane, Click on `Continue to Define Fields`
   1. Assert that you are taken to `>Define Fields`
   2. Return to the splash page by clicking `>Data Query Tool` and click `Modify Fields` in the `Next Steps` window. Assert that it replicates the behaviour of clicking `Continue to Define Fields`
   3. Assert that the `Available Fields` `field (which says "Select a category") shows 'No options'.
   4. Assert that `PSCID - Project Candidate Identifier` is selected **by default** in the `Selected Fields`
[ISSUE : do we need to include both the acronym and the full ?]
   5. Click on `Clear` and assert that the list is cleared (empty)
   6. Click on the trash can icon [image] in the `Selected Fields` section and assert that the screen goes blank (MAKE ISSUE HERE - you can't navigate)
[OTHER ISSUE: does the screen need to scroll to an imprcise vertical point indicating that the field has been erased ???]
   7. Click `Run Query` and assert that you get a swalfire error and hit `ok`
   8. After hitting `ok`, assert that you are now in `View Data` [insert image]

***********************************************************
Go to : [Global Table of Contents](#table-of-contents)

## Define Filters

![alt text](<Screenshot from 2025-11-03 11-28-50.png>)

To get to `Define Filters`, click on `Add Filters` in `Next Steps`(bottom right of page)

1. Click on `Add Filters` and assert that you are taken into the `Current Query` Area
2. Click on `Add Condition` and assert that you see no `category` (where is says 'Select a category') and no `field options` (where it says 'Select a field') [MAKE ISSUE HERE for the word field appearing twice]`
   - In the resulting modal window [insert are you sure image], select `Cancel`, and, assert that you remain in the `Add Criteria` modal window.
3. Click on `x` again, and, this time, hit `Proceed`. Assert that you return to the `Current Query` Area
4. Click on `Add Condition` and hit `Submit`.
   - assert that you get a swalfire modal window that says: `Invalid Field. You must select a field for the criteria` [insert image].
5. You will be reutned to the `Add Criteria` modal, hit submit, and `Proceed` to exit.
   - Assert that you return to the `Current Query` area.

6. Click on `Show advanced` and assert that window expands
7. Click on `Hide advanced` and assert that the window collapses

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

1. Click on `Add "and" condition to group` in both the grey row and the non-grey row and assert that you are taken to the `add criteria` in both cases.
2. hit `x` and `Proceed` to exit and assert that you are returned to the Current Query Area with the Add "or" and Add "and" buttons in two separate rows, one grey, one non-grey
3. Click on `Add nested "and" condition groups` again
   - click on `New "and" subgroup` and assert that a new grey row appears separated by the word `or`
4. Assert that by clicking the trash can on the right side of the last remaining row, you are taken back to the `Current Query` Area with the window expanded
5. Assert that by clicking the trash can on the right side of the last remaining row, you are taken back to the `Current Query` Area with the window expanded.

### Import from CSV

1. Click on `Import from CSV'
   - assert that a new modal window opens saying 'Import population From CSV'
   - select the radio buttons and assert
2. hit 'Browse' and to enter your Browser's file-picker and upload the following file types:
   1. an empty file (0 bytes) ending in .<anything but csv>
   2. an empty file (0 bytes) ending in .csv
   [ISSUE - MORE ROBUST csv handling]

### View Data

![alt text](<Screenshot from 2025-11-01 18-08-54.png>)

The user can navigate to `View Data` by clicking `Run Query`

- Click `Run Query` and assert that you get an Swalfire error modal saying `Error: Error Creating Query`
[ISSUE - error message could be more precise]
- Select each option in the `Header Display Format` field an  
- Select each option in the `Display visits as` field and assert the following:
  - `x Display empty visits ?` appears when `Inline Values (no download)` is selected
- Select each option in the `Display options as` field

***********************************************************
Go to : [Global Table of Contents](#global-table-of-contents)
/ [Define Filters](#define-filters)

## Access Profile Permission

**This permission allows the module to access candidates and thereby display their data.**

Table of Contents

1. [Fields](#fields)
2. [Visits](#visits)
3. [Query Samples](#query-samples)
4. [Run Query](#run-query)
5. [Icons](#icons)
   - [Star](#star)
   - [Name](#name)
   - [Shared](#shared)
6. [Checkboxes](#checkboxes)
   - [Callapse Queries](#collapse-queries)
   - [No Run Times](#no-run-times)
   - [Mix Checkboxes(#mix-checkboxes)]
7. [Pin](#pin)

- [x] Access Profile: Candidates and Timepoints - Own Sites
[ISSUE - why are instruments being added here]

1. Click `Continue to Define Fields` and assert that you see four instruments in the `Available Fields':
`Bmi calculator`,`Medical history`,`Mri parameter`,`Radiology review`

2. Assert that PSCID is selected **by default** in the 'Selected Fields' list
3. Select 'Bmi calculator' and assert that you see the BMI Calculator fields as follows:

`bmi_Administration`, `bmi_data_entry`, `bmi_validity`, `bmi_date_taken`, `bmi_Candidate_Age`, `bmi_Window_Difference`, `bmi_Examiner`, `bmi_unit_classification`, `bmi_height_feet`, `bmi_height_inches`, `bmi_weight_lbs`, `bmi_height_cms`, `bmi_weight_kgs`, `bmi_bmi`, `bmi_bmi_category`

4. Go into the /instruments folder and assert that all fields are in the bmi.linst

### Fields

1. Enter the letter 'b' in the `Filter within Category` area and assert that **only** BMI instrument fields are shown and that **all** BMI instrument category fields are shown.
2. Enter the letter `j` in the `Filter within Category` area and assert that there are no fields shown. This means that no fields contain this letter at any position in the string
3. Enter the letter `k` and assert that only `bmi_Date_taken` and `bmi_weight_kgs` are shown. Then

- Remove the `k` from filter

1. Highlight all fields by clicking 'Add All'. Assert that they are all highlighted and that they all appear in the `Selected Fields` area on the right.
2. Click `Remove All` and assert that they are all removed from `Selected Fields`
3. Click `Add All` again, de-select some fields, and assert that they have disappeared from the `Selected Fields`.
4. Click the trash can next to the 'bmi_Administration field in the `Selected Area` and assert that it is de-selected in the (no longer highlighted) in the main table. [ ISSUE - the screen scrolls here]
5. hit `Clear` in the `Selecte fields` Area and assert that all fields have been removed from that area and de-selected in the main table

### Visits

1. Assert that you have a selection of visits in `Default Visits`
2. Assert that this list is not multi-select
3. Select `V1` and assert that it appears in grey in the `Default Visits` box.
4. Assert that `V1` has been removed from the list
5. Remove the `V1` visit from the fourth by clicking the `x` of the visit itself (not the field)
   - assert that the visit has been removed
6. Assert that you can put the visit back into the fourth field
   - clicking the downward arrow to find it
7. Add a second field, `V2` to `Default Visits` and check each of your selected fields to see if you can add `V2`. Assert that you can not do so.
. Highlight a 5th field and assert that it takes on visit `V1` and that you can not add other visits.
[image]
8. Check the `Sync with selected fields` box [ISSUE]

### Run Query

Now we will build a basic query to test. We'll use the basic parameters necessary for BMI calculation:
height, weight, bmi, and, we will include a fourth parameter: age. 

**Note: this test will not return data** Instead it will read: "Query not yet Run" 
[ISSUE: Is this the right message?]. When the Candidate Parameters Permission is enabled, it will run actual data.

The workflow:

- The user defines their query and, when the `Run Query` button is selected, the query is saved **without a title**.
- The query remains 'active', in the sense that its fields and filters persist in the browser memory. This allows the user to modify, add, and remove whatever they want and re-run the query, thereby saving a new query.

- Select the following fields: bmi_Candidate_Age, bmi_height_cms, bmi_weight_kgs, bmi_bmi and hit `Run Query` [ISSUE - this shows query not yet run, unresolving]

1. Assert that the screen says `Query not yet run` and that it completes the query by saying `No result found' [this could be a better, more thorough message]
2. Click on `>Data Query tool` (the first item) and assert that your query is now at the top of the list (if not the only item) in `Recent Queries`.
3. Click on `Modify Fields` and assert that your selected fields are the same as they were when you ran the query.
4. Add `bmi_bmi_category` and hit `Run Query` and assert that your get `Query not yet run` and no other message
5. Return to the splash page and assert that you now have 2 Queries, listed in this order:
   1. The last BMI Query consisting established here [link] consisting of the fields: "Project Candidate Identifier", "Your height (cms)" [ISSUE,] (it's not your height), "Your weight (kgs)", "Your BMI", "Candidate Age (Months)", and finally "Your BMI Classification".
   2. The original query as described listed [link here] consisting of all the above fields except for "Your Classification".

   This test shows that by selecting the fields of a first query, running the query, then by modifying the fields, adding a field, and by running the query again, you can create to separate queries.

### Icons

- The Icons are situated at the top of each query. Star, Globe, Rotating Arrows, and Pencil

#### Star

The star allows select queries. By tickign the `Starred Only` check box, the Data Query Tool will display only your selecte queries.

   1. Assert that when clicked, the star becomes yellow.
   2. Click the star in the first query and select `Starred Only`
      - Assert that you see only the query from the top of the list
   3. Assert that, by removing the `Starred Only` checkbox, all of your queries are shown.

#### Name

The pencil query allows you to give your query a name.

- Click the pencil icon on the first query and name your query "BMI with Classification"
   1. Assert that the Query has been renamed as typed

- Click on `Named Only`
   1. Assert that you see only the "BMI with Classification" Query in the list

#### Shared

The globe icon allows you to share your query with other users (who have what? how do I test this???)

- Click on the Globe icon in the second query in the list.
   1. Assert that the Globe icon turns blue
   2. Assert that clicking the `Shared Only` shows only the second query in the list
   3. Assert that this query appears in the Shared Queries pane

- `Rerun` (rotating arrows) a query

#### Reload

The rotating arrows icon allows you to load a former query that has been sroried in "Recent Queries". You can therefore start where you left off, add fields, add filters, and save it again. It will be saved as a new query.

- Load the "Bmi with Classification" query by clicking on the rotating arrows. 

1. Assert that a Swalfire modal appears stating 'Query Loaded : Successfully Loaded Query [ISSUE this is redundant messaging]
2. Remove the PSCID field and add the CandID field. Then hit `Run Query`. Assert that it returns "Query not Run" [ISSUE - Why is it not running] ?
3. click on `>Data Query Tool to return to the splash page in order to view your query - [ISSUE: it does not return]
4. Assert that the query you jsut redefined is situated at the top of the `Recent Queries list`

### Checkboxes

#### Collapse queries

- This causes the queries to collapse, reducing their vertical space-occupation
- Assert that, by tickign this box, it collapses them

#### No Run Times

The `No Run Times` checkbox performs 2 functions:

- Makes the date and time of the query invisible. So, assert that, when it is ticked, that the `No run times` checkbox filter makes the date and time dissappear.

- Eliminates one of two queries that have the exact same parameters (the same fields and filters and conditions). 

1. Assert that, when you click the `No run times` checkbox filter, that the date and times of all queries disappear

2. To test the second functionality, create two complex queries with exactly the same parameters, check the box, and assert that the second query has disappeared.


#### Mix Check Boxes

Finally, mix the checkboxes to assert that they filter the queries correctly.

***********************************************************
Go to : [Global Table of Contents](#global-table-of-contents)
/ [Access Profile Permission](#access-profile-permission)

IS THE PIN RELEVENT ANYMORE ?

### Pin

The pin affords user the option to place a selected query in three different locations in the LORIS website: 1. The module itself, 2. the dashboard page, 3. the login page

[Issue: does pin to login work]??

in `>Data Query Tool` :

- Click the `Pin` icon to perform the following tests

[insert image]

1. With the `query name` text field empty, click the `Submit` button and assert that the error message reads:

   `Must provide a query name to pin query as.`
2. Enter a query name and uncheck the following:

   - [ ] `Pin Study Query` (could be pin to study query panel)
   - [ ] `Pin Dashboard Summary`
   - [ ] `Pin to Login Page`

   [ISSUE pin "to" ??? Dashboard summary  ]

3. Click 'Submit' and assert that the error message reads : `Must pin as study query, to dashboard, or to the login page.`

[ISSUE this language is not clear, "esp must pin as study query". Rather: you must select an option"]

#### Pin Study Query

- Check the following box [x]`Pin Study Query`

   1. click the submit button and assert that the query is now pinned at the top of the page in the `Study Queries` panel

***************************************************
- Go to LORIS main page by clicking the **LORIS** name in the top-left corner


   2. assert that the query is **not** displayed inside the right-side `Study Queries` panel
***********************************************************************8

#### Pin to Dashboard Summary

- Return to `>Data Query Tool` in and expand the  `Recent Queries` panel, if not already expanded.

1. Click on the pin and select
   - [x] Pin to Dashboard Summary - Study Queries Panel
   - Assert that it appears in the Study Queries Panel of the Loris Dashboard

2. Click the same pinned query (in the Dashboard `Study Queries` panel). 
   - Assert that `Loaded Query` is displayed.

#### Pin to Login Page

- Pin a third query titled 'CC'

1. Assert the selected query is displayed in **both** the dataquery module Study Query Panel and in the LORIS login page.

2. Assert that: clicking on any `starred query` sends you back to dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).

3. Assert that: clicking on any `study query` sends you back to the dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).


## Candidate Parameters Permission

Table of Contents

1. [Display Data](#display-data)
2. [Display Formats](#display-formats)
3. [Ensure that no instrument data is shown](#ensure-that-no-instrument-data-is-shown)

When the Candidate Parameters permission is enabled, additional fields are added to the Data Query Tool:

In Available Fields: `Candidate identifiers`, `Candidate Demographics`, and `Other Parameters` appear.

- Candidate Identifier fields : `CandID`, `PSCID`, `flagged_caveat emptor`, `flagged_reason`, `flagged_other`
- Candidate Demographic fields: `DoB`, `DoD`, `Sex`, `EDC`
- Other Parameters: `VisitLabel`, `DateRegistered`, `CurrentStage`, `SessionFeedback`, `SessionFailure`, `Project`, `Cohort`, `Site`, `EntityType`, `ParticipantStatus`, `ParticipantStatusReason`, `ParticipantStatusComments`, `CandidateComments`, `RegistrationSite`, `RegistrationProject`

### Display data

1. Select the first of each category `CandID`, `DoB`, and `VisitLabel`, setting the visit label to `V1`, and Run the Query. This will take you to `>View Data`
   - Assert that the query returns a table of columns in this order from left to right.
   - Assert that there is data in the rows

### Display Formats

`Header display Format` : customizes the type used in the header fields. There are three choices: `Field Name`, `Field Description`, and `Field Name: Field Description`
[ISSUE: is the third one necessary ?]

- Select each one of these and observe changes to the headers

`Display visits as` has four choices by which to display the visits in the table:

1. Rows (Cross Sectional): display a row for every visit of each candidate
2. Columns (longitudinal): display a row for every candidate identifier by sorted visit (numeric or alphabetical)
[ISSUE: test the numeric or alphabetic sorting by adding visits]
3. Inline values (no download): show every visit of every candidate in one row
4. Raw JSON (debugging only) : Displays fields and **all** values regardless of visitLabel choice in javascript object notation.
   1. Assert that the CandID is displayed as an integer without quotations.
   2. Assert that all string values are quotations.

[ISSUE: why 'no download' indiciated here]

`Display Options as` has two choices: Labels and Values.

### No instrument data shown

- Modify the fields of your query: insert bmi_Date_taken and `Run Query`. 
   1. Assert that the screen reads "Query not yet run"
   [ISSUE:  again, given that this is an permissions issue, it could reflect that] 
Go to : [Global Table of Contents](#global-table-of-contents)
/ [Candidates Data Permission](#candidates-data-permission)


## Instruments Data Permission

Table of Contents