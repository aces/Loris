# PSCID (Project Study Center ID)

The PSCID is the main participant identifier in Loris. With one ID assigned to each participant per instance, it serves the purposes of this this this and this really needs to be clear and general, whatever it is I decide to write>

Both the construction and the generation of this ID are set in a configuration file called `config.xml`, a file which configures the system to generate the PSCID when a partipant is registered.

Let's look at the relevant section of the config.xml file:
```xml
<PSCID>
    <generation>sequential</generation> 
    <structure>
        <seq type="siteAbbrev"/>
        <seq type="numeric" length="4" min="10" max="9999"/>
    </structure>
</PSCID>
```

Let's now look briefly at just the following:
```xml
<generation>sequential</generation>
```

This ensures that the ID increments both in alphabetical or in numeric form.

- Ex:`XXX0010, XXX0011, XXX0012` or `XXXAAA`, `XXXAAB`, `XXXAAC`

In this case, the XXX is derived from entering `siteAbbrev`, which stands for Site Abbreviation. `siteAbbrev` tells the system to "pull" a value from a database table and insert it at the beginning of the ID.

This means that, if this value is `MTL`, our ID's would begin with 'MTL' and generate sequentially, for example: `MTL0010, MTL0011, MTL0012`

- Let's now look at the length, min, and max values

```xml
`<seq type="numeric" length="4" min="10" max="9999"/>`
```

- `min` and `max` values can be set for seq types: `numeric`,`alphanumeric`, and `alpha`.

This means that a PSCID could be `MTL0010` or `MTLAAAA`

- a minimum `alpha` selection where `length = 4` will yieled 'AAAA', a maximum would be 'ZZZZ'.

- a minimum `numeric` selection will yeild '0010' to a maximum of '9999'

These min and max settings set the bounds for the ID. 

## The `<generation>` element

The generation element works in tandem with the structure element to generate the actual ID's automatically. There are two automatic modes: 1. `sequential` and 2. `random`. The third mode, `user`, is not automatic: you enter each ID in manually.

```xml
<generation>sequential</generation>
```

This means that the numeric or alphabetical characters will be sequential.

- Example : `0010`, `0011`, `0012` to a maxumum of `9999`
- Example : `AAAA`, `AAAB`, `AAAC` to a maximum of `ZZZZ`

By default sequence will start at the lowest possible values (i.e.: 0000, AAAA)
The minimum "min" and maximum "max" values set the number at which the sequential generation begins. In our example, this will be a minimum of `MTL0010` and maximum of `MTL9999`.
```

- `projectAbbrev`: A string value drawn from the `Alias` field of the `Project` table
- `static`: A string value defined in the `config.xml` file.
- `numeric`: (default = 4) An integer value set by the generation method. Default = `4`.
- `alphanumeric`: (Default =4) An alphanumeric set by the generation method. Default = `4`.
- `alpha`: (Defualt = 4) An alphabetic string value set by the generation method.


### Manual Generation

<generation>user</generation>

- asks the user to enter the PSCID Manually when registering a new candidate, using either alphabet letters or numbers.

- Example : `A1`

### Random Generation

<generation>random</generation>

- Generates a static prefix followed by random numerical value for each new participant registered.

- Example: `PREFIX3994`, `PREFIX3233`, `PREFIX2222`
