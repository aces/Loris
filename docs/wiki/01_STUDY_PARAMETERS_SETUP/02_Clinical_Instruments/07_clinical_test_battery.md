## The Behavioural Test Battery

Now that instruments for the study have been created and installed (if it is not 
the case, see [Instruments Introduction](01_instrument_intro_prerequisites.md) 
section), the next step towards data entry into LORIS is to configure the test 
battery.

The **Test Battery** is the theoretical set of questionnaires administered to a 
participant at a specific timepoint. The reason we refer to it as "theoretical" 
in this context is because some exceptions occur in a clinical environment and 
LORIS does allow for these exception by offering the option to add instruments 
to the predetermined battery at any timepoint (See FAQ below). The battery assignment 
is dependent on several variables such as age of the candidate, cohort, site 
and project affiliations.

The **Battery Manager** module, found under the *Tools* menu, allows users to 
define, edit and delete clinical battery entries. The help section of the module 
explains what each variable's effect is on the instrument assignment and how it 
interacts with other variables in the same entry.

Once a test battery is defined, it will be cross-matched against each newly 
created timepoint for each participant. When the timepoint's data (age of participant, site, ...) 
matches a specific battery, the predefined set of instruments in the battery 
gets assigned to the participant and the questionnaires are then displayed on 
the timepoint page in the browser.

#### What happens if the battery changes over time?
It is common in a clinical setting for behavioural test batteries to change. In 
LORIS, once a battery is assigned to a participant at a specific timepoint, it 
is dissociated from the "theoretical" battery definition that appears in the battery 
manager. In other words, once a set of questionnaires is linked to a participant 
at a timepoint, it is no longer altered in any way by a change of the test battery.

#### What if we want to retrospectively add new instruments to old timepoints?
Given that this is also a possibility, LORIS offers a tool 
`tools/assign_missing_instruments.php` which can be run by an administrator to 
allow a recomputation of the differences between all existing batteries and all 
theoretical batteries. Upon finding timepoints with missing instruments, this 
tool offers the option to add said instruments to the timepoint. 

For more information about this tool visit [assign\_missing\_instruments.php](../../../../tools/assign_missing_instruments.php)

#### What happens if an additional questionnaire was administered during the visit?
As this use case is also common, LORIS offers a PHP tool which allows for the 
addition of a single instrument to an existing participant's timepoints. The 
`tools/fix_timepoint_date_problems.php` plays many roles amongst which is the 
addition of tests at a timepoint level.

For more information about this tool visit [fix\_timepoint\_date\_problems.php](../../../../tools/fix_timepoint_date_problems.php)

### Summary
When a battery is assigned to candidate at a specific timepoint, the battery 
is linked to the timepoint and is no longer subject to change when the theoretical 
battery is altered from the Battery Manager module. If needed, a change to the 
theoretical battery can be applied to all existing batteries by using the 
`assign_missing_instruments.php` tool. Similarly, if the intent is to add an 
instrument to a single battery without altering the theoretical battery, an 
instrument can be added to the specified timepoint using the `fix_timepoint_date_problems.php`.


