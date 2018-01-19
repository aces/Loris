# MRI violations

## Purpose

The MRI violations module provides a front end to view information
about scans that were flagged as violations of the imaging protocol
by the imaging pipeline scripts.

## Intended Users

The MRI violations module is primarily used by DCC staff who are
investigating why some scans were flagged as violations of the
imaging protocol.

## Scope

The MRI violations module shows a summary of the MRI violations
(one image per row) identified by the imaging pipeline scripts.
Depending on the type of violation, clicking on the scan's problem
will redirect the user to pages with more information regarding
the identified violation. The different type of violation are:

- Could not identify scan type
- Protocol Violation
- Candidate Mismatch

Additionally, the violations "Resolution Status" column can be
updated once the violation has been resolved. Available options
are:

- Unresolved
- Reran
- Emailed site/pending
- Inserted
- Rejected
- Inserted with flag
- Other

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