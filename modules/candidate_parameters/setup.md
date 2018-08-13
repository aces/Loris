#### Consent Status Tab - Additional Consents
 
It is possible to have multiple consent types in the Consent Status tab. 
In order to add consents, first make sure that the _useConsent_ option in the Configurations module is set 
to `true`. Secondly, follow the instructions below:
 
1. Populate the `consent` table with additional consents. For example, 
for consent to draw blood:

    ```sql
    INSERT INTO consent (Name, Label) VALUES ('draw_blood_consent', 'Consent to Draw Blood');
    ```

#### Candidate Information Tab - Additional Parameters
 
In addition to the Settings above, it is possible to add candidate parameters 
to the Candidate Info page. To do so, values must be added in SQL following the 
example below.

Example:

```sql
INSERT INTO `parameter_type_category` (Name, Type) VALUES ('Candidate Parameters','Metavars');
INSERT INTO parameter_type (Name, Type, Description, SourceFrom, Queryable) VALUES 
  ('candidate_plan', "enum('6month', '12month')", 'Visit plan for candidate', 'parameter_candidate', 1);
      
INSERT INTO parameter_type_category_rel (ParameterTypeID, ParameterTypeCategoryID) SELECT 
pt.ParameterTypeID, ptc.ParameterTypeCategoryID FROM parameter_type_category ptc, 
parameter_type pt WHERE ptc.Name='Candidate Parameters' AND pt.Name='candidate_plan';
```

These queries will add a single additional dropdown with label _"Visit plan for candidate"_, 
field name _"candidate_plan"_, and options _"6month"_, _"12month"_. 
Values entered from the module in this field will be saved in the `parameter_candidate` 
table in SQL. 

_Note that the first query inserting into `parameter_type_category` is only required 
the first time an addition to the Candidate Information_ tab is done, once that entry 
is added the query does not need to be run again._
