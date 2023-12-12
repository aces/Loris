## Creating a LINST Instrument

**LINST** instruments are created using the LORIS Instrument Builder module. This 
module, accessible from the top menu under the Tools tab, allows users with the 
appropriate permissions to create simple instrument forms through the LORIS front-end. 

To ***start a new form***, navigate to the Instrument Builder module and click the 
Build tab. 

To ***load an existing form*** for editing, click the Load tab and select a `*.linst` 
file on your computer. 

> _**Note:** Editing an instrument may require to re-install it, see the 
> [instrument install section](../03_instrument_install.md) for more details_

To begin creating/editing your instrument, select a *Question Type* in the 
*Add Question* section, fill the necessary information and submit it by clicking the 
*Add Row* button. Each question requires the following fields:

- The **Question Name** serves as the database field name (e.g. `handedness_q01_writing`).
*Please refer to notes below for naming.*
- The **Question Text** serves as the front end label displayed in the browser (e.g 
"Which hand is used for writing?") 
- Depending on the **Question Type** chosen, other elements may be required to submit 
the form item. 

#### Notes for using the Instrument Builder
- **Question Name** must be unique within the instrument, brief (shorter than 64 
characters) and lowercase alphanumeric.
    - No spaces or special characters should be used (hyphen, period, apostrophe, 
      quote, etc) in any fieldname. Fieldnames cannot be numbers, but can be text 
      containing numbers. Lowercase alphanumeric and underscores are best (e.g. `q01_primary_language`)   
    - Should not end in `_status` or `_date`, these are reserved by select boxes and 
      date fields, respectively.
- **Question Text** describes the item for data entry purposes, and often reflects 
the source questionnaire directly (e.g. "What is the child’s primary language?")
- **Instrument Name**, **Date of Administration**, and **Age at administration** will
be added automatically at the top of each instrument form.

#### Data types in the Instrument Builder

| Data Type | Description |
| --- | --- |
| **Header** | Specifies page title or section header. Text appears boldface at page centre. _**Note:** Instrument Name automatically becomes the header at the top of form._ |
| **Label** | A formatting option to introduce a subset of questions. Labels appear as regular text in their own paragraphs.|
| **Score Field** | Score fields are place holders for automated scoring values calculated by the scoring logic in the `.score` file. |
| **Textbox** | Used for shorter miscellaneous text answers not covered by other options. |
| **Textarea** | Used for longer inputs such as general comments, etc. |
| **Dropdown** | Single select field where the list displayed is defined in the `Dropdown Options` section. _**Note:** A `not_answered` option is added automatically to all dropdowns._ |
| **Multiselect** | A select box allowing multiple options to be chosen. |
| **Date** | Used for creating a date field such as Date of Birth. _**Note:** Date of Administration is automatically added for each form, see notes above._ |
| **Numeric** | Used for creating a numeric value field. |
| **Blank Line** | Add a blank line separator to the page. |
| **Page Break** | Used to start a new page in the instrument. |

Click the *Add Row* button once all field information has been completed to submit the field to your instrument. A preview for every submitted field is displayed at the top and gets updated with every new addition. you can *Edit* or *Delete* fields from the preview panel if needed.

#### Name and Download the instrument

When you are ready to finalize your instrument or want to take a break from building, 
make sure to **save** your progress by clicking on the Save tab, provide a short name 
(Filename) for your instrument, and the full title of the instrument (Instrument Name).
  
> _**Note:** The Filename (aka `$TESTNAME`) should not contain hyphens, apostrophes, 
> spaces, accents or special characters._

Finally, click the `Save` button to download the `$TESTNAME.linst` file to your computer.

## Validation in LINST

Validation rules in the LINST format are implemented in a separate file from the 
instrument itself. The file containing the rules must be named exactly the same as 
the instrument however should have an `.rules` as opposed to the `.linst` extension. 
At the moment, there is no LORIS user interface available for the creation and editing 
of rule files, these must be created manually. A `rules` file uses the XIN formatting 
to parse and enforce the coded rules. Here is an example of the `bmi.rules` file drawn 
from the raisinbread demonstration codebase. 

```
height_feet{-}Required{-}unit_classification{@}=={@}imperial
height_inches{-}Required{-}unit_classification{@}=={@}imperial
weight_lbs{-}Required{-}unit_classification{@}=={@}imperial
height_cms{-}Required{-}unit_classification{@}=={@}metric
weight_kgs{-}Required{-}unit_classification{@}=={@}metric
```

