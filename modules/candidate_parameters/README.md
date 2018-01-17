# Candidate Parameters

## Purpose

The Candidate Parameters module allows users to input 
candidate data that is not timepoint specific.

## Intended Users

The primary types of users are:
1. Data entry personnel
2. Site coordinators validating the data

## Scope

The Candidate Parameters modules stores all information 
for a candidate that are not timepoint dependent. All data 
being collect during a visit should be entered as an instrument 
at the visit level.

## Permissions

The Candidate Parameters module uses the following permissions. Any one of them
is sufficient to have access to the module.

candidate_parameter_view
    - This permission gives the user viewing access to the module and all its tabs.

candidate_parameter_edit
    - This permission gives the user editing access to the module and all its tabs.

## Configurations

The candidate parameters module has the following configurations that affect its usage

useProband 
    - This setting displays/hides the Proband tab of the module

useFamilyID
    - This setting displays/hides the Family tab of the module

useConsent 
    - This setting displays/hides the Consent tab of the module

## Interactions with LORIS

- Information collected in this modules is exported into the DQT using the 
CouchDB_Import_Demographics.php tool. Any modifications or additions to 
this module should be manually added to the script in order to view 
them in the Data Query Tool.
