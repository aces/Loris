# Instrument Test Plan

This test plan verifies that permissions and configurations do what they are supposed to do.
The permissions are:

1. `data_entry` permission, which allows users to enter information into instruments
2. `view_instrument_data`, which only allows users to view the instrument data only

## with `data_entry` permission

- [x] Access Profile: View/Create Candidates and Timepoints - Own Sites
- enter `loris.ca/candidate_list` in url
- click on a PSCID, click on a timepoint, click on an instrument
- Assert that link to the instrument is shown, ex:`loris.ca/instruments/mri_parameter_form/?commentID=300166OTT166166241522092433&sessionID=166&candID=300166`
- Enter a date and click 'Save Data'. Assert that `Age Calculation` is correct
- Set Examiner to NULL and assert that `An Examiner is Required` appears.
- If the instrument has multiple pages (on the left sidebar), enter some data, then move from page to page and assert that the
saved data stays the same.
- Change some data, but don't hit save, and change page. Assert that the data that wasn't saved is not still there (ie is not persistent)

## View the instruments

  1. go to `/new_profile` and enter data, click `Create` and `Access Profile`
  2. click `Create Time Point` and enter data and click `Create Time Point` and click `OK`. Assert that you see your new time point with `Not Started` in the `Stage` field
  3. Click the Visit Label you just created of your new candidate
  4. In the side bar, click `Start Visit Stage` and enter `Date of Visit` and `Continue`. Assert that you are taken to a list of instruments assigned to this time point: `/instrument_list`

  6.Enter sample data, testing each field's type and logic constraints

## Test the Configurations

### `instrumentResetting`

- [x] Instrument List: Send to DCC

in /configuration, set `InstrumentResetting`

- in /configuration, set `InstrumentResetting` to `Yes`
- Under `Subtests` in the sidebar, click `Top` and Assert that 'Delete instrument data' button is visible 
- Click `Delete instrument data` button and assert that the instrument's data is cleared on every page

### `postMortem`

- Select a PHP instrument by looking in the /project/instruments folder for any instrument that begins with `NDB_BVL_Instrument`
- Set the `$postMortem` object in the PHP programme to `true` and save the file. remember that in PHP a boolean value must be lower case ie `true` not `True`

```    /**
     * True if the instrument is administered after the candidate's death.
     * This is used to determine which candidate age should be displayed as
     * part of metadata fields. (Either Candidate Age or Candidate Age at Death).
     * To be called from within individual instrument forms.
     *
     * @var    bool
     * @access protected
     */
    
    protected $postMortem = false; 
```

- Assert that `Candidate Age at Death (Months)` appears instead of `Candidate Age (Months)`  
- Set it back to 'false' and reload the instrument and assert that `Candidate Age (Months)` appears
- Select a LINST instrument by looking in /project/instruments and selecting a file that ends with .linst
- set`postmortem{@}true` in the instrument's meta file, save, and assert that `Candidate Age at Death (Months)` appears. 
- set it to `false` and assert that `Candidate Age (Months)` appears  

### Verify Validity

- Look in the (SECTION) of the PHP code of the instrument in question and set the $ValidityEnabled object to `true`

```    /**
     * Whether the "Validity" field is shown as a flag for an instrument
     * or not.
     *
     * @access public
     */
    public $ValidityEnabled = true;
```

Assert that you see validity ticks in the side bar of the instruent, as follows:

- [ ] Valid
- [ ] Questionable
- [ ] Invalid

Now set `$validityEnabled` to `false`, reload the instrument, and assert that these do not appear

### Dashboard module tests

Go to the loris splash page `loris.ca/`

- Under`My Tasks` click `Incomplete forms`
- Assert that this re-directs to `statistics/statistics_site`

-Assert that the total of Incomplete forms correspond with the correct number of candidates inside the

### Visit the Candidate Dashboard module

- click `Access Profile`, click a `PSCID`, click a `timepoint`

Assert that this redirects to 

`/instrument_list/?candID=<xxxx>$sessionID=<yyyy>`

which, at the bottom, contains the Behavioural Battery of Instruments

- Test making a new Time Point for a candidate and assign an instrument to the time point.

using `php assign_missing_instruments`???!!!!

The Behavioural Data widget should update accordingly.
