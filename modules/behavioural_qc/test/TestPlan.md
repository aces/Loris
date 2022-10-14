# Behavioural Quality Control Test Plan

1. Make sure the user can only access the module if they have the permission 
_Behavioural Quality Control: View Flagged Behavioural Entries_ (`behavioural_quality_control_view`)
2. Make sure that without the _Access Profile: View Candidates and
Timepoints - All Sites_ (`access_all_profiles`) permission the user only has 
access to data affiliated with their site and with the permission they can see data 
from all sites.
3. Make sure the 3 tabs load _Incomplete Forms_, _Data Conflicts_ and _Behavioural Feedback_.
4. Make sure links on all pages are functional and redirect the user to the appropriate page. 
Links to PSCID/DCCID should redirect to the candidate page. Links to visits  should redirect to the 
candidate's timepoint. Links to instruments should redirect to the data entry form. Finally, feedback links 
should open the appropriate window where the feedback was entered.
5. Confirm that the feedback status in the _Behavioural Feedback_ tab is correct.
6. Make sure filters function properly and select the expected data from the table in each tab.
