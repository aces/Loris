# Behavioural Feedback


## Purpose

The Feedback module allows users to flag and comment on  behavioural database fields.

## Permissions

The `bvl_feedback` permission is required to access the behavioural feedback module.

## Configurations

Two default feedback types exist: input and scoring errors. Additional feedback types can be added to feedback_bvl_type table.

## Interactions with LORIS

Note that Feedback is also displayed in the Behavioural QC module. 

Behavioural feedback is accessed via a pencil icon in the top menu bar which is visible only when in certain behavioural/clinical modules.
Behavioural Feedback status data is also accessible and the module is linked in many places in LORIS at 3 levels : Candidate, Timepoint, and Instrument.  
Links appear in the respective modules : candidate profile and candidate dashboard, timepoint list, and instrument, as well as from the sidebar in each instrument form. 

### Dashboard Widget

The Dashboard Widget `Behavioural Feedback Notifications` displays feedback outstanding on behavioural/clinical data
