# Candidate Parameters

## Purpose

The Candidate Parameters module allows users to input 
candidate data that is not timepoint specific.

## Intended Users

The primary types of users are:
1. Data entry personnel
2. Site coordinators who are validating the data

## Scope

The Candidate Parameters module stores all information 
for a candidate that is not timepoint dependent. All data 
collected during a visit should be entered as an instrument 
at the visit level.

## Permissions

The Candidate Parameters module uses the following permissions. Either one
is sufficient to access the module.

 - `candidate_parameter_view`
    - This permission gives the user access to view the module and all of its tabs.

 - `candidate_parameter_edit`
    - This permission gives the user access to edit the module and all of its tabs.

## Configurations

The following configurations affect the usage of the Candidate Parameters module:

 - `useProband` 
    - This setting displays/hides the _Proband_ tab of the module.

 - `useFamilyID`
    - This setting displays/hides the _Family_ tab of the module.

 - `useConsent`
    - This setting displays/hides the _Consent Status_ tab of the module.
 
The _Candidate Information_ tab dynamically displays customized fields configured in 
the database. The following SQL tables affect the behaviour of these fields:

 - `parameter_type_category`
    - Identifies the categories for `parameter_type` entries. This table requires an 
    entry for the _Candidate Parameters_ module for customizations to take effect.
 - `parameter_type`
    - Lists fields, and all of their attributes, that are to be displayed on the 
    front-end of the module.
 - `parameter_type_category_rel`
    - Associates the Candidate Parameters from the `parameter_type` 
    table with the entry in the `parameter_type_category`.
 - `parameter_candidate`
    - Stores values saved for each custom field added in the 3 tables above.

## Interactions with LORIS

- Information collected in this modules is exported to the Data Query Tool (DQT) 
using the `CouchDB_Import_Demographics.php` tool script. Any modifications or additions 
to this module should be manually added to the script in order to be included 
in the DQT Demographics table. Alternatively, these modifications or additions can be 
added to a separate script that is then exported to the DQT.
- The `candidate_parameters` module registers widgets in the `candidate_profile`
  module
