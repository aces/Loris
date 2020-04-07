# Candidate Profile (beta) Test Plan

The following tests should be performed by a user with the `superuser` permission.
This module loads information from many modules so this is the easiest way to
make sure data from other modules will load properly.

Depending on the permissions the user account has, some of these panels will not function
or will not load at all.

1. Ensure that data loads in each of the panels on the page:
    * Candidate Info (basic candidate data)
    * Consent Summary
    * Candidate Media
    * Imaging QC Summary
    * Behavioural Data
2. Within the Candidate Info panel:
    * Click a link under the Vists heading. This should take you to the instrument_list module.
3. Click a file under Candidate Media. This should trigger a file download.
4. Within the Imaging QC Summary panel:
    * Hover over a bar in the chart. A legend should be displayed.
    * Click a bar in the chart. This should take you to the imaging browser module.
5. Within the Behavioural Data panel:
    * Hover over a row. It should turn grey.
    * Click a row. It should expand to show instruments associated with the visit.
    * Click on a link to one of the instruments. This should load the instrument in the instruments module.
6. Disable one of the modules listed above. This can be done using the `Manage Modules` module. Make sure the corresponding panel disappers from the candidate_profile.
7. Click the breadcrumb 'Candidate Dashboard...' under the menu bar. This should refresh the page. It should not bring you to the old candidate profile.

Using a user with fewer privileges, visit the same candidate profile. Make sure
that some of the above panels do not load when you don't have permission.