Each line in the file represents a rule. The rules in this file enforce which fields 
are required and which are optional. Each rule above has 3 sections delimited by a `{-}`:

  1. The field name (i.e. `height_feet`): This value refers to the field you wish to 
     make required or not required based on a condition to be determined later.
  2. The message (i.e. `Required`): This is the message displayed on the user's 
     browser when the rule is broken. In this case the field will be highlighted in 
     red and a `Required` message will be displayed below.
  3. The condition (i.e. `unit_classification{@}=={@}imperial`): This value represents 
     the condition to evaluate in order to determine if the field of interest will be 
     required or not. In this scenario, the `height_feet` field will be required if 
     and only if the `unit_classification` field is equal `==` to the string `imperial`.
     (refer to the BMI instrument for more context)

For more details on XIN rules, refer to the [XIN rules documentation](../Annexe_A_XIN-Rules.md) 

  
## Scoring in LINST

Scoring a LINST instrument requires the implementation of a score file. The score file, 
like the rules file, must be coded manually. Score files are required to have the exact 
name as the LINST file and rules file but with a `.score` extension. Score files are 
coded in PHP and should have a similar format to the following scoring file drawn from 
the raisinbread demonstration codebase `bmi.score`.

```php
#!/usr/bin/php
<?php
/**
 * BMI Scoring
 *
 * PHP version 5
 *
 * @category Main
 * @package  BMI_Instrument
 * @author   Rathi Gnanasekaran <sekaranrathi@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__."/../../tools/generic_includes.php";
$CommentID     = $argv[1];
$testname      = 'bmi';
$instrumentObj = \NDB_BVL_Instrument::factory(
    $lorisInstance,
    $testname,
    $CommentID,
);
$record        = $instrumentObj->getInstanceData();
$scores        = array();
$bmi           = '';

if($record['unit_classification'] == 'metric') {
    if(is_numeric($record['height_cms']) && is_numeric($record['weight_kgs'])) {
        $height_mts = $record['height_cms']/100;
        $bmi        = $record['weight_kgs']/ ($height_mts*$height_mts);
    }

} else if($record['unit_classification'] == 'imperial') {
    $ht_inches =0;
    if(is_numeric($record['height_feet'])) {
        $ht_inches = $record['height_feet']*12;
    }
    if(is_numeric($record['height_inches'])) {
        $ht_inches += $record['height_inches'];
    }
    if(is_numeric($record['weight_lbs']) && $ht_inches !=0 ) {
        $bmi       = ($record['weight_lbs']*703)/ ($ht_inches*$ht_inches);
    }
}
if(empty($bmi)) {
    $scores['bmi']          = 'Unable to calculate';
    $scores['bmi_category'] = 'Unable to calculate';

} else {
    if($bmi < 18.5) {
        $bmi_category = 'Underweight';
    } else if($bmi >=18.5 && $bmi <= 22.9) {
        $bmi_category = 'Normal Range';
    } else if($bmi >=23.0 && $bmi <=24.9) {
        $bmi_category = 'Overweight - At Risk';
    } else if($bmi >=25.0 && $bmi <= 29.9) {
        $bmi_category = 'Overweight - Moderately Obese';
    } else if($bmi >=30.0) {
        $bmi_category = 'Overweight - Severely Obese';
    }
    $scores['bmi']          = round($bmi, 2);
    $scores['bmi_category'] = $bmi_category;

}
//save scores
$instrumentObj->_saveValues($scores);
exit(0);
```

This scoring logic in this file refers to fields from the `.linst` instrument file by name in order to compute values which, in turn, it stores in the scoring fields of the instrument.

## Additional Configurations

The LINST format also accepts an optional file with the same file name but an extension `.meta`. The meta file allows for some additional configurations which can not be modified from the instrument builder. Here is an example of the `bmi.meta` file drawn from the raisinbread demonstration codebase. 

```
testname{@}bmi
table{@}bmi
jsondata{@}false
```

The meta file currently allows for an instrument to:

  1. Use a table in the database with a different name than the default `testname` table name by setting a `table` variable with a different value.
  2. Store the data in JSON format as mentioned in the introduction section by changing the value of the `jsondata` parameter.
