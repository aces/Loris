# Testing Troubleshooting

## Testing

LORIS instruments can be tested by assigning them to a test battery (See next 
section for more details about [Test Batteries]([Test Battery](./07_clinical_test_battery.md))) 
and creating a new timepoint for an existing candidate (See [Creating a Candidate](TODO) 
documentation in the Getting Started section for more details) for which this 
battery is assigned. During major instrument development sprints it is common to 
create mock candidates and mock timepoints simply for the testing of newly created 
instruments.

In order to make sure everything is functional, make sure the following items all
check-out:

 - Instrument **loads** properly on the web browser.
 - If instrument permissions are used, make sure only users with the permission 
 have access to the instrument
 - Instrument **pages load** properly in the control panel on the left and are 
 all accessible.
 - Instrument **saves** after data is entered.
 - If **validation** rules are used (XIN or otherwise), validation runs and gives 
 an error when incorrect data is entered
 - If **scoring** is used, scores are computed on save following the algorithm 
 defined in the scoring function.

## Troubleshooting

### What happens if the scoring algorithm changes?
In case the scoring logic is amended during the study's data collection phase, 
LORIS offers a PHP tool to retrospectively fix existing scores. The 
`tools/data_integrity/score_instrument.php` tool re-scores any instrument with a working `score()` function 
(PHP instruments) or a scoring file (PHP and LINST instruments). 

Make sure to read the [tool's documentation](../../../../tools/data_integrity/score_instrument.php) before using it.

### What happens if the candidate's date of birth is amended mid-study?
Given that most instruments calculate the age of the candidate automatically 
on data-entry, a change of the date of birth, or date of death, must be 
complemented with the use of the `tools/data_integrity/fix_candidate_age.php` 
tool. This tool fixes the age calculated for each instrument where 
the date of birth (or date of death) of a candidate might have been altered. 

Make sure to read the [tool's documentation](../../../../tools/data_integrity/fix_candidate_age.php) before using it.
