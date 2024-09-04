# Conflict Resolver

## Purpose

The conflict resolver is intended to allow the resolution of conflicts
(different data entry for a given field between the "single data
entry" and "double data entry" variations) for instruments which
have double data entry enabled.

## Intended Users

The conflict resolver is usually used by data entry staff to resolve
double data entry conflicts.

Some studies may have protocols which involve supervisors or
committees deciding how to properly resolve conflicts. For example,
studies may adopt different policies regarding the personnel that
should be responsible for conflict resolution (which could be the
same data entry staff that performed the double data entry or a
different data entry staff). Such policies are not enforced by
LORIS.

## Scope

The module only provides data entry conflict resolution and triggers
the recalculation of fields which are dependent on the data that's
been changed (i.e. score fields, age, etc). It does not do the initial
data entry on the instruments themselves, only the resolution.

It is up to any given study's internal policy to determine if
resolution should be done by the same person or a different person
than the person who did the initial data entry. The adopted policy
will not be enforced by LORIS.

## Permissions

Accessing the module requires the `conflict_resolver` permission, as well as either 'Dictionary: Edit Parameter Type Descriptions' or 'Dictionary: Edit Parameter Type Descriptions'.

A user should only see conflicts at the sites at which the user is
a member.

## Configurations

The `DoubleDataEntryInstruments` setting determines whether or not
an instrument gets flagged for conflicts. This is not directly used
by the module, but the base instrument class uses this to determine
whether or not to populate the conflicts table upon data entry
completion.

## Interactions with LORIS

The conflict resolver module determines which fields are in conflict
by looking into the `conflicts_unresolved` table, which instruments
must populate upon the "Data Entry" flag being set to Complete.
This is done by the base `NDB_BVL_Instrument` class and shouldn't
need to be specifically set up for any instrument (other than as
described for the `DoubleDataEntryInstruments` configuration setting
above).

Since the module doesn't know every scoring algorithm for every
instrument, after resolution it loads a copy of the instrument
itself to re-call the instrument's save (and implicitly, `score()`)
function so that all dependent fields are recalculated.

If the `conflicts_unresolved` table somehow becomes out of sync
with the data in LORIS, the `tools/recreate_conflicts.php` script
can be used to re-compare single and double data entry values
and repopulate the `conflicts_unresolved` table.

The conflict resolver implements widgets for the `dashboard` and the
`candidate_profile` dashboard.
