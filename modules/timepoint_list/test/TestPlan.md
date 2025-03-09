
This test determines if permissions are working in the time_point module.<br>

Setup:<br>
-
Sign into your loris instance with an **admin** account.<br>

- select Admin Accounts and click the Add User button.<br> 
- enter all required information.<br>
- select *ONE* site for example, "Rome".<br>
- select *ONE* project, for example Pumpernickel.<br>
- tick box:Roles/
- Access Profile: View/Create Candidates and Timepoints - Own Sites.<br>

>This permission ensures that ONLY candidates who share the same site as your user are listed (in this case "Rome").<br>

Test 1 : Acces Profile
-
 
(a)
-
open a separate **incognito** or **private** browser window.
Sign into your loris instance. Enter the credentials of the user that you just created.<br>
click Candidate/Access Profile.<br>
>You should see only candidates of that site "Rome" (in our example)

(b)
-
copy the DDCID of this user, paste as follows:
https://\<yourInstance>\.loris.ca\<paste the candidateID here><br>
>if this loads a list of timepoints 
OR returns:"there are no timepoints associated with this candidate" then this test is successful

(c)
-
Does Open Profile button work with this permission enabled?<br>
Click the 'Open Profile' button.<br>
Enter the DDCID number and PSCID of the same candidate.
This will replicate the same behaviour as clicking on the candidate's PSCID, showing their list of timepoints.<br>
>If it does, then the permission fully works. 

Test 2 : Projects
-
Are the projects shown the same as those you selected in your user settings (in our example: "Pumpernickel")?<br>Refresh your incognito (or private) browser.
You will see a list of time points from all sites that share your selected project (in this case "Pumpernickel").<br> 
>If other projects are shown, then this test has failed.<br>


Test 3 : All sites
- 

tick 
Permissions/Access Profile: View/Create Candidates and Timepoints - All Sites

Select a candidate from a different site and open up a timepoint.

>If you are allowed to view a list of timepoints for this candidates from different sites, then the permission has worked.

>if it reads 
"You do not have access to any timepoints registered for this candidate," then this test has failed.

Test 4 : Access candidate of a different site
-
enter a candidate ID into url that is from a different site.

>If "Permission Denied" message is shown, then this test has passed

Test 5 : For a Candidate of **same site**, there should be 3 Buttons, as follows:<br>
-
(a) Create time point<br>
- 

Click this. If it takes you to 'Create Time Point', this test has passed
 
(b) Candidate info<br> 
-
>Click this. If you get code 403, the 
'Candidate Parameters: View Candidate Information' permission is needed.
Else, if you are taken to candidate parameters, this test has passed.

(c) View Imaging datasets<br>
- 
>Click this. If you are taken to imaging browser, this test has passed.<br>

If you don't see this button, tick the permission:
'Imaging Browser: View Imaging Scans - Own Sites'
refresh and try again.


End
-

