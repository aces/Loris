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
Depending on the type of violation, clicking on the scan's problem
will redirect the user to pages with more information regarding
the identified violation. The different types of violation are:

- Could not identify scan type
- Protocol Violation
- Candidate Mismatch

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

Finally, the `mri_protocol` table can be updated directly from
the frontend if the user has the permission for it.

## Permissions

The permission `violated_scans_view_allsites` is required to access
the MRI violated module.

In addition, the permission `violated_scans_edit` allows the user to
edit the `mri_protocol` table directly from the browser.

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
