## Introduction to Instruments

The Behavioural Database is the part of LORIS that implements the battery of tests 
and questionnaires which are administered and used to collect data on participants 
in a given study. These behavioural, psychological, and clinical tests are known as 
**instruments** or instrument forms.  

Basic instrument forms can be complemented with automated **scoring** and **validation**. 
The implementation of scoring and validation varies based on the chosen instrument 
format, the instructions below describe in more details how the implementation should 
be done for each type.

The **battery** is a list of which instruments are to be administered on each cohort 
of participants, and typically varies per timepoint and per study site.  For example, 
the battery of instruments administered at a participant's first visit (e.g. timepoint 
V01) may depend on which cohort and study site they belong to.  A participant may be 
tested on a certain set of instruments if they are in cohort A and from site X, but 
would be tested on different instruments if they are registered in cohort B at site Y. 
For certain studies, the battery may also depend on the age of the participant. 
(For more information about Battery assignments, navigate directly to the 
[Clinical Test Battery](./07_clinical_test_battery.md) section or continue following 
the documentation).  

### How are Instruments Created?

LORIS instruments can be implemented in one of 2 formats: **LINST** or **PHP**.

**LINST** is a custom LORIS form format which is generated and edited by the LORIS 
Instrument Builder module. The LINST format allows for the creation of basic forms 
and can be complemented by a *score* file to allow for automated scoring  and a *rules* 
file to accommodate for validation of dependencies between form questions and answers.

**PHP** instruments are forms coded manually by a developer in the PHP language. 
These instruments can also have rules and scoring defined.

Choosing the format in which an instrument is coded is necessary before beginning 
the process. Here are a few bullet points that can help you make your decision.

- ***LINST***
- *Pros:*
    - Easy to create (LORIS Instrument Builder)
    - Ideal for simple instruments
    - Less prone to bugs and issues
    - Can be complimented with rules and scoring 
- *Cons:*
    - Validation logic has limitations in complex cases
    - Limited flexibility of form elements (restricted to default LORIS form elements)
- ***PHP***
- *Pros:*
    - Very flexible as form elements can be overwritten, implemented or customized
    - Allows for more complex validation logic
    - Can be converted back to LINST (Manual intervention is only required for validation and scoring)
- *Cons:*
    - Requires a developer
    - Significant maintenance required over time to adapt to new LORIS releases
    - less stable as some elements might change get deprecated over time

> _**Note:** The definitions below can help choosing an instrument format._
> - _**Validation/Rules:** LORIS allows for 3 levels of form validation in instruments. 
>    Level 1 consists in setting a form field as required or not to the completion 
>    of the form. Level 2 set a field to required or not based on the response of 
>    another field in the form. Level 3 uses custom validation functions to determine 
>    the validity or the value set for a field. LINST instruments can use levels 1 
>    and 2, only PHP instruments can use level 3 validation._
> - _**Scoring:** Scoring in LORIS instruments can be implemented in any coding 
>    language regardless of the format of the instrument. By consequence, scoring 
>    logic can range from simple sum algorithms to complex computations referencing 
>    norm tables and look-up charts._

### How is Instrument Data Stored?

The data entered by users in an instrument form can be stored in 2 different formats: 
**SQL table** or **JSON string**. 

JSON data storage makes instrument installation easier by removing the need for table 
creation in the database and reducing maintenance efforts in the long term. However, 
SQL storage allows for data amendments to be done directly through SQL commands without 
the need to parse the JSON data using a tool.

The JSON data string is stored in the `Data` column of the `flag` table. If the SQL 
mode is enabled, a new table must be created and data is stored into the dedicated 
instrument table.

>_**Note:** The support for JSON data storage is a new implementation that is meant 
> to deprecate the use of SQL tables in the medium to long term. It is currently 
> offered as an option only but will eventually replace the SQL method._

## Prerequisites

1. Prepare your **Case Report Forms (CRFs)** including any “look-up” tables used for 
scoring/normalization and any documentation defining possible relationships between 
fields for validation.
2. Determine which **sections of the questionnaire should be included or omitted** 
from the online version. Typically, unless they pertain to the patients themselves, 
administrative details included on the original form can be ignored, but instructions 
that will be helpful for the examiner/patient might be included. 
3. Decide **how all your fields would map to the form element** types allowed by LORIS
(Refer to the Instrument Builder module to get a list of field types available for LORIS forms)
4. Determine if your instrument requires **special certifications** to be administered. 
If so, only certified examiners will be able to administer the instrument. (*For more 
information, see [Additional Configurations - Certification](04_instrument_additional_configurations.md#Certification) section*)
5. Determine if your instrument will have **special access restrictions** other than 
LORIS users from the same site and the same project. LORIS allows for instrument 
specific access permissions if needed. (*For more information, 
see [Additional Configurations - Permissions](04_instrument_additional_configurations.md#Permissions) section*)
6. Determine if your instrument will be **administered by an examiner** and Data-entry 
will be done by personnel **OR** if the instrument will be completed by the **candidate 
directly**.(*For more information, see [Additional Configurations - Surveys](04_instrument_additional_configurations.md#Surveys) section*)
7. Decide which **Quality Assurance (QA)** features you would like to use for the 
instrument [Double Data Entry](05_instrument_quality_assurance.md#Double-Data-Entry) 
and/or [Validity Flagging](05_instrument_quality_assurance.md#Validity)


## Instrument Development Workflow

_This section is meant to describe the recommended workflow of developing and 
installing an instrument in the database. The next sections in the documentation 
follow the same order as the steps listed below._

1. Read the entire "instrument" documentation before getting started.
2. Determine your answer for every item in the [Prerequisites](#Prerequisites) section above
3. Start Developing your instrument either using the [**LINST**](./02_instrument_format/LINST_instrument.md) 
or [**PHP**](./02_instrument_format/PHP_instrument.md) format.
4. Install your instrument by following the [Installation Instructions](03_instrument_install.md)
5. Configure your new instruments following the [Additional Configurations](04_instrument_additional_configurations.md) section
6. Finally, [set up your behavioural test battery](07_clinical_test_battery.md) in 
order to be able to [test and troubleshoot](06_instrument_testing_and_troubleshooting.md) 
your instrument 
