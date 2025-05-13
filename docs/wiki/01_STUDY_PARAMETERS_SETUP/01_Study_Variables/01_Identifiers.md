# Identifiers

Table of Contents
- [ID Table](#id-table)
- [CandID](#CandID-Candidate-Identifier)
- [PSCID](#PSCID-Project-Study-Center-ID)
    1. [Sequential Generation](#Sequential-Generation)
    2. [Manual Generation](#Manual-Generation)
    3. [Random Generation](#Random-Generation)
- [External ID](#External-ID)

By default, each participant in a study is attributed 3 unique identifiers.

## ID Table

|Name|Example|Generation|Structure
|:--|:--|:--|:--|
|CandID|436792, 1349680403|Automatic|Random|
|PSCID|MTL0006, MTL0007|Manual or Automatic|Random or Sequential|
|ExternalID|xxxx25256265|Manual or Automatic| ??



## 1. CandID (Candidate Identifier)
- Purpose : For internal operations like linking data across the database.
- Cardinality? : One per participant per study.
- Can it be changed? : No. Once it is set, it is set.
- What database tables is it found in?  

|Table|Field|
|:--|:--|
|candidate|CandID||

Provide example of SQL query in both plain language and SQL and diagram






## 2. PSCID (Project Study Center ID)

- What is its purpose: This is the main participant identifier in Loris.
- What is its structure? A site abbreviation followed by digits. Examples: MTL0006, DDC0703, OTT2345
- How is it generated? : One of three ways:
    1. Sequentially
    2. Manually
    3. Randomly-generated
- What is its cardinality: One per participant per study.
- Can it be changed: ???
- What database table is it found in: `project` and `psc`
- Configuration: The format and generation options must be configured by an admin. 

### Sequential Generation

- Generates PSCIDs sequentially for each new candidate registered.
- **(This is the default)**

```xml
<PSCID>
    <generation>sequential</generation> 
    <structure>
        <seq type="siteAbbrev"/>
        <seq type="numeric" length="4" min="10" max="9999"/>
    </structure>
</PSCID>
``` 

- Example : `MTL1234`, `MTL1235`, `MTL1236`


### Manual Generation

- asks the user to enter the PSCID when registering a new candidate.

```xml
<PSCID> 
    <generation>user</generation> 
    <structure>
        <seq type="alphanumeric" length="2"/>
    </structure>
</PSCID>
```

- Example : `A1`

### Random Generation

- Generates a random numerical value for each new participant registered.

```xml
<PSCID>
    <generation>random</generation> 
    <structure>
        <seq type="static">PREFIX</seq>
        <seq type="numeric" length="4" min="1" max="9999"/>
    </structure>
</PSCID>
```

 - Example: `PREFIX3994`

## 3. ExternalID

- What is its purpose? : This is used for data-dissemination. It is de-identified from its site or project.
- What is its structure? : A project abbreviation followed by digits. Example: .
- How is it generated? : Manually or Automatically
- What is its cardinality? :
- What is its purpose :
- Can it be changed? :
- What database table is it found in:

- To create a new participant, navigate to the `Candidate` dropdown menu, click `New Profile`, enter your information, and hit `Create`. This action generates all 3 ID's, according to the configurations you set up.

The format and the generation of the **PSCID** and **ExternalID** must be configured by an admin by editing the `config.xml` file.

### Configuration from SQL

not yet available_

### Configuration from the config.xml file

The format and the generation of PSCIDs can be configured by an administrator in the `config.xml` file. These settings are applied to any and all new candidates.


 Options for the `type` element of the `<seq>` tag are:

  - `siteAbbrev`: A string value that will be used as a dynamic prefix. Value drawn from the `Alias` 
  field of the `psc` table in the database.
  - `projectAbbrev`: A string value that will be used as a dynamic prefix. Value drawn from the `Alias` 
  field of the `Project` table in the database.
  - `static`: A string value that will be used as a fixed prefix. Value defined in the `config.xml` file.
  - `numeric`: An integer value generated dynamically in accordance to the generation method defined.
  - `alphanumeric`: An alphanumeric string value generated dynamically in accordance to the generation method defined. 
  - `alpha`: An alphabetic string value generated dynamically in accordance to the generation method defined.

 **Note:** The last 3 types above (`numeric`,`alphanumeric`,`alpha`) can be associated with 
  a `length` attribute. The length defaults to `4` when not specified.
  
 **Note:** The last 3 types above (`numeric`,`alphanumeric`,`alpha`) can be associated with 
  minimum `min` and maximum `max` values for sequentially and randomly generated PSCIDs. 
  By default sequence will start at the lowest possible values (i.e.: 0000, AAAA).

## Interaction With LORIS

 The **PSCID** and **CandID** are used throughout LORIS including when uploading files and media linked to a candidate. The **CandID** is mainly used internally to link data across the database.

 The **PSCID** is dependent on the list of sites in the `psc` table of the database, more specifically the `Alias` column that is used for the `siteAbbrev` type in the generation of the ID. Please refer to the [Sites Parameter Setup](03_Sites.md) page for more details.
 
  The **PSCID** is also dependent on the list of projects in the `Project` table of the database, more specifically the `Alias` column that is used for the `projectAbbrev` type in the generation of the ID. Please refer to the [Projects Parameter Setup](02_Projects.md) page for more details.

