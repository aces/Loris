# Schedule Module Test Plan

1. Create an Appointment [Automation Testing]
Ensure that create does NOT work if one or more of the fields are empty. 
Ensure that the available sessions are correct for the candidate. 
After successfully making an appointment, ensure the appointment has been added properly (table is properly populated)

2. Edit an Appointment [Automation Testing]
DCCID, PSCID, Session are non editable fields. 
Ensure that any changes made show up in the table properly. 
When user clicks "edit" but did not make any changes, an error swal will pop up indicating that no changes were made

3. Delete an Appointment [Automation Testing]
Delete by clicking the delete button. There should be an "Are you sure" message.

4. Permissions [Automation Testing]
Users should be able to see appointments accross all sites, but should only be able to edit and delete a candidate that belongs to their site. 

5. Appointment List [Automation Testing]
Ensure pagination works.
Ensure sort by column works.
Ensure that the PSCID links to the candidate's visit list, and the Visit Label links to the correct timepoint of the candidate.

6. Tabs 
Ensure Past,Next 30 Days and today tabs function correctly. 

7. Filters 
Ensure all filters work correctly 
Earliest date and Latest date is for a date range, however can be used separately. 
For example, if Earliest date is 2020-01-01, the result is all appointments including and after 2020-01-01
Similarly, if Latest date is 2020-01-01, the result is all appointments including and before 2020-01-01
Ensure results are accurate when using more than one filter 
Results tab should pop up when filtering, and will disappear when you click Clear 