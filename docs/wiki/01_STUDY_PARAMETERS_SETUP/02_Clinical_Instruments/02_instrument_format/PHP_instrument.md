## Creating a PHP Instrument

**PHP** instruments are manually coded, generally by a developer, to allow for 
additional flexibility or complexity in an instrument. All LORIS instruments must 
extend the `php/libraries/NDB_BVL_Instrument.class.inc` and thus have access to a 
set of predefined functions allowing for the creation and addition of form elements 
to the instrument. 

>_**Note:** Although PHP allows for functions to be overridden in the instrument 
>class for customizations specific to the study, it is not recommended to do so 
>extensively. Keeping overrides and custom code to a minimum can greatly reduce 
>the maintenance time required and simplify the upgrade process when new LORIS 
>releases come out._

### Getting started

It is recommended to use one of our LORIS instrument templates to begin the 
process. Templates can be found under the `docs/instruments/` directory. Other 
examples of instruments can be found under the `raisinbread/instruments/` 
directory, the raisinbread codebase examples are the instruments used for the 
LORIS demonstration website [demo.loris.ca](https://demo.loris.ca/).

#### Setup

Setting up your instrument is critical for the proper installation and functioning 
of it. PHP instruments are required to have a `TEST_NAME`, this value should be 
alphanumeric and only use underscores(`_`) as delimiters, other special characters 
are not supported. Examples of test names can be found in the `raisinbread/instruments/` directory.

The following configurations should be modified for all instruments.

- In the instrument file name, the keyword `TEMPLATE` should be replaced with the 
`TEST_NAME` value you chose above.
- In the instrument class name, the keyword `TEST_NAME` should be replaced with 
the `TEST_NAME` value.
- In the `setup()` function, the variable `$this->testName` should be set to the 
`TEST_NAME` value.
- In the `setup()` function, the variable `$this->table` should be set to desired 
name of the SQL table in the database. The table name does not have to be the 
same as `TEST_NAME` but having be the exact same string is an option and is commonly done.
- In the `_setupForm()` function the keyword `<TEST_NAME>` in the `preg_match()` 
function should be replaced by the `TEST_NAME` value.
- Many other Configuration can alter the behaviour of the instrument and automated 
quality assurance that is undergoes. Refer to the [Additional Configurations](# Additional Configurations) 
section below for more information.

The `getDataDictionary()` function must be defined and return an iterable list 
of dictionary items for each of the instrument fields. Alternatively, the instrument 
can use the `LorisFormDictionaryImpl` trait to auto-generate the data dictionary for the 
instrument. (see Template instrument or raisinbread instruments for proper usage 
of the trait)

Finally, the `getFullName()` function must be changed to reflect the correct 
full name of the instrument.


#### Pages

Instrument can be broken down into pages. An instrument has a minimum of one page 
and no maximum number of pages. Pages can have customized names and are configured 
in the instrument's `getSubtestList()` function. 

The instrument class' `_main()` function represents the first page, also referred 
to as the "Top" page. All subsequent pages are commonly implemented as `_page1()`, 
`_page2()`, ... Although this is the most common use case, it is possible to name 
the functions differently as long as all other configurations are modified accordingly.

In the `getSubtestList()`, make sure to properly refactor the `Name` key of each 
element in the array to match the following convention `<TEST_NAME><PAGE_FUNCTION_NAME>` 
where `<Test_NAME>` is replaced by the `TEST_NAME` value you have chosen and 
`<PAGE_FUNCTION_NAME>` is replaced by `_page1`, `_page2` or the appropriate value 
if you elected to rename the page functions.

If you chose to rename the page functions (differently than sequential `_pageX`) 
you must modify the `_setupForm()` function to make sure the `preg_match()` call 
is properly configured to match all your different pages. This `preg_match()` 
allows for proper routing to the pages of the instrument.

#### Form Elements

As mentioned above, inheritance from the `NDB_BVL_Instrument.class.inc` enables 
the instrument under development to use several pre-implemented form wrappers to 
generate all sorts of fields. The full list of usable wrappers spans across the 
classes `php/libraries/NDB_BVL_Instrument.class.inc` and `php/libraries/NDB_Page.class.inc`. 

As a general rule, functions starting with `add...()` create and append the 
element to the form directly; functions starting with `create...()` only create 
the form element. The latter use case is necessary for grouping. Groups are 
either a multi-element line in the instrument or tables where each row of the 
table is a group. Examples of groups, tables and singular form elements can be 
found in the `raisinbread/instruments/` directory.

Below are a few best practices for cleaner functional forms:

- Element names must be lowercase and fewer than 64 characters (e.g. 
`q07_mother_maiden_name`). Avoid using special characters other than underscores(`_`).
- Element names `*_status` are reserved for select boxes accompanying fields accepting status such as `Not Answered`, 
`Don't Know`,... It's worth noting that when a `_status` field is filled in by 
the user, the main field that the status applies to is stripped of its value on 
save, so only the field OR it's status can contain a value.
- Any multiple select elements should be added to the `selectMultipleElements` 
array (if such array ).  
- For question **inter-dependencies**, use [XIN Rules](../Annexe_A_XIN-Rules.md).


## Validation in PHP
Validation in PHP can leverage two different systems. The first system is 
**XIN rules**, XIN rules allow for fields to be made mandatory or not based on 
a specific conditions (see [XIN rules documentation](../Annexe_A_XIN-Rules.md) 
for more details). XIN rules in PHP instruments are written in line with the 
field definitions (see example below). The second system is **custom validation 
functions** where a PHP function can be written and referenced to from any of 
the instrument's pages, this function would then be run and return a set of errors 
to be displayed to the user doing the form data entry.

- **System 1 - XIN rules:** Here is an example of XIN rules drawn from the 
raisinbread demonstration codebase. In the code below, a field named 
`hypertension_while_pregnant` is made to be required only if the answer to the 
previous question by the name `hypertension` was answered by `yes`.

    ```php
    $this->addSelect(
        "hypertension",
        "7. Do you have hypertension?",
        $yesNoOptions
    );

    $this->addSelect(
        "hypertension_while_pregnant",
        "$this->indent $this->indent" .
        "If YES + FEMALE, were you pregnant " .
        "when you were diagnosed with hypertension?",
        $yesNoOptions
    );

    $this->XINRegisterRule(
        "hypertension_while_pregnant",
        array("hypertension{@}=={@}yes"),
        "Required."
    );
    ```
   
- **System 2 - Custom Validation Function:** Here is an example of a custom 
validation drawn from the raisinbread demonstration codebase. Note that the 
function can have any desired name as long as it is referenced to properly from 
the page calling it. In this example a function named `areFemaleQuestionsRequired()` 
is called from the second page of the instrument.
   
    ```php
    function _page2()
    {
    	...
    	
    	$this->form->addFormRule(array(&$this, 'areFemaleQuestionsRequired'));
    	
    	...
    }
    
    ...
    
    /**
     * Determines whether the question specific to female participants are required.
     *
     * @param array $values Array containing all the form values
     *
     * @return array
    */
    function areFemaleQuestionsRequired($values)
    {
        $errors = array();
        $candID = isset($_REQUEST['candID']) ? $_REQUEST['candID'] : '';
        if ($values['hypertension'] == 'yes' && $this->isCandidateFemale($candID)) {
            $errors['hypertension_while_pregnant'] = 'Required';
        }
        return $errors;
    }
    ```

## Scoring in PHP
Scoring in a PHP file is done within the same PHP class through a dedicated 
function named `score()`. This function runs on form submission after the 
validation is run and the fields submitted are saved in the database. It is common 
to see a check at the beginning of the `score()` function to ensure it is only 
computing scores when all fields are completed. It is also necessary to nullify 
the existing scores before re-scoring based on the latest data. Here is an 
example of a score function (other examples can be found in the raisinbread 
demonstration codebase).

```php
/**
* Example scoring function
*
* @return void
*/
function score() {
    if ($this->_determineDataEntryCompletionStatus() == "Incomplete") {
        return;
    }
    $this->_nullScores(['score_1','score_2','score_3']);
    
    // Get latest values for the instrument data
    $record = $this->getInstanceData();
    
    $score = array(
        'score_1' => null,
    );
    
    // Scoring logic
    $score['score_1'] = 'true';
    $score['score_2'] = 0;
    $score['score_3'] = true;
    if ($record['abc_1'] <> 'yes') {
        $score['score_1'] = 'false';
        $score['score_2'] = 5;
        $score['score_3'] = false;
        
    } 

    // save the scores
    $this->_save($score);
}

```

## Additional Configurations


#### JSON Data Storage

As mentioned in the introduction, data storage can be either in a dedicated 
MySQL table or in a JSON string format. By default, MySQL mode is enabled; if 
you wish to change is to JSON data storage simply change the `jsonData` variable 
value to `true` in the setup function.

```php
function setup() {
    ...
    $this->jsonData = true;
    ...
}
```
#### Required Elements

The `_requiredElements` array enumerates fields from the instruments which are 
considered necessary for the completion of an instrument. The term "completion" 
refers to the functionality by which an instrument if flagged as finalized and 
ready for review. The `_requiredElements` array should be populated with the 
element name used in the form element definition.

```php
function setup() {
    ...
    $this->_requiredElements = array(
               'Examiner',
               'examiner_location',
               'q1_visual_tracking_press_1',
               'q7_social_babbling',
    );
    ...
}
```
#### Double Data Entry Diff Ignore Columns
The `_doubleDataEntryDiffIgnoreColumns` affects the Double Data Entry process 
only (if your study does not use Double Data Entry you are not affected by this 
configuration, see [Double Data Entry section](../05_instrument_quality_assurance.md#Double-Data-Entry) 
for more details). This array lists all fields from the instrument form which 
should be ignored when comparing the first and second data entry attempt. These 
fields will not show up as conflicts in the conflict resolver even if they 
contain different values.

>_**Note:** We use array_merge() here to make sure the array contains the default 
>LORIS ignored fields defined in the NDB_BVL_Instrument.class.inc_

```php
function setup() {
    ...
    $this->_doubleDataEntryDiffIgnoreColumns = array_merge(
              $this->_doubleDataEntryDiffIgnoreColumns,
              array(
                    'free_play_period_1_notes_status',
                    'free_play_period_1_notes',
                    'free_play_period_2_notes_status',
              )
    );
    ...
}
```

#### Post Mortem Administration
The `postMortem` variable should be set to `true` when the instrument being 
developed is intended to be administered after the death of a patient. Setting this
flag to `true` impacts the age calculation. In post Mortem instruments, the "age" 
should be the difference between the date of birth and the date of death of the patient, 
instead of the difference between date of birth and date of administration of the instrument.

```php
function setup() {
    ...
    $this-> postMortem = true;
    ...
}
```

#### Validity
The `ValidityEnabled` and `ValidityRequired` parameters determine if the 
validity flags are displayed in the sidebar for a specific instrument and if 
they are necessary for the "completion" of the instrument respectively. Both of 
these are set to `true` by default but could be set to false if needed.

```php
function setup() {
    ...
    $this-> ValidityEnabled = false;
    $this-> ValidityRequired = false;
    ...
}
```


