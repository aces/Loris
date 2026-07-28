# Timepoint List - Test Plan

This test plan aim to test the GUI functionality of access to a candidate's timepoints within incremental permissions changes.

Table of Contents

1. [Timepoint list](#timepoint-list)
2. [Permission Leak](#permission-leak)
3. [All Sites Permission](#all-sites-permission)
4. [View Imaging Datasets Permission](#view-imaging-datasets-permission)

Begin with 2 users:

1. The first with a single site/
2. The second with a different site.

Give both the following permission:

- [x] Access Profile: Candidates and Timepoints - Own

## Timepoint List

- Go into Access Profile and select the first PSCID in the list

1. Assert that there are timepoints in the Visit Label Column
2. Click on a time point and assert that you are redirected to instrument_list where you see the candidate's instrument battery.
3. Assert that the visit label is listed in the top table in the `Visit Label` field.

## Permission Leak

- Copy the URL of this candidate's instrument list and paste it into the URL of user 2, who does **not** have permission to the same site

- assert that the user 2 is instead redirected to the their own list of candidates.

## All Sites Permission

- Return to user 1 and give them the follwoing permission:
- [x] Access Profile: Candidates and Timepoints - All Sites
- Assert that the user can see all candidates from all sites.
- Select a candidate from each site and assert the following:

    1. you see a list of their timepoints
    2. you can see the battery of instruments of each
    3. For a candidate with a different site assert that you can not see the Candidate Information buttons `Create Time Point` and `Candidate info`

- Select a candidate with the same site as your user setting. 

Assert that the following buttons appear under `Actions`:

1. `Create time point`
        - Assert that this links to `>Create Timepoint` and that the site configuration (the possibilities of sites that you see) is constrained to the user setting.

2. `Candidate Info`
        - Assert that by clicking this button you get a 403

- Add the following permission:

- [x] Candidate Parameters : Candidate Information
- Click on the `Candidate Info` button again and assert that you are redirected to the candidate's parameters.
- Click on the `Candidate Information` button and assert that you are re-directed to  `>Candidate Parameters`  

## View Imaging Datasets Permission

Add the following permission to user 1:

- [x] Imaging Browser: Imaging Scans - Own Sites

- Click on the `View Imaging Datasets` button and assert that you are taken to the imaging browser

- Assert that if `Scan Done` indicates yes, that the link takes you to the imaging browser and that images of that candidate are shown.
