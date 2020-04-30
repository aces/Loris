# Statistics

## Purpose

The statistics module provides a mechanism to provide summary
descriptive statistics to users of a LORIS instance.

## Intended Users

The module is intended to be used by researchers or PIs looking for
at-a-glance statistics about the state of their research project.

## Scope

The statistics module only provides descriptive statistics. Scientific
analysis should be done outside of LORIS on data extracted from the
`data_query` module using standard scientific tools.

## Permissions

The `data_entry` permission is required in order to access the
statistics module.

## Configurations

The Statistics module includes a number of tabs for different types
of statistics. These can be customized by populating the `StatisticsTabs`
SQL table. Projects intending to customize the module should do so
by creating a new project/modules module (ie `statistics_projectname`)
which contain subpages for the tabs they'd like to use and populating
the `StatisticsTabs` table, rather than modifying the module itself
(this will make upgrading of LORIS easier).

## Interactions with LORIS

The default tabs provide summary of data from a variety of different
LORIS modules. In particular, the data entry statistics gather data
from instruments, and the imaging statistics use data from both the
files and tarchive tables. The default tabs are described in further
detail below.

The Statistics registers widgets in the `dashboard` module.

### Demographic Statistics

This tab provides general statistics relating to the number of candidates
registered in each cohort as well as customizable categories displaying
statistics relating to candidate demographics. Statistics can be broken
down by instrument by selecting an instrument from the dropdown menu.

### Behavioural Statistics

This tab provides data entry statistics relating to the number of
candidates who have completed each instrument per site and timepoint.
Statistics can be broken down by instrument or participant. DDE
statistics are also provided.

### MRI Statistics

This tab displays the number of scans inserted per site as well as their
QC status. Scan completion is arranged by site, cohort, and timepoint.