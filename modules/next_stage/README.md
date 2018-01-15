# Next Stage

## Purpose

The `next_stage` module provides a method of start the "next stage"
of a candidate session. The "Stage" of an session goes from Screening
to Visit to Approval, and the Screening and Visit stages may have
different instruments administered. The `next_stage` module prompts
for the date of the visit and uses the data it gathers to populate
the test battery for the Visit stage.

However, note that the Screening stage is mostly historic and poorly
tested.  Most LORIS studies prefer to have a separate "Screening"
visit, rather than a screening stage for each visit. The result is
that the `next_stage` module is mostly used simply to populate the
test battery for a session.

## Intended Users

The `next_stage` module is used by data entry staff in order to
start the Visit stage of an instrument.

## Scope

The `next_stage` module only moves from the Screening to Visit stage
for a session. The final Approval or Recycling Bin stage is reached
by sending to DCC (or Recycling Bin) on the `instrument_list` page.

## Permissions

Both the `data_entry` permission is required, and the user must be
at the same CenterID as the timepoint in order to access the module.

Access is also denied if the timepoint isn't startable (ie. if it's
already been started.)

## Configurations

The `test_battery` table must be set up with instruments to be added
to the `Visit` stage which meets the criteria of the timepoint (ie
age range, visit, center..) or no tests will be added. This must
be done before the stage is started.

## Interactions with LORIS

The `next_stage` module links back to the `instrument_list` page
after a stage is started.

The `next_stage` module inserts the on-site test battery into the
flag table. It does NOT insert survey instruments, which are inserted
by the `survey_accounts` module.
