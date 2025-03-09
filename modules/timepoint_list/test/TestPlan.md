This test determines if permissions are working in the time_point module.<br>
<br>

## Table of Contents<br>
1. [Setup](#setup)
2. [Test Site Constraint](#test-site-constraint)
    - [list only candidates of same site](#list-only-candidates-of-same-site)
    - [load time points by entering DDCID in url](#load-time-points-by-entering-DDCID-in-url)
    - [deny access to candidate of different site](#deny-access-to-candidate-of-different-site)
    - [open profile button](#open-profile-button)
3. [Test Project constraint](#test-project-constraint)
4. [Test All sites permission](#test-all-sites-permission)
5. [Test Buttons](#test-buttons)
    - [create time point](#create-time-point)
    - [candidate info](#candidate-info)
    - [view imaging datasets](#view-imaging-data)

<br>

## Setup

Sign into your loris instance with an **admin** account.<br>

- select Admin Accounts and click the Add User button.<br> 
- enter all required information.<br>
- select *ONE* site for example, "Rome".<br>
- select *ONE* project, for example Pumpernickel.<br>
- tick box:Roles/Access Profile: View/Create Candidates and Timepoints - Own Sites.<br>
>This permission ensures that ONLY candidates who share the same site as your user are listed (in this case "Rome").<br>

<br>

## Test Site constraint<br> 

#### a) List only candidates of same site<br>
open a separate **incognito** or **private** browser window.
Sign into your loris instance. Enter the credentials of the user that you just created. Click Candidate/Access Profile.<br>
>You should see only candidates of that site "Rome" (in our example)

#### b) Load time points by entering DDCID in url<br>
copy the DDCID of this user, paste as follows:
https://\<yourInstance>\.loris.ca\<paste the candidateID here><br>
>if this loads a list of timepoints 
OR returns:"there are no timepoints associated with this candidate" then this test is successful

#### c) Deny access to candidate of a different site<br>
enter a candidate ID into url that is from a different site.<br>
>If "Permission Denied" message is shown, then this test has passed

#### d) Open Profile Button<br>
Does Open Profile button work with this permission enabled?<br>
Click the 'Open Profile' button.<br>
Enter the DDCID number and PSCID of the same candidate.
This will replicate the same behaviour as clicking on the candidate's PSCID, showing their list of timepoints.<br>
>If it does, then the permission fully works. 

<br>

## Test Project constraint<br>
Are the projects shown the same as those you selected in your user settings (in our example: "Pumpernickel")?<br>Refresh your incognito (or private) browser.
You will see a list of time points from all sites that share your selected project (in this case "Pumpernickel").<br> 
>If other projects are shown, then this test has failed.<br>

<br>

## Test All sites permission<br>
tick : Permissions/Access Profile: View/Create Candidates and Timepoints - All Sites

Select a candidate from a different site and open up a timepoint.

>If you are allowed to view a list of timepoints for this candidates from different sites, then the permission has worked.

>if it reads 
"You do not have access to any timepoints registered for this candidate," then this test has failed.

<br>

## Test Buttons<br>
For a Candidate of **same site**, there should be 3 Buttons, as follows:<br>

#### a) Create time point<br>

>Click this. If it takes you to 'Create Time Point', this test has passed
 
#### b) Candidate info<br> 
>Click this. If you get code 403, the 
'Candidate Parameters: View Candidate Information' permission is needed.
Else, if you are taken to candidate parameters, this test has passed.

#### c) View Imaging datasets<br>
>Click this. If you are taken to imaging browser, this test has passed.<br>

If you don't see this button, tick the permission:
'Imaging Browser: View Imaging Scans - Own Sites'
refresh and try again.

<br>

## End









