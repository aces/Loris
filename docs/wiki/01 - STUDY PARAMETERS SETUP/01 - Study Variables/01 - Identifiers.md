# Identifiers

## Overview
By default LORIS provides 3 different identifiers for each candidate: 

- **CandID**, also known as the **DCCID**, is a unique randomized 6-digit numeric ID (e.g. '436792') assigned automatically by LORIS upon the candidate's registration. The CandID is not configurable.
- **PSCID** (Project Study Center ID) is a unique configurable ID. It can be set up to be either manually entered when registering a candidate or automatically generated and usually contains the site or project abbreviation followed by sequential or randomized characters (e.g. 'MTL0006'), but its exact format is customizable.
- **ExternalID** is a unique configurable ID. It can be set up to be either manually entered when registering a candidate or automatically generated and it is generally completely de-identified (no site or project information incorporated) to be used for data dissemination.

The format and the generation of the **PSCID** and **ExternalID** must be configured by an admin by editing the `config.xml` file.

## Configuration

### Configuration from the front end
_not yet available_

### Configuration from SQL
_not yet available_

### Configuration from the config.xml file

Both the format and the generation of PSCIDs can be configured by an administrator in the `config.xml` file. These settings are applied to any and all new candidates.

PSCIDs can be created for new subjects in one of 3 ways: *sequentially generated*, *manually entered*, or *randomly generated*.

1. ***sequential*** generates PSCIDs sequentially for each new candiddate registered. **(default)**

 ```xml
 <PSCID>
     <generation>sequential</generation> 
     <structure>
         <seq type="siteAbbrev"/>
         <seq type="numeric" length="4" min="10" max="9999"/>
     </structure>
 </PSCID>
 ```
 > Example PSCID generated: MTL1234
 > Where the site's alias is MTL

2. ***manual*** asks the user to enter the PSCID when registering a new candidate.

 ```xml
 <PSCID> 
     <generation>user</generation> 
     <structure>
         <seq type="alphanumeric" length="2"/>
     </structure>
 </PSCID>
 ```
  > Example PSCID accepted: A1

3. ***random*** generates PSCIDs with a random numerical value for each new participant registered.

 ```xml
 <PSCID>
     <generation>random</generation> 
     <structure>
         <seq type="static">PREFIX</seq>
         <seq type="numeric" length="4" min="1" max="9999"/>
     </structure>
 </PSCID>
 ```
 > Example PSCID generated: PREFIX3994
 
 Options for the `type` element of the `<seq>` tag are:
  - `siteAbbrev`: A string value that will be used as a dynamic prefix. Value drawn from the `Alias` 
  field of the `psc` table in the database.
  - `projectAbbrev`: A string value that will be used as a dynamic prefix. Value drawn from the `Alias` 
  field of the `Project` table in the database.
  - `static`: A string value that will be used as a fixed prefix. Value defined in the `config.xml` file.
  - `numeric`: An integer value generated dynamically in accordance to the generation method defined.
  - `alphanumeric`: An alphanumeric string value generated dynamically in accordance to the generation method defined. 
  - `alpha`: An alphabetic string value generated dynamically in accordance to the generation method defined.
 
  > Note: The last 3 types above (`numeric`,`alphanumeric`,`alpha`) can be associated with 
  a `length` attribute. The length defaults to `4` when not specified.
  
  > Note: The last 3 types above (`numeric`,`alphanumeric`,`alpha`) can be associated with 
  minimum `min` and maximum `max` values for sequentially and randomly generated PSCIDs. 
  By default sequence will start at the lowest possible values (i.e.: 0000, AAAA).

## Interaction With LORIS

 The **PSCID** and **CandID** are used throughout LORIS including when uploading files and media linked to a candidate. The **CandID** is mainly used internally to link data across the database.

 The **PSCID** is dependent on the list of sites in the `psc` table of the database, more specifically the `Alias` column that is used for the `siteAbbrev` type in the generation of the ID. Please refer to the [Sites Parameter Setup](03 - Sites.md) page for more details.
 
  The **PSCID** is also dependent on the list of projects in the `Project` table of the database, more specifically the `Alias` column that is used for the `projectAbbrev` type in the generation of the ID. Please refer to the [Projects Parameter Setup](02 - Projects.md) page for more details.
