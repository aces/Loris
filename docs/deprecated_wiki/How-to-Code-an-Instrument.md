**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[DEVELOPER'S INSTRUMENT GUIDE|Developer's Instrument Guide]]** > **[[HOW TO CODE AN INSTRUMENT|How to Code an Instrument]]**

> As an example: follow along with [`NDB_BVL_Instrument_TEMPLATE.class.inc`](https://github.com/aces/Loris/blob/master/docs/instruments/NDB_BVL_Instrument_TEMPLATE.class.inc) or [`NDB_BVL_Instrument_mri_parameter_form.class.inc`](https://github.com/aces/Loris/blob/master/docs/instruments/NDB_BVL_Instrument_mri_parameter_form.class.inc) from [docs/instruments/](https://github.com/aces/Loris/tree/master/docs/instruments) directory. 

# Code an Instrument in PHP
1. Make a copy of the template instrument (from docs/instruments/ directory) in your project/instruments/ directory, and ensure it is apache-readable.  
1. Rename it to  “NDB_BVL_$TEST_NAME$.class.inc”
1. Edit the contents of the file to replace all template placeholders such `TEST_NAME`, `<TEST_NAME>`, `<INSTRUMENT TITLE>` and `<FIRST QUESTION OF EACH PAGE>`.  Note that `TEST_NAME` within the file must match the `TEST_NAME` in the file name; this will also be the name of the MySQL table for this instrument. 
1. Add pages (if necessary). For a single-page instrument, include all questions in main() and delete functions _page[1-9]{}. If the instrument has multiple pages, add QuickForm elements inside functions _page[1-9].
1. Add questions to each page using `$this->addType()` wrappers or use `$this->createType()` wrappers (in case of table/groups).  Wrappers are included in NDB_BVL_Instrument.class.inc e.g. `addTextElement()`, `addYesNoElement()`, `addTextAreaElement()`. See <http://pear.php.net/> for Quickform documentation. Many wrappers also use [XinRegisterRule](https://github.com/aces/Loris/wiki/XIN-Rules).
  * Element names must be lowercase and fewer than 64 characters (e.g. `q07_mother_maiden_name`). Never use hyphens, as it is confused with the MySQL minus sign. Element names `*_status` are reserved for select boxes accompanying text fields.
  * Use `addDateElement` wrapper for dates. Modify `dateTimeFields` array to include all date elements for proper conversion to database date/timestamp format.
  * Any date elements used should be added to the `dateTimeFields` array (so that they will be converted between HTML_Quickform and MySQL formats automagically).
  * Any multiple select elements should be added to the `_selectMultipleElements` array.  This way they will be transferred between the database and the QuickForm smoothly.
  * For question **dependencies**, use [XIN Rules](https://github.com/aces/Loris/wiki/XIN-Rules).
  * For formatting questions into tables, see [[Instrument Groups]].
6. To ensure instrument completeness for all pages, modify `_requiredElements()` array to include 'Examiner' field and first question of each page, e.g. `$this->_requiredElements=array('Examiner', 'q1', 'q19', 'q37', 'q55'));` These array items must be entered to mark instrument as 'Complete'
  * To ensure completion of multi-select elements, see [Validating Multi-Selects](https://github.com/aces/Loris/wiki/XIN-Rules#validating-multi-selects)
7. It may be desirable to exclude certain instrument columns from the Conflict Resolver module, such as Comment fields. These fields should be added to the instrument class array `_doubleDataEntryDiffIgnoreColumns` within the instrument php file.  By default, the base class already excludes the following fields: `CommentID`, `UserID`, `Testdate`, `Window_Difference`, `Candidate_Age`, `Data_entry_completion_status`
8. For scoring functionality, [implement scoring](https://github.com/aces/Loris/wiki/Instrument-Scoring) through a separate script or a function within the instrument class.

```php
<?php
// Basic Instrument structure
class NDB_BVL_Instrument_$TABLE_NAME$ extends NDB_BVL_Instrument
{

    function setup($commentID, $page)
    {
        // Update the testName and tableName
        // Update dateTimeFields, _selectMultipleElements, _requiredElements,
        // _doubleDataEntryDiffIgnoreColumns arrays
    }	

    function _setupForm()
    {
        // Update preg_match function for multi-paged instruments
    }

    function _main()
    {
        // First page of instrument
    }

    function _page1()
    {
        // Another page
    }

    function _page2()
    {
        // Another page
    }
	
} 
```


**[[NEXT: (3) Instrument Insertion|Instrument-Insertion]]**

----
See also:
* [[XIN Rules]]
* [[Instrument Groups]]
* [[Instrument Scoring]]
* [[Loris Dictionary]]