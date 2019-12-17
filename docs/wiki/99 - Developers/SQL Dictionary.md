# SQL Dictionary

*This document lists SQL tables and fields in the LORIS database and provides a description for each. In some instances these descriptions can include definitions, usage location in the code, examples and limitations.*

 - Table: `psc`
 
 	*This table stores the list of sites configured for the study.*
 
	|     Field    |                    Description                   |                                             Notes                                            |
	|:------------:|:------------------------------------------------:|:--------------------------------------------------------------------------------------------:|
	| `CenterID`   | Identifier of the site                           | Avoid setting this field explicitly when inserting data, it auto increments.                 |
	| `Name`       | Full name of the site                            |                                                                                              |
	| `PSCArea`    |                                                  | Deprecated                                                                                   |
	| `Address`    | Civic address of the site                        |                                                                                              |
	| `City`       | City where the site is located                   |                                                                                              |
	| `StateID`    | Identifier of the state where the site is located|                                                                                              |
	| `ZIP`        | ZIP code of the site                             |                                                                                              |
	| `Phone1`     | Phone number 1                                   |                                                                                              |
	| `Phone2`     | Phone number 2                                   |                                                                                              |
	| `Contact1`   | Contact person 1                                 |                                                                                              |
	| `Contact2`   | Contact person 2                                 |                                                                                              |
	| `Alias`      | Shortname of the site. Limited to 3 characters   | This field affects the alias section of the PSCID of candidates                              |
	| `MRI_alias`  | MRI specific shortname. Limited to 4 characters  |                                                                                              |
	| `Account`    |                                                  | Deprecated                                                                                   |
	| `Study_site` | Does this site recruit candidates?               | This field will affect the appearance of the center in dropdowns in several modules of LORIS |

- Table: `visit`

 	*This table stores the list of timepoints configured for the study.*
 	
 	|     Field    |          Description          |                                    Notes                                                |
	|:------------:|:------------------------------------------------:|:-------------------------------------------------------------------:|
	| `VisitID`   | Identifier of the Timepoint    | Avoid setting this field explicitly when inserting data, it auto increments.    |
	| `VisitName` | Back end name of the Timepoint | This name is used in file and imaging uploads (previously known as `visit_label`) |

- Table: `Visit_Windows`

 	*This table associates timepoints with optimal age ranges for quality control monitoring.*
 	
 	|        Field         |                                        Description                                        |                         Notes                          |
	|:--------------------:|:-----------------------------------------------------------------------------------------:|:------------------------------------------------------:|
	| `ID `                | Identifier of the entry                                                                                   | Avoid setting this field explicitly when inserting data, it auto increments.           |
	| `Visit_label `       | Name of the visit                                                                                         |  |
	| `WindowMinDays `     | Candidate's minimum age in days for visit to be flagged as _within **permitted** parameters of the study_ | The only effect of this field is a YES/NO flag showing up on the instrument_list page|
	| `WindowMaxDays `     | Candidate's maximum age in days for visit to be flagged as _within **permitted** parameters of the study_ | The only effect of this field is a YES/NO flag showing up on the instrument_list page|
	| `OptimumMinDays `    | Candidate's minimum age in days for visit to be flagged as _within **optimal** parameters of the study_   | The only effect of this field is a YES/NO flag showing up on the instrument_list page|
	| `OptimumMaxDays `    | Candidate's maximum age in days for visit to be flagged as _within **optimal** parameters of the study_   | The only effect of this field is a YES/NO flag showing up on the instrument_list page|
	| `WindowMidpointDays `| Candidate's ideal age in days for a visit                                                                 |  |
	

- Table: `Project`
 
 	*This table stores the list of projects configured for the study.*
 
	|         Field        |                  Description                  |                                        Notes                                                 |
	|:--------------------:|:---------------------------------------------:|:--------------------------------------------------------------------------------------------:|
	| `ProjectID`          | Identifier of the project                     | Avoid setting this field explicitly when inserting data, it auto increments.          |
	| `Name`               | Full name of the project                      |                                                                                              |
	| `recruitmentTarget`  | Expected number of candidates to be recruited |                                                                                              |


- Table: `subproject`
 
 	*This table stores the list of subprojects configured for the study.*
 
	|        Field       |                  Description                  |                                     Notes                                    |
	|:------------------:|:---------------------------------------------:|:----------------------------------------------------------------------------:|
	| `SubprojectID`     | Identifier of the subproject                  | Avoid setting this field explicitly when inserting data, it auto increments. |
	| `title`            | Name of the subproject                        |                                                                              |
	| `useEDC`           | Use the Expected date Of Confinement          |                                                                              |
	| `WindowDifference` |                                               | Deprecated ??                                                                |
	| `RecruitmentTarget`| Expected number of candidates to be recruited |                                                                              |
	
	
- Table: `project_subproject_rel`
 
 	*This table stores the association of projects with subprojects*
 
	|            Field          |                    Description                   |                                     Notes                                    |
	|:-------------------------:|:------------------------------------------------:|:----------------------------------------------------------------------------:|
	| `ProjectSubprojectRelID ` | Identifier of the project-subproject relation    | Avoid setting this field explicitly when inserting data, it auto increments. Other tables in the database require this field as a foreign key reference to point to a specific project-subproject tuple.   |
	| `ProjectID `              | Project identifier                               |                                                                              |
	| `SubprojectID `           | Subproject identifier                            |                                                                              |
