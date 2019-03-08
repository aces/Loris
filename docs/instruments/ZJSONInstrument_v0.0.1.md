# Z-JSON Instrument Specification

This documentation describes and explains the Z-JSON Instrument. It is supported by a template and an example, both
of which can be found in the same directory.

The Z-JSON Instrument is the JSON representation of a scientific instrument. Describing an instrument as a JSON object
will allow the instrument to be language-independent, human readable, and shareable across different platforms. This
schema was built with the intention to be easily mappable to both the [ReproNim JSON-LD Form Schema](https://github.com/ReproNim/schema-standardization) and [NDAR's Data Dictionary Structure](https://ndar.nih.gov/data_dictionary.html) via converters.

# 0.0: Contents

- [1.0: Introduction](#10-introduction)
- [2.0: Schema Overview](#20-schema-overview)
- [3.0: Field Elements](#30-field-elements)
- [4.0: Helper Elements](#40-helper-elements)
- [5.0: UI Properties](#50-ui-properties)

# 1.0: Introduction

The Z-JSON Instrument is comprised of four components: the core schema, an accompanying UI configuration, the
instrument data, and a list of metadata fields.

```js
{
    "data" : {
        ...
    },
    "schema" : {
        ...
    },
    "ui" : {
        ...
    },
    "metaDataFields" : {
        ...
    }
}
```
The core `schema` describes the instrument's data structure and format, while the `ui` component defines front-end
properties. Both the schema and the UI component are required in order for the instrument to be ready for front-end
rendering. These components can be defined either within the same JSON object or independently. This is also true
for the `data` and the `metaDataFields` components which can be added to the same JSON object for a self-contained package.

The `data` component is a JSON object of clinical data collected by the instrument. Once the instrument is
administered, the data collected will be stored in this data component. The instrument data is, however, handled
separately. The `metaDataFields` component is a JSON object of metadata fields to be prepended to the objects defined in
`schema` if the `schema.meta.includeMetaDataFields` key is set to true.

# 2.0: Schema Overview

The core schema is a JSON object consisting of 4 keys: meta, fields, helpers, and setup.

```js
{
    "schema" : {
        "fields" : {
            "nameOfField" : {

            },
            ...
        },
        "helpers" : {
            "nameOfHelper" : {

            },
            ...
        },
        "meta" : {
            ...
        },
        "setup"  : [
            ...
        ]
    },      
    ...
}
```
The `meta` key contains metadata for the instrument, while the `fields` and `helpers` keys contain JSON objects of data
fields and layout elements that make up the instrument. Since JSON objects' key ordering cannot be relied upon, the 
`setup` key points to an array of ordered page objects. This key defines the page structure of the instrument as well as
the order in which the field or helper elements are rendered. The value of these keys are described in more detail below.

Note: All keys in the Z-JSON Instrument follow the lowerCamelCase naming convention.

## 2.1: Instrument Metadata

```js
{
    "schema" : {
        ...
        "meta" : {
            "createdBy": string,
            "createdWith": string,
            "dateCreatedOn": string,
            "dateLastUpdateOn": string,
            "defaultLanguage": string,
            "derivedFrom": string,
            "importedFrom": string,
            "includeMetaDataFields": boolean,
            "instrumentVersion": string,
            "longName": {
                "languageTag1": string,
                "languageTag2": string,
                ...
            },
            "previousVersion": string,
            "schemaVersion": string,
            "shortName": string,
            "versionHash": string
        },
        ...
    },
    ...
}
```

The metadata object contains information such as the version of the instrument, its name, its description, and some
provenance data. The value of each key is defined as such:

`meta.createdBy`: String. The developer or user responsible for creating the Z-JSON Instrument.

`meta.createdWith`: String. The software or tool responsible for the creation of the ZJSON Instrument, i.e. the Instrument Builder module or some conversion script.

`meta.dateCreatedOn`: String. The date of creation of the Z-JSON Instrument in the format 'YYYY-MM-DD'. Each new version of
an instrument will have a new `dateCreatedOn` date.

Small changes, such as bug fixes, that do not require the creation of a new version of an instrument should instead use 
`meta.dateLastUpdateOn` to track updates.
                 
`meta.dateLastUpdateOn`: String. The date at which small modifications that do not justify creating a new version, such as
bug fixes, was last made. It follows the format 'YYYY-MM-DD'.
                          
`meta.defaultLanguage`: Required String. The default (human communication) language of the instrument, represented by an
IETF BCP 47 (RFC 5646 Standard) language tag, e.g. "en-CA".

It is important to set the default language as it is used as a key in other locations of the `schema` object.

`meta.derivedFrom`: String. The resource instrument that the Z-JSON Instrument derived from as a result of significant
content modification such that the instrument is no longer the same instrument and the creation of a new version does
not suffice.

What is considered significant here is not defined in this specification, but is instead up to the author to decide. This
level of modification does not include format transcription, i.e. linst to JSON, unless the content of the instrument has
also been modified. The `meta.importedFrom` key should be used in the case of conversions.

`meta.importedFrom`: String. The resource instrument that this Z-JSON Instrument was converted from, if it was imported
from another format and is otherwise unmodified.

If any modifications to the content of the instrument are made after conversion, this value should be empty and 
`meta.derivedFrom` used instead. If the Z-JSON instrument is an original instrument, the value of this key is empty.

`meta.includeMetaDataFields`: Required boolean. True or false that the Z-JSON Instrument will include metadata fields,
such as 'Candidate Age' and 'Examiner', which calculates the candidate's age and selects the examiner
administering the instrument, respectively.

`meta.instrumentVersion`: Required string. The semantic version of the instrument being described.

It follows some meaningful convention as determined by the author of the instrument. It is self-contained and interpreted
independently of the instrument's `shortName` or `longName`.

`meta.longName`: Required object with IETF BCP 47 language tags as keys. The value of each key will be the long, human
readable version of the instrument's name (its title) provided in every language that the instrument comes in.

    The keys of all objects that provide multilingual values are to be defined by the same set of language tags. If the keys of these objects do not match, there will be errors on rendering.

`meta.previousVersion`: String. The previous version of the Z-JSON Instrument, if significant changes were made to
justify creating a new version of the instrument.

This is helpful in showing the lineage of existing instruments. If changes to
an instrument are so significant that there is no longer a shared lineage, `meta.derivedFrom` would instead be used to track
changes. 

`meta.schemaVersion`: Required string. The version of this Z-JSON Instrument Specification document that the instrument
complies with.

It follows the format of v*SpecVersion*-dev, i.e. `v0.0.1-dev` if following this current version.

`meta.shortName`: Required string. The unique name and identifier of the instrument, as well as the test name in the database.

The name of the Z-JSON Instrument JSON file will follow the format *shortName_instrumentVersion.json*.

`meta.versionHash`: Required string. The unique hash auto-generated by the instrument builder or conversion script.

## 2.2: Page Setup

The `setup` key contains an array of objects that each represent a page of an instrument.

```js
{
    "schema" : {
        ...
        "setup" : [
            {
                "name" : string,
                "type" : "page",
                "description" : {
                    "languageTag1" : string,
                    "languageTag2" : string,
                        ...
                }
                "order": [
                  "nameOfField",
                      ...
                ]
            }
        ]
    }
}
```

Each page object has the following keys:

`setup.name`: String. The name and ID of the page object.

`setup.type`: Required string with value "page".

`setup.description`: Required object with IETF BCP 47 language tags as keys. The value of each key is a string that is the
human readable label or title of the page, provided in every available language. It will be rendered on the front-end as a
link to the page and is encoded in UTF-8.

`setup.order`: Required array. An ordered list of strings that are the keys to objects previously defined in `fields` or 
`helpers`. The order in which they are listed will be the order in which they will appear on the rendered instrument.

# 3.0: Field Elements

An instrument "field" represents a variable to which the instrument will insert some clinical data via a front-end input
element. The `fields` component here describes the data structure of these instrument fields and provides a way to
validate the data that is collected. It is here that the field's type, choice of values, and rules are defined.

While it is natural to think of these instrument fields as front-end input elements, they are not. The front-end
representation of these fields are only defined later within the `ui` component. 

Each type of field may contain type specific options. These options will be broken down and described in the section
[3.2: Field Types](#32-field-types) below. In general, a field object has the following format:

```js
{
    "nameOfField" : {
        "type": string,
        "description": {
            "languageTag1": string,
            "languageTag2": string,
                ...
        },
        "options": {
            ...
        },
        "rules": {
            "requireIf": string, /* LORIS Logic Parser formula */
            "hideIf": string, /* LORIS Logic Parser formula */
            "disableIf": string, /* LORIS Logic Parser formula */
        }
      }
}
```

A field object has a unique key that is its identifier (ID) and name. The ID will also be used as an identifier for a
database column or a front-end element. Within the field object, there are four required keys: type, description, options, and rules.

`type`: Required string. It represents the field's data type, i.e. int, string, boolean, etc.

This will be the data type of the field's value within the `data` component upon collection:

```js
{
    "data" : {
        "nameOfField" : `schema.fields.nameOfField.type`
    }
}
```

`description`: Required object with IETF BCP 47 language tags as keys. The value of each key is a string that is the
human readable description of this field, provided in every available language. It may be rendered on the front-end as a
question, label or text. It is encoded in UTF-8.

`options`: Required object of type-specific keys. It contains the type-dependent options for this field, further
described in section [3.2: Field Types](#32-field-types).

`rules`: Required object with keys whose value may be an empty string.

## 3.1: Rules

The `rules` object contains three rules for validation and display: requireIf, hideIf, and disableIf. These rules make up 
the branching logic of the instrument and can be used to enforce dependencies between fields.

```js
{
    "schema" : {
        ...
        "fields" : {
            "nameOfField" : {
                ...
                "rules": {
                    "requireIf": string, /* LORIS Logic Parser formula */
                    "hideIf": string, /* LORIS Logic Parser formula */
                    "disableIf": string, /* LORIS Logic Parser formula */
                }
        ...
}
```

The value of these keys are string expressions of logical formulas defined by the [LORIS Logic Parser Syntax](https://github.com/aces/Loris/blob/minor/docs/instruments/LogicParserSyntax.md).
When calculated by the Evaluator function of the LORIS Logic Parser, these formulas evaluate to true or false. They will often
be dependent on data collected by neighbouring fields which are passed into the formula as argument variables.

`rules.requireIf`: String. True or false that the field requires data input, given the condition in the string expression. If 
empty, the default is true.

If the field's `options.requireResponse` value is true, the field will be accompanied by a "Not Answered" option field. This
allows explicit non-answering while still requiring some input values in order to distinguish empty data from data that was
intentionally omitted. In this case, the field's `rules.requireIf` formula will be dependent on the "Not Answered" option
field, and vice versa.

`rules.hideIf`: String. True or false that the field is not displayed in the instrument, given the condition in the string
expression. If empty, the default is false.

`rules.disableIf`: String. True or false that the field is disabled, i.e. not editable nor submittable, given the condition in
the string expression. If empty, the default is false.

### 3.1.1. Intersection

The boolean results of `hideIf` and `disableIf` do not conflict with one another. Any combination of true or false for these
two rules can exist. However, only certain combinations are allowed when the `requireIf` rule intersects with `hideIf` and 
`disableIf`. The possible combination of results are as follows:

#### requireIf vs. hideIf

|           |       |    hideIf    |
|-----------|-------|--------------|
|           |       | True | False |
|-----------|-------|---- -|-------|
| requireIf | True  |  ✗   |   ✓   |
|           | False |  ✓   |   ✓   |

#### requireIf vs. disableIf

|           |       |  disableIf   |
|-----------|-------|--------------|
|           |       | True | False |
|-----------|-------|---- -|-------|
| requireIf | True  |  ✗   |   ✓   |
|           | False |  ✓   |   ✓   |

## 3.2: Field types

There are nine different field types: enum, string, int, decimal, date, time, datetime, boolean, and score. Each type 
of `fields` object has specific `options` defined.


### 3.2.1: Enum

An enum type is a field whose data can be chosen from a list of values. This type of field can be rendered on the front-
end as a select element, radio buttons, or a multiselect element if `options.allowMultipleValues` is set to true.

```js
{
    "nameOfField" : {
        "type": "enum",
        "description": {
            ...
        },
        "options": {
            "values" : [
                {
                    "description" : {
                        "languageTag1": string,
                        "languageTag2": string
                    },
                    "value" : string
                },
                ...
            ],
            "allowMultipleValues": boolean,
            "requireResponse": boolean,
            "readonly": boolean,
            "hideInSurvey" : boolean,
            "showDesc" : boolean
        },
        "rules": {
            ...
        }
    }
}
```

`options.values`: Required array of JSON objects that specify the ordered list of choices that the data is to be selected from. These objects have a `description` and a `value` key:

    `description`: Required object with IETF BCP 47 language tags as keys. The value of each key is a string that describes the choice value in human friendly text, and in every available language. It is encoded in UTF-8.

    `value`: Required string of the choice. The value is set as a string to allow for string key values such as 'dont_know'.

`options.allowMultipleValues`: Required boolean. True if multiple values may be selected at once. False if only
one value may be selected.

`options.requireResponse`: Required Boolean. True or false that an input is required. 

If true, an implementation automatically adds this field to a `group` helper type accompanied by a "Not Answered" option,
e.g. rendered as a checkbox. This allows explicit non-answering while still requiring some input value in order to
distinguish empty data from data that was intentionally omitted. This choice is added here instead of in `options.values` 
to allow for consistency with other field types. 

`options.readonly`: Required boolean. True or false that the field is read-only, i.e. not editable on the front-end but
submittable on save. This key is different to `rules.disableIf` in that it is not dependent on a condition, and a
'disabled' field is not submittable.

`options.hideInSurvey`: Required boolean. True or false that this field will be hidden and not displayed when the
instrument is in survey mode.

### 3.2.2: String

A string field takes in a string as data input, either via a text element or a text area element.
The format is as follows:

```js
{
    "nameOfField" : {
        "type": "string",
        "description": {
            ...
        },
        "options": {
            "regex" : string,
            "requireResponse": boolean,
            "readonly": boolean,
            "hideInSurvey" : boolean,
            "showDesc" : boolean
        },
        "rules": {
            ...
        }
    }
}
```

`options.regex`: String.
                 A regex that the field's data must conform to. If not defined, no rules are
                 enforced.

`options.requireResponse`: Required boolean. True or false that an input is required.

If true, an implementation automatically adds this field to a `group` helper type accompanied by a "Not Answered" option,
e.g. rendered as a checkbox. This allows explicit non-answering while still requiring some input value in order to
distinguish empty data from data that was intentionally omitted.

`options.readonly`: Required boolean. True or false that the field is read-only, i.e. not editable on the front-end but
submittable on save. This key is different to `rules.disableIf` in that it is not dependent on a condition, and a
'disabled' field is not submittable.

`options.hideInSurvey`: Required boolean. True or false that this field will be hidden and not displayed when the
instrument is in survey mode.

### 3.2.3: Numeric - Int and Decimal

A numeric field takes an int or a decimal as data input. It has the form:

```js
{
    "nameOfField" : {
        "type": "integer" OR "decimal",
        "description" : {
            ...
        },
        "options": {
            "minValue" : `nameOfField.type`,
            "maxValue" : `nameOfField.type`, 
            "requireResponse" : boolean,
            "readonly": boolean,
            "hideInSurvey" : boolean,
            "showDesc" : boolean
        },
        "rules": {
            ...
        }
    }
}
```

`options.minValue`: Integer or decimal, depending on `nameOfField.type`.
                    A number representing the minimum value that the data can be.

`options.maxValue`: Integer or decimal, depending on `nameOfField.type`.
                    A number greater than or equal to `options.minValue` representing the maximum
                    value that the data can be.

`options.requireResponse`: Required boolean. True or false that an input is required.

If true, an implementation automatically adds this field to a `group` helper type accompanied by a "Not Answered" option,
e.g. rendered as a checkbox. This allows explicit non-answering while still requiring some input value in order to
distinguish empty data from data that was intentionally omitted.

`options.readonly`: Required boolean. True or false that the field is read-only, i.e. not editable on the front-end but
submittable on save. This key is different to `rules.disableIf` in that it is not dependent on a condition, and a
'disabled' field is not submittable.

`options.hideInSurvey`: Required boolean. True or false that this field will be hidden and not displayed when the
instrument is in survey mode.

### 3.2.4: Date, Time and Datetime

A date field takes a data type of form "YYYY-MM-DD". A time field takes a data type of form "HH:MM:SS". A datetime field takes
a data type of form "YYYY-MM-DD HH:MM:SS". The general format is as follows:

```js
{
    "nameOfField" : {
        "type": "date" OR "time" OR "datetime",
        "description" : {
            ...
        },
        "options": {
            "minValue" : `nameOfField.type`,
            "maxValue" : `nameOfField.type`, 
            "requireResponse" : boolean,
            "readonly" : boolean,
            "hideInSurvey" : boolean,
            "showDesc" : boolean
        },
        "rules": {
            ...
        }
    } 
}
```

`options.minValue`: Date, time or datetime, depending on `nameOfField.type`.
                    The earliest date, time or datetime the data can be.

`options.maxValue`: Date, time or datetime, depending on `nameOfField.type`.
                    The latest date, time or datetime the data can be.

`options.requireResponse`: Required Boolean. True or false that an input is required.

If true, an implementation automatically adds this field to a `group` helper type accompanied by a "Not Answered" option,
e.g. rendered as a checkbox. This allows explicit non-answering while still requiring some input value in order to
distinguish empty data from data that was intentionally omitted.

`options.readonly`: Required boolean. True or false that the field is read-only, i.e. not editable on the front-end but
submittable on save. This key is different to `rules.disableIf` in that it is not dependent on a condition, and a
'disabled' field is not submittable.

`options.hideInSurvey`: Required boolean. True or false that this field will be hidden and not displayed when the
instrument is in survey mode.

### 3.2.5: Boolean

A boolean field can have data as true or false, if rendered by a checkbox element.

```js
{
    "nameOfField" : {
        "type": "boolean",
        "description" : {
            ...
        },
        "options": {
            "requireResponse" : boolean,
            "readonly" : boolean,
            "hideInSurvey" : boolean,
            "showDesc" : boolean
        },
        "rules": {
            ...
        }
    } 
}
```

`options.requireResponse`: Required boolean. True or false that an input is required.

If true, an implementation automatically adds this field to a `group` helper type accompanied by a "Not Answered" option,
e.g. rendered as a checkbox. This allows explicit non-answering while still requiring some input value in order to
distinguish empty data from data that was intentionally omitted.

`options.readonly`: Required boolean. True or false that the field is read-only, i.e. not editable on the front-end but
submittable on save. This key is different to `rules.disableIf` in that it is not dependent on a condition, and a
'disabled' field is not submittable.

`options.hideInSurvey`: Required boolean. True or false that this field will be hidden and not displayed when the
instrument is in survey mode.

### 3.2.6: Score

A score field is a placeholder whose values are based on the other fields' data. A score field is not represented on the 
front-end by an input element. Its value is instead calculated from a string expression containing a logical formula that is 
evaluated by the LORIS Logic Parser.

```js
{
    "nameOfField" : {
        "type": "score",
        "description" : {
            ...
        },
        "options": {
            "scoringFormula" : string,  /* LORIS Logic Parser formula */
            "readonly" : boolean,
            "hideInSurvey" : boolean,
            "showDesc" : boolean
        },
        "rules": {
            ...
        }
    } 
}
```
`options.scoringFormula`: Required string. An expression of a logical formula to be calculated by the Logic Parser. The formula is evaluated to true or false if a boolean score, or a numeric if a number score. The result is dependent and defined by the value of this key.

`options.readonly`: Required boolean. True or false that the field is read-only, i.e. not editable on the front-end but
submittable on save. This key is different to `rules.disableIf` in that it is not dependent on a condition, and a
'disabled' field is not submittable.

`options.hideInSurvey`: Required boolean. True or false that this field will be hidden and not displayed when the
instrument is in survey mode.

# 4.0: Helper Elements

A helper object represents a non-input, layout-related front-end element. While instrument `fields` have corresponding `data`
associated with it upon form submission, a `helper` is rendered on the front-end as an integral element that does not collect
data. There are five types of helpers: the static text element, and four other layout-specific formatting elements (group,
row, table, and section).

The four layout-specific types have references to its children (a collection of `fields` or static text elements) and contain
type specific options. The different types and their options are described in the section [4.0: Helper Types](#4.0:-helper-types) below. 

In general, a helper object has the same format as a field:

```js
{
    "nameOfHelper" : {
        "type": string,
        "description": {
            "languageTag1": string,
            "languageTag2": string
        },
        "options": {
            ...
        },
        "rules": {
            "requireIf": string, /* LORIS Logic Parser formula */
            "hideIf": string, /* LORIS Logic Parser formula */
            "disableIf": string, /* LORIS Logic Parser formula */
        }
    } 
}
```

`type`: Required string.
        It represents the helper's data type, i.e. statictext, section, table, etc.

`description`: Required object with IETF BCP 47 language tags as keys. The value of each key is a string that is the human
readable description of this helper, provided in every available language. It is the text to be displayed in the instrument
and is encoded in UTF-8.

It may be rendered on the front-end as a header, depending on the helper type, i.e. this will be the
content of the statictext helper itself, the header of the section helper, or column header for the table.

`options`: Required object of type-specific keys. It contains the type-dependent options for this helper, further described 
in section [4.2: Helper Types](#4.2:-helper-types).

`rules`: Required object with keys whose value may be an empty string as described for `fields`.

The `rules` for groups, rows, tables, and sections propagate down to the `rules` of its children.

## 4.1: Rules

The `rules` of helper elements interact with the rules of its children. When evaluated, they will be appended together with a 
logical operator. Depending on the rule, either an AND or an OR logic is followed to evaluate the final rule for the child.

### 4.1.1 RequireIf

Default: True. Interaction: AND. An AND operation allows the parent's false case to take precedence.

|             |       |       Child (requireIf)       |
|-------------|-------|-------------------------------|
|             |       |     True      |     False     |
|-------------|-------|---------------|---------------|
|   Helper    | True  |    Require    | Don't require |
| (requireIf) | False | Don't require | Don't require |

### 4.1.2 HideIf

Default: False. Interaction: OR. An OR operation allows the parent's true case to take precedence.

|           |        |  Child (hideIf)   |
|-----------|--------|-------------------|
|           |        | True |   False    |
|-----------|--------|------|------------|
|   Helper  |  True  | Hide |    Hide    |
|  (hideIf) |  False | Hide | Don't hide |

### 4.1.3 DisableIf

Default: False. Interaction: OR. An OR operation allows the parent's true case to take precedence.

|              |        |    Child (disableIf)    |
|--------------|--------|-------------------------|
|              |        |  True   |     False     |
|--------------|--------|---------|---------------|
|    Helper    |  True  | Disable |    Disable    |
|  (disableIf) |  False | Disable | Don't disable |

## 4.2: Helper Types

### 4.2.1: Static Text

A `helper` of type "statictext" represents headings, sub-headings, labels, or informational text that is required in
an instrument. These can be rendered on the front-end as a header, static, or link element.
Static helpers are some text displayed to provide information and without an accompanying data input.

Static helpers do not have an `options` key and only have the `hideIf` rule.

```js
{
    "nameOfHelper" : {
        "type": "statictext",
        "description": {
            ...
        },
        "rules": {
          "hideIf": string, /* LORIS Logic Parser formula */
        }
    } 
}
```

### 4.2.2: Group

A helper of type "group" denotes a horizontal collection of elements which should be displayed
together and is separated by a delimiter. Groups have the following form:

```js
{
    "nameOfHelper" : {
        "type": "group",
        "description": {
            ...
        },
        "options": {
            "order": [
                string,
                string,
                ...
            ],
            "readonly": boolean,
            "hideInSurvey": boolean,
            "showDesc" : boolean
        },
        "rules": {
            ...
        }
    } 
}
```

`options.order`: Required array of strings.
                 An array of the names of `fields` or `helpers`, in order, that are to be formatted
                 within this group. It may contain any field, but only helpers of the type "statictext".
 
### 4.2.3: Row

A helper of type "row" denotes a row in a table. If rows are not in a table, they should be rendered
as a "group" helper.

```js
{
    "nameOfHelper" : {
        "type": "row",
        "description": {
            ...
        },
        "options": {
            "order": [
                string,
                string,
                ...
            ],
            "showDesc" : boolean
        },
        "rules": {
            ...
        }
    } 
}
```

`options.order`: Required array of strings.
                 An array of the names of `fields` or `helpers`, in order, that are to be
                 formatted within the row. It may contain any field, but only helpers of the type "statictext" and "group".

The size of this array must equal the `options.colSize` value of the table to which the row belongs.

### 4.2.4: Table

A helper of type "table" denotes a list of "row" helpers that are displayed together in a tabular
form.

A table contains only "row" helpers whose `options.order` array must be of the same size.

```js
{
    "nameOfHelper" : {
        "type": "table",
        "description": {
            ...
        },
        "options": {
            "colSize" : int,
            "rowSize" : int,
            "order": [
                string,
                string,
                ...
            ],
            "showColHeaders" : boolean,
            "showDesc" : boolean,
            "showAsFooter": boolean,
        },
        "rules": {
            ...
        }
    } 
}
```
`options.colSize` : Required int.
                    The number of columns in the table. 

`options.rowSize` : Required int.
                    The number of rows in the table.

`options.order`: Required array of strings.
                 An array of the names of `row` helpers, in order, that are to be formatted
                 within this table.

The size of this array must equal `options.rowSize`.

At each index (or column) of every "row" element, the `helper` or `field` that is
referenced inside that index has to have its `description` match. This description
will be rendered as the column header if `options.showColHeaders` is true.

The only exception is that a "statictext" helper will never have a corresponding header, 
as its `description` is the static text itself. A column of static text elements can have
an empty column header. This is true for only static text elements.

`options.showColHeaders`: Required boolean.
                          True or false that the table's column headers will be displayed as taken
                          from each column's fields' matching `description`.

`options.showDesc`: Required boolean.
                    True or false that the table's `description` is displayed.

`options.showAsFooter`: Required boolean.
                        True or false that the description is displayed as a footer, instead of a
                        header.

### 4.2.5: Section

A helper of type "section" is a vertical grouping of elements whose `rules` are propogated to the rules of its children.

```js
{
    "nameOfHelper" : {
        "type": "section",
        "description": {
            ...
        },
        "options": {
            "order": [
                string,
                string,
                ...
            ],
            "showDesc" : boolean
        },
        "rules": {
            ...
        }
    } 
}
```

`options.order`: Required array of strings. An array of the names of `fields` or `helpers`, in order, that are to be
                 formatted within this group. It may contain any field, but only helpers of the type "statictext".

`options.showDesc`: Required boolean. True or false that the section's `description` is displayed as the header for
                    section of elements.

An implementation could choose to set this key to false, and display an independent "statictext" helper as a header instead.
 
# 5.0: UI Properties

The UI component of the Z-JSON Instrument contains information on how we render our `fields` and `helpers` objects
on the front-end. It is composed of JSON objects whose keys match those of the field or helper object it is describing.
This component should only make decisions on which front-end element those objects get rendered as and
nothing else. It may also provide additional UI properties that assist in the rendering.

The UI component object has the following general format:

```js
{
    ...
    "ui" : {
        "nameOfFieldOrHelper" : {
            "type": string,
            "options": {
                ...
            },
        },
        ...
    }
}
```

A UI object type may or may not have type-specific `options` that configure the rendering of the front-end element.

## 5.1 UI Types

For fields:

- [checkbox](#511-checkbox-element)
- [date](#512-date-element)
- [number](#513-numeric-element)
- [radio](#514-radio-button-element)
- [select](#515-select-element)
- [text](#516-text-element)
- [textarea](#517-textarea-element)
- [time](#518-time-element)

For helpers:

- [header](#519-header-element)
- [link](#5110-link-element)
- [static](#5111-static-element)

### 5.1.1 Checkbox Element

A square box that is ticked or unticked on user input. The box is checked (ticked) when activated by selection.

```js
{
    "nameOfField" : {
        "type" : "checkbox"
    }
}
```

### 5.1.2 Date Element

An input element for entering a date via a text box or a date picker interface. It collects a value in the format 'YYYY-MM-DD'
which includes the year, month, and day. 

```js
{
    "nameOfField" : {
        "type" : "date"
    } 
}
```

### 5.1.3 Numeric Element

An input element for entering a number with built-in validation that rejects non-numerical values.

```js
{
    "nameOfField" : {
        "type" : "number"
    } 
}
```

### 5.1.4 Radio Button Element

A collection of radio buttons rendered as small circles and used as a "radio group". They describe a set of options of which
only one can be selected as input value. The radio button is activated, or highlighted, on selection.

```js
{
    "nameOfField" : {
        "type" : "radio",
        "options" : {
            "vertical" : boolean
        }
    }
}
```

`options.vertical`: Boolean. True or false that the radio group is rendered vertically. The default value is false, i.e. 
rendered horizontally. 

### 5.1.5 Select Element

A drop-down list of options of which one or more can be selected as input value.

```js
{
    "nameOfField" : {
        "type" : "select",
        "options" : {
            "showEmptyOption" : boolean
        }
    }
}
```

`options.showEmptyOption`: Boolean. True or false that an empty option is available for selection.

### 5.1.6 Text Element

A single-line input element for entering text, with a restricted default width.


```js
{
    "nameOfField" : {
        "type" : "text",
        "options": {
            "placeholder": string
        }
    }
}
```

`options.placeholder`: String. Text that is rendered inside the text element as a placeholder before user input.

### 5.1.7 Textarea Element

A multi-line input element for entering text that can hold an unlimited number of characters.

```js
{
    "nameOfField" : {
        "type" : "textarea",
        "options": {
            "placeholder": string
        }
    }
}
```

`options.placeholder`: String. Text that is rendered inside the text element as a placeholder before user input.

### 5.1.8 Time Element 

An input element for entering a time via a text box or a time picker interface. It collects a value in the format
'HH:MM:SS' which includes the hour, minute, and second. 


```js
{
    "nameOfField" : {
        "type" : "time"
    }
}
```

### 5.1.9 Header Element

A section heading whose importance is defined by its `level`. A header element renders a "statictext" `helper` that should be
displayed with some level of prominence.

```js
{
    "nameOfHelper" : {
        "type" : "header",
        "options": {
            "level": int
        }
    }
}
```

`options.level`: Int. The number indicating the level of the front-end heading element to be rendered, i.e. 1, the highest
and most prominent, and 6, the lowest and reserved for subheadings, for easy mapping to HTML.

### 5.1.10 Link Element

A rendered element that creates a hyperlink to a specified URL destination.

```js
{
    "nameOfHelper" : {
        "type" : "link",
        "options": {
            "url" : string
        }
    }
}
```

`options.url`: Required string. The url to which the link element navigates on click.

### 5.1.11 Static Element

A static rendering of text such as a label or paragraph.

```js
{
    "nameOfHelper" : {
        "type" : "static"
    }
}
```
