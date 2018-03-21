# Candidate Parameters

## Purpose

The Candidate Parameters module allows users to input 
candidate data that is not timepoint specific.

## Intended Users

The primary types of users are:
1. Data entry personnel
2. Site coordinators validating the data

## Scope

The Candidate Parameters module stores all information 
for a candidate that are not timepoint dependent. All data 
being collected during a visit should be entered as an instrument 
at the visit level.

## Permissions

The Candidate Parameters module uses the following permissions. Any one of them
is sufficient to have access to the module.

 - candidate_parameter_view
    - This permission gives the user viewing access to the module and all its tabs.

 - candidate_parameter_edit
    - This permission gives the user editing access to the module and all its tabs.

## Configurations

The candidate parameters module has the following configurations that affect its usage

 - useProband 
    - This setting displays/hides the Proband tab of the module.

 - useFamilyID
    - This setting displays/hides the Family tab of the module.

 - useConsent 
    - This setting displays/hides the Consent tab of the module.
 
 #### Additional Parameters
 In addition to the Settings above, it is possible to add candidate parameters to the Candidate Info page. To do so, values must be added in SQL following the example below. These queries will add a single additonal dropdown with label _"Visit plan for candidate"_, field name _"candidate_plan"_, and options _"6month"_, _"12month"_. When candidate information is entered for this field, the value is saved in the `parameter_candidate` table in SQL.
 
 Example:
 ```
 INSERT INTO `parameter_type_category` (Name, Type) VALUES ('Candidate Parameters','Metavars');
 INSERT INTO parameter_type (Name, Type, Description, SourceFrom, Queryable) VALUES 
  ('candidate_plan', "enum('6month', '12month')", 'Visit plan for candidate', 'parameter_candidate', 1);
 
  INSERT INTO parameter_type_category_rel (ParameterTypeID, ParameterTypeCategoryID) SELECT 
  pt.ParameterTypeID, ptc.ParameterTypeCategoryID FROM parameter_type_category ptc, 
  parameter_type pt WHERE ptc.Name='Candidate Parameters' AND pt.Name='candidate_plan';
 ```
 
 #### Additional Consents
 It is possible to have multiple consent types in the Consent Status tab. In order to add consents, first make sure the useConsent option is set to `true`, second fillow the instructions below.
 
 1. Populate the config file with additional Consent tagsets. For example, for consent to draw blood:

         ```xml
         <ConsentModule>
             <useConsent>true</useConsent>
             <Consent>
                 <name>study_consent</name>
                 <label>Consent to Study</label>
             </Consent>
             <Consent>
                 <name>draw_blood_consent</name>
                 <label>Consent to draw blood</label>
             </Consent>
         </ConsentModule>
         ```
 2. Then, alter both participant_status and consent_info_history table schemas, adding 3 columns for the new consent type, to store consent status, date and withdrawal status. For example:

         ```sql
         ALTER TABLE participant_status ADD COLUMN draw_blood_consent enum('yes','no','not_answered');
         ALTER TABLE participant_status ADD COLUMN draw_blood_consent_date date;
         ALTER TABLE participant_status ADD COLUMN draw_blood_consent_withdrawal date;
         ALTER TABLE consent_info_history ADD COLUMN draw_blood_consent enum('yes','no','not_answered');
         ALTER TABLE consent_info_history ADD COLUMN draw_blood_consent_date date;
         ALTER TABLE consent_info_history ADD COLUMN draw_blood_consent_withdrawal date;
         ```

## Interactions with LORIS

- Information collected in this modules is exported towards the Data Query Tool (DQT) 
using the `CouchDB_Import_Demographics.php` tool. Any modifications or 
additions to this module should be manually added to the script in order to view 
them in the DQT Demographics table or alternatively added to 
another script to be exported separately towards the DQT.
