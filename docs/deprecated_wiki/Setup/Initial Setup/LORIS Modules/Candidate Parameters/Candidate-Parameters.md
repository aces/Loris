**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[LORIS MODULES|LORIS Modules]]** > **[[CANDIDATE PARAMETERS|Candidate-Parameters]]**

Candidate Parameter fields, displayed in the [[Candidate Information page|Candidate-Information-Page]], store data relevant to the candidate across all timepoints, such as race/ethnicity, comorbidities, blood type, and IDs from other studies. To add new candidate parameters, define each field in the parameter_type table and then populate values in parameter_candidate table.

> Note: To add a **consent** field, please see [[Candidate Information Wiki page|Candidate-Information-Page]]

   1. Create a new Candidate Parameter in the parameter_type table:

      For example, a new field to record each candidate’s assigned Visit plan can be added as follows:

     If not already in the parameter_type_category table, add an entry for Candidate Parameters: 
     ```sql 
     INSERT INTO `parameter_type_category` (Name, Type) VALUES ('Candidate Parameters','Metavars');
     ```

     Then add definitions for the new Candidate Parameter variable/field you wish to add (e.g. _candidate_plan_): 
      ```sql
      INSERT INTO parameter_type (Name, Type, Description, SourceFrom, Queryable) VALUES 
      ('candidate_plan', "enum('6month', '12month')", 'Visit plan for candidate', 'parameter_candidate', 1);
     
      INSERT INTO parameter_type_category_rel (ParameterTypeID, ParameterTypeCategoryID) SELECT 
      pt.ParameterTypeID, ptc.ParameterTypeCategoryID FROM parameter_type_category ptc, 
      parameter_type pt WHERE ptc.Name='Candidate Parameters' AND pt.Name='candidate_plan';
      ```

   2. Display fields in front-end [DEPRECATED ENTIRE MODULE MUST BE COPIED]:

       By default, all candidate_parameter fields for the candidate are displayed on the Candidate Info page. 

       To override the default Candidate Information Page in the front end (e.g. to modify the field order or default display format), copy the file modules/candidate_parameters/php/NDB_Form_candidate_parameter.class.inc to the project/libraries/ directory and modify.   

   3. Populating values in parameter_candidate table:

      Candidate parameter values are entered via the Candidate Information page.  In the back end, values can also be inserted or modified via the parameter_candidate table, using the ParameterTypeID value from the parameter_type table to identify each field. Note: values must conform to the field definition provided in the Type column of the parameter_type table, e.g. "enum('6month', '12month')".

   4. [DEPRECATED DOES NOT WORK] To additionally display this parameter in the Header table at the top of the Timepoint list and Instrument list pages, add the parameter name to the <HeaderTable> section of `project/config.xml`, within a tag for parameter table name (e.g. `parameter_candidate`):

      `<parameter_candidate>$NAME_OF_PARAMETER</parameter_candidate>`