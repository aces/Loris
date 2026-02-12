# Instrument Test Plan

## Table of Contents

- [Data Entry](#data-entry)
  - [Instrument Access Tests](#instrument-access-tests)
  - [Field Entry Tests](#field-entry-tests)
  - [Configuration Tests](#configuration-tests)
- [View Instrument Data](#view-instrument-data)

In the database, these permissions are found in the `permissions` table:

|permID|code|description|moduleID|action|categoryID|
|:--|:--|:--|:--|:--|:--|
|11|data_entry|Candidates and Timepoints - Own Sites|6|View/Create|1|
|85|view_instrument_data|Data|26|View|2|

In the front end, these permissions can be accessed by entering into an admin account, then naviagting to the `Admin` drop down menu and selecting `User accounts`. 

- The permissions appear with checkboxes next to them in the `Permissions` Section of the page.

- [x] Access Profile: View/Create Candidates and Timepoints - Own Sites
- [x] Instruments: View Data

## Data Entry

### Instrument Access Tests

- In your admin account enable **only** the following permission for your user:
- [x] Access Profile - View/Create Candidates and Timepoints
- Go to your user account and click on `Candidate`-> `Access Profile`
- Click on a timepoint. This will redirect you to, for example, /instrument_list/?candID=400162$sessionID=542
- Click on an instrument
  - Assert that link to the instrument is shown, ex:`/instruments/mri_parameter_form/?commentID=400162ROM162542341471021802&sessionID=542&candID=400162`
- Assert that, if, for that instrument, the `Data Entry` column = `Complete`, that when you click on the instrument name, you are redirected to the instrument form. 
- Assert the fields are "frozen" (greyed-out and not fillable)
- Go back to the instrument list
- Assert that, if, for an instrument, if the `Data Entry` column = `In Progress` that, when you click on the instrument name, you are redirected to the instrument form
- Navigate to all the `Subtests` pages (in the left sidebar)
- Assert that all the fields of every page of the instrument form are fillable (not greyed out)

### Field Entry Tests

- If the instrument has multiple pages, enter all data for a page and hit `Save`,
  - then move to another page, then return to the first page, and assert that the saved data stays the same.
- Change some data, but don't hit save, and change page. Assert that the data that wasn't saved is not still there (ie is not persistent)
- Assert that when a field is **not** filled, and you hit `Save`, that the red-coloured "required" messages and field highlighting appears.
- Assert that when `Not Answered` is selected, these red requirement alerts do **not** occur.
- Enter data for all fields and assert that the data you have saved is now registered in the database by entering the following command in SQL: `SELECT * FROM instrument_data WHERE ID = <candID>;`
  - use the candID of the participant that you are querying.
- Change some of the data **in a very obvious way** and hit `Save`. Assert that the database reflects these changes 

### View the Instruments

- Create a new participant
  - go to `/new_profile`, enter `Date of Birth`, `Date of Birth Confirm`, `Sex`, `Site`, `Project`.
  - click `Create`. This registers the participant.
- click `Access Profile` and Click `Create Time Point`
- enter `Site`, `Project`, `Cohort`, `Visit Label` and `Language`
- click `Create Time Point`.
- Assert that you see your new time point with `Not Started` in the `Stage` field
- Click the Visit Label you just created of your new participant
- In the side bar, click `Start Visit Stage` and enter `Date of Visit` and `Continue`. Assert that you are taken to a list of instruments assigned to this time point: `/instrument_list`
- Enter sample data, testing each field's type and logic constraints

### Configuration Tests

- [x] Instrument List: Send to DCC
- in /configuration, under `Study`, set `InstrumentResetting` to `Yes` and click `Submit`
- Under `Subtests` in the sidebar, click `Top` and Assert that 'Delete instrument data' button is visible
- Click `Delete instrument data` button and assert that the instrument's data is cleared on every page
- Select a PHP instrument by looking in the /project/instruments folder for any instrument that begins with `NDB_BVL_Instrument`
- enter the `$postMortem` variable as follows, set it to true and save the file

```
 class NDB_BVL_Instrument_medical_history extends NDB_BVL_Instrument
{
    use LegacyInstrumentTrait;
    use \LorisFormDictionaryImpl;

    var $ValidityEnabled  = false;
    var $ValidityRequired = false;
    var $postMortem = true;
    /**
```

- Assert that `Candidate Age at Death (Months)` appears instead of `Candidate Age (Months)`  
- Set it back to 'false' and reload the instrument and assert that `Candidate Age (Months)` appears
- Select a LINST instrument by looking in /project/instruments and selecting a file that ends with .linst
- set`postmortem{@}true` in the instrument's meta file, save, and assert that `Candidate Age at Death (Months)` appears. 
- set it to `false` and assert that `Candidate Age (Months)` appears  
- Look in the (SECTION) of the PHP code of the instrument in question and set the $ValidityEnabled object to `true`

``` 
public $ValidityEnabled = true;
```

Assert that you see validity ticks in the side bar of the instruent, as follows:
- [ ] Valid
- [ ] Questionable
- [ ] Invalid

Now set `$validityEnabled` to `false`, reload the instrument, and assert that these do not appear

### Dashboard tests

Go to the loris instance splash page `loris.ca/`

- Under`My Tasks` click `Incomplete forms`
- Assert that this re-directs to `statistics/statistics_site`
-Assert that the total of Incomplete forms correspond with the correct amount of candidates
- click `Access Profile`, click a `PSCID`, click a `timepoint` and assert that this redirects to 
`/instrument_list/?candID=<xxxx>$sessionID=<yyyy>`which, at the bottom, contains the Behavioural Battery of Instruments

- Test making a new Time Point for a candidate and assign an instrument to the time point.

using `php assign_missing_instruments`???!!!!

- Assert that the Behavioural Data widget should update accordingly.

## View Instrument Data

In your admin account, set your user's permissions to

- [ ] Access Profile: View/Create Candidates and Timepoints - Own Sites
- [x] View Instrument Data

### Data Query Tool Tests

- Now, using that user's account, go into Data Query Tool /dataquery
- in `Available Fields` select `Candidate identifiers` and select the `CandID LORIS Candidate identifier`
- go back to `Available Fields` and select an instrument such as `Aosi` and click `Add all` and, at the bottom right, click `Run Query`
- Assert that Fields and Records (columns and rows) show up for this query (they could contain actual data or `no data`)
- [x] Access Profile: View/Create Candidates and Timepoints - Own Sites

### Instrument Access Tests

- In your admin account, navigate to Access/Candidate/Timepoint/Instrument and copy the part of the url that follows loris.ca
for example `/instruments/mri_parameter_form/?commentID=300001MTL0011241522092423&sessionID=1&candID=300001`

- go to your user's account and paste this in the url after loris.ca
- Assert that you are re-directed to the instrument form
- Assert that you can navigate to different pages of the instrument
- Assert that, in all pages, the form's fields are frozen (greyed-out) thereby disabling data entry.

### Test Configurations

#### Instrument Resetting

#### Post Mortem

#### Verify Validity