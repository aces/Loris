## Quality Control Module

#### Purpose
The purpose of this module is to ensure data has been uploaded into LORIS properly. LORIS employs double data entry as a quality control measure, and this module is designed to catch any inconsistencies.

#### Intended Users
This module is used by data entry staff, imaging scientists, analysts, coordinators, and clinicians.

#### Scope
There are two tabs: behavioral and imaging. 

###### Behavioral
The behavioral tab allows you to view data based on the filters: visit, DCCID (randomized 6-digit numeric candidate ID), PSCID (unique Project Study Center ID), and Instrument (test). You can download the table in .csv format. 
	I.e. data entry conflicts

###### Imaging
The imaging tab allows you to view more specific data on uploaded image files, with many additional filtering options. The resulting table has a column for QC status, so you can see whether the upload has passed QC or not. The table indicates the location of each file as a clickable hyperlink. You can download the table in .csv format. 

The QC module is simply a tool to view where conflicts exist within your data. Once you’ve identified any issues, you’ll need to go elsewhere in LORIS to amend them. For example, the QC module may tell you that there’s a conflict with a double data entry point. From there, you would visit the Conflict Resolver module to address/fix the issue. 

In other words, the QC module is designed to bring all quality control information into the same module, for ease of access.

###### Permissions
Placeholder - waiting for contribution from Liza

##### Interactions
The QC module is directly related to the following modules:

###### Data Team Helper
This module allows you to see data issues, as separated into three sections: Incomplete Forms, Data Conflicts, and Behavioural Feedback. Clicking on any item in the *Instrument* columns will bring you right into the QC module.

###### Conflict Resolver
This module displays inconsistencies related to double data entry. The column for *Unresolved Conflicts* will show you any issues that have two conflicting answers, where they should be identical. You can fix this issue directly within the module. 

######Imaging Browser
This module displays images (from candidate scan sessions) collected for a study. It has columns to show whether images have passed QC, and when. 

#### Configuration
Placeholder - waiting for contribution from Liza
