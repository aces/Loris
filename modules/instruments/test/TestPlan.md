# Instrument Test Plan

This test plan verifies that permissions and configurations do what they are supposed to do. The two permissions are called 'Data Entry' and 'View Instrument Data'

Table of Contents

- [Data Entry](#data-entry)
  -  [View the Instruments](#view-the-instruments)
  - [Test Configurations](#test-configurations)
    - [Instrument Resetting](#instrument-resetting)
    - [Post Mortem](#post-mortem)
    - [Verify Validity](#verify-validity)
  - [Dashboard Module tests](#dashboard-module-tests)

- [View Instrument Data](#view-instrument-data)
  - [Test the Data Query Tool](#test-the-data-query-tool)
  - [Share a Link to a Frozen instrument](#share-a-link-to-a-frozen-instrument)
  - [Test Configurations](#test-configurations)

## Data Entry

- [x] Access Profile: View/Create Candidates and Timepoints - Own Sites

- enter `loris.ca/candidate_list` in url
- click on a PSCID, click### Visit the Candidate Dashboard module on a timepoint, click on an instrument
- Assert that link to the instrument is shown, ex:`loris.ca/instruments/mri_parameter_form/?commentID=300166OTT166166241522092433&sessionID=166&candID=300166`
- Enter a date and click 'Save Data'. Assert that `Age Calculation` is correct
- Set Examiner to NULL and assert that `An Examiner is Required` appears.
- If the instrument has multiple pages (on the left sidebar), enter some data, then move from page to page and assert that the
saved data stays the same.
- Change some data, but don't hit save, and change page. Assert that the data that wasn't saved is not still there (ie is not persistent)

### View the Instruments

  1. go to `/new_profile` and enter data, click `Create` and `Access Profile`
  2. click `Create Time Point` and enter data and click `Create Time Point` and click `OK`. Assert that you see your new time point with `Not Started` in the `Stage` field
  3. Click the Visit Label you just created of your new candidate
  4. In the side bar, click `Start Visit Stage` and enter `Date of Visit` and `Continue`. Assert that you are taken to a list of instruments assigned to this time point: `/instrument_list`

  6.Enter sample data, testing each field's type and logic constraints

### Test Configurations

#### Instrument Resetting

- [x] Instrument List: Send to DCC

in /configuration, set `InstrumentResetting`

- in /configuration, set `InstrumentResetting` to `Yes`
- Under `Subtests` in the sidebar, click `Top` and Assert that 'Delete instrument data' button is visible
- Click `Delete instrument data` button and assert that the instrument's data is cleared on every page

#### Post Mortem

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

#### Verify Validity

- Look in the (SECTION) of the PHP code of the instrument in question and set the $ValidityEnabled object to `true`

``` 
public $ValidityEnabled = true;
```

Assert that you see validity ticks in the side bar of the instruent, as follows:

- [ ] Valid
- [ ] Questionable
- [ ] Invalid

Now set `$validityEnabled` to `false`, reload the instrument, and assert that these do not appear

### Dashboard module tests

Go to the loris instance splash page `loris.ca/`

- Under`My Tasks` click `Incomplete forms`
- Assert that this re-directs to `statistics/statistics_site`

-Assert that the total of Incomplete forms correspond with the correct amount of candidates

- click `Access Profile`, click a `PSCID`, click a `timepoint`

Assert that this redirects to 

`/instrument_list/?candID=<xxxx>$sessionID=<yyyy>`

which, at the bottom, contains the Behavioural Battery of Instruments

- Test making a new Time Point for a candidate and assign an instrument to the time point.

using `php assign_missing_instruments`???!!!!

The Behavioural Data widget should update accordingly.

## View Instrument Data

In your admin account, set your user's permissions to

- [ ] Access Profile: View/Create Candidates and Timepoints - Own Sites
- [x] Data Query Tool - View Instrument Data

### Test the Data Query Tool

- Now, using that user's account, go into Data Query Tool /dataquery
- in `Available Fields` select `Candidate identifiers` and select the `CandID LORIS Candidate identifier`
- go back to `Available Fields` and select an instrument such as `Aosi` and click `Add all` and, at the bottom right, click `Run Query`
- Assert that Fields and Records (columns and rows) show up for this query (they could contain actual data or `no data`)
- [x] Access Profile: View/Create Candidates and Timepoints - Own Sites

### Share a Link to a Frozen Instrument

- In your admin account, navigate to Access/Candidate/Timepoint/Instrument and copy the part of the url that follows loris.ca
for example `/instruments/mri_parameter_form/?commentID=300001MTL0011241522092423&sessionID=1&candID=300001`

- go to your user's account and paste this in the url after loris.ca and assert that you can view the instrument but not edit it or enter data.

### Test Configurations

#### Instrument Resetting

#### Post Mortem

#### Verify Validity