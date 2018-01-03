# Conflict Resolver

## Purpose

The conflict resolver is intended to allow the resolution of conflicts
(different data entry for a given field between the "single data
entry" and "double data entry" variations) for instruments which
have double data entry enabled.

## Intended Users

The conflict resolver is used by data entry staff.

## Scope

The module only provides data entry conflict resolution and triggers
the recalculation of fields which are dependent on the data that's
been changed (ie. score fields, age, etc). It does not do the initial
data entry on the instruments themselves, only the resolution.

It is up to any given study's internal policy to determine if
resolution should be done by the same person or a different person
than the person who did the initial data entry and not enforced by
LORIS.

## Permissions

Accessing the module requires the `conflict_resolver` permission.

A user should only see conflicts at the sites at which the user is
a member.

## Configurations

The `DoubleDataEntryInstruments` setting determines whether or not
a instrument gets flagged for conflicts. This is not directly used
by the module, but the base instrument class uses this to determine
whether or not to populate the conflicts table upon data entry
completion.

## Interactions with LORIS

The conflict resolver module determines which fields are in conflict
by looking into the `conflicts_unresolved` table, which instruments
must populate upon the "Data Entry" flag being set to Complete.
This is done by the base `NDB_BVL_Instrument` class and shouldn't
need to be specifically set up for any instrument (other than as
mentioned in the configurations setting.)

Since the module doesn't know every scoring algorithm for every
instrument, after resolution it loads a copy of the instrument
itself to re-call the instrument's save (and implicitly, `score()`)
function so that all dependent fields are recalculated.
