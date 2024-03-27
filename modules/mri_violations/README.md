# MRI violations

## Purpose

The MRI violations module provides a front end to view information
about scans that were flagged as violations of the imaging protocol
(which is configurable and set by each study) by the imaging pipeline 
scripts. 

The violations also serve as prompts to inform 
scanner technologists that settings need to be adjusted for future 
scans (i.e. number of slices are being reduced from the protocol), or 
as a cue that something is wrong (i.e. coil not functioning properly).

## Intended Users

The MRI violations module is primarily used by DCC staff and the MR 
Imaging Committee who both decide whether a scan should be included 
in the batch of study scans or, alternatively, if it should be excluded 
from further analysis. 

## Scope

The MRI violations module shows a summary of the MRI violations
(one image per row) identified by the imaging pipeline scripts.
It can be used to set a "Resolution Status" for how the violation
was dealt with.

Additionally, the violations "Resolution Status" column can be
updated once the violation has been resolved. Available options
are:

- **Unresolved**: this indicates this scan still needs to be 
addressed by the DCC or MRI committee
- **Reran**: this indicates that this scan will be rerun through 
the imaging insertion pipeline and inserted
- **Emailed site/pending**: this indicates that the site has been 
emailed about this scan, and a resolution or answer is pending 
(i.e.. mismatched PSCID and DCCID in the naming convention or a visit 
label that has not yet been created)
- **Inserted**: this means that the scan has been inserted into 
the Imaging Browser, and no flag was needed
- **Rejected**: this means that the scan has been excluded for future 
analysis and will not be inserted into the Imaging Browser nor 
available for download from the DQT
- **Inserted with flag**: this means that the scan has been inserted 
into the Imaging Browser and a caveat flag was attached - this caveat 
flag should have either a drop down menu or open text for the person 
approving the insertion to indicate what the flag is for
- **Other**: resolutions that don't fit in any of the above categories 

It does not resolve any problems itself, it only logs the problem and
what resolution occured.

## Permissions

To access the MRI violated module, one must have either the `violated_scans_view_allsites`
or the `violated_scans_view_ownsites` permission.

## Configurations

The `mri_protocol` and `mri_protocol_checks` tables need to be configured
with the study MRI protocol in order for the imaging scripts to determine
whether a scan violates the protocol set by the study.

## Interactions with LORIS

The `mri_protocol_violated_scans`, `mri_violations_log` and
`MRICandidateErrors` tables used by the MRI violations module must
be populated before there is any data in the module. The imaging
`tarchiveLoader` script populates them as part of the imaging pipeline.

**Notes:**
- `mri_protocol_violated_scans` logs all the scans referring to
the problem "Could not identify scan type"
- `mri_violations_log` logs all the scans referring to the problem
"Protocol Violation"
- `MRICandidateErrors` logs all the scans referring to the problem
"Candidate Mismatch"

## Dashboard Widget

The total number of unresolved `Violated scans` will be shown inside the Dashboard widget, named "My Tasks"
with a link pointing to the mri_violations module with the Resolution Status filter set to "Unresolved".
