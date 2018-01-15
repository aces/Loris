# Instrument List

## Purpose

The instrument list module shows an overview of all instruments
which are part of a given session for a candidate. It provides a
mechanism for setting session level behavioural QC flags and the
ability to send a visit to DCC once the instruments are all complete.

## Intended Users

The page is intended to be used by data entry staff to access
instruments for data entry. It is the primary entry point into a
visit.

## Scope

The instrument list module provides a path to access the instruments,
and a control panel which allows session level metadata to be
entered.

## Permissions

One of three conditions must be met to have access to the module:

1. The user has the permission `access_all_profiles`
2. The user is at the same site as the visit.
3. The user is at the same site as one of the candidate's other visits.

The `send_to_dcc` permission is required in order to send the
timepoint to DCC (finalize the visit).

The separate (and usually more restricted) `unsend_to_dcc` permission
is required to reverse the `send_to_dcc` in case it was sent in error
(but should rarely be necessary, as 'Sent to DCC' implies that the data
is complete and ready to be used for publication, after which it should
be immutable.)

## Configurations

The instrument list module gets the list of instruments from the
`flag` table. The test battery must separately be set up (and the
stage started) in order for any instruments to appear.

The `test_subgroups` SQL table provides a mechanism for grouping
the instruments on the page into separate sections of the table.

The `test_names` SQL table provides a mapping of short `test_name`
to a friendly human readable display format which is shown in the
list.

## Interactions with LORIS

The module primarily links to instruments, which are coded separately.
It also includes a link to the `next_stage` module in the control
panel, in order to allow data entry staff to start a visit.

Survey module instruments are inserted into the `flag` table and thus
show up in the `instrument_list` module, but this is not the case until
after the survey has been sent.

The `bvl_feedback` thread status for instruments are displayed in
the list of instruments.
