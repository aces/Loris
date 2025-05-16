# PSCID (Project Study Center ID)

The PSCID is the is the main participant identifier in Loris. With one ID assigned to each participant per project. It does this this and this and serves the purposes of this and this.

The configuration of PSCID's is designed to allow for flexible naming and generation. Both naming and generation are set in a configuration file called `config.xml`. The following table will help familiarize you with how these options generate different-looking PSCID's.

|generation|examples|options|
|:--|:--|:--|
|sequential|MTL0006, MTL0007, MTL0008|Generates a static prefix with incrementing numbers|
|manual|A1, B2, Q5|Generates a fixed-length alphanumeric pattern|
|random|BUDDY29, BUDDY02, BUDDY96|Generates a static prefix followed by a random number of fixed length| 


## Sequential Generation

- Sequential generation is the default setting in the `config.xml`

```xml
<PSCID>
    <generation>sequential</generation> 
    <structure>
        <seq type="siteAbbrev"/>
        <seq type="numeric" length="4" min="10" max="9999"/>
    </structure>
</PSCID>
```

 The Options for the `type` element of the `<seq>` tag are as follows:



- `siteAbbrev`: A string value drawn from the `Alias`
  field of the `psc` table in the database.
- `projectAbbrev`: A string value drawn from the `Alias` field of the `Project` table
- `static`: A string value defined in the `config.xml` file.
- `numeric`: An integer value generated dynamically in accordance to the generation method defined. Defualt = `4`.
- `alphanumeric`: An alphanumeric string value generated dynamically in accordance to the generation method defined. Default = `4`. 
- `alpha`: An alphabetic string value generated dynamically in accordance to the generation method defined. Default = `4`.

 **Note:** The last 3 types above (`numeric`,`alphanumeric`,`alpha`) can be associated with 
  minimum `min` and maximum `max` values for sequentially and randomly generated PSCIDs. 
  By default sequence will start at the lowest possible values (i.e.: 0000, AAAA).


## Manual Generation

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