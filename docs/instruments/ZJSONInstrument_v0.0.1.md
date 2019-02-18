# Z-JSON Instrument Specification

This documentation describes and explains the Z-JSON Instrument. It is supported by a template and an example,
both of which can be found in the same directory.

The Z-JSON Instrument is the JSON representation of a LORIS instrument. Describing an instrument as a JSON
object will allow the instrument to be language-independent, human readable, and shareable across different
platforms. This schema was built
to be interoperable with both the [ReproNim JSON-LD Form Schema](https://github.com/ReproNim/schema-standardization)
and [NDAR](https://ndar.nih.gov/data_dictionary.html).

# 0.0: Contents

- [1.0: Introduction](#10-introduction)
- [2.0: Schema Overview](#20-schema-overview)
- [3.0: Field Elements](#30-field-elements)
- [4.0: Helper Elements](#40-helper-elements)
- [5.0: UI Properties](#50-ui-properties)

# 1.0: Introduction

The Z-JSON Instrument is comprised of 3 components: the core schema, an accompanying UI configuration, and the
instrument data.

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
    }
}
```
The instrument data component is a JSON object of clinical data collected by the instrument. Once the instrument is administered, the data collected will be stored in this data component. The instrument data is, however, handled separately.

The core schema describes the instrument's data structure and format, while the UI component defines
front-end properties. Both the schema and the UI component are required in order for the instrument to be ready for front-end rendering. These components can be defined either within the same JSON object, or independently. This is
also true for the instrument data component which can be added to the same JSON object for a self-contained package.

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
The `meta` key contains metadata for the instrument, while the `fields` and `helpers` keys contain JSON
objects of data fields and layout elements that make up the instrument. Since JSON objects' key ordering cannot be relied upon, the `setup` key points to an array of ordered page objects. This key defines the page structure of the
instrument as well as the order in which the field or helper elements are rendered. The value of these keys are
described in more detail below.

All keys in the Z-JSON Instrument follow the lowerCamelCase naming convention.

## 2.1: Instrument Metadata

```js
{
    "schema" : {
        ...
        "meta" : {
            "createdBy": string,
            "createdOn": string,
            "createdWith": string,
            "defaultLanguage": string,
            "derivedFrom": string,
            "importedFrom": string,
            "includeMetaDataFields": boolean,
            "instrumentVersion": string,
            "lastUpdateOn": string,
            "longName": {
                "languageTag1": string,
                "languageTag2": string,
                ...
            },
            "previousVersion": string,
            "schemaVersion": string,
            "shortName": string
        },
        ...
    },
    ...
}
```

The metadata object contains information such as the version of the instrument, its name, its description, and
some provenance data. The value of each key is defined as such:

`meta.createdBy`: String.

The developer or user responsible for creating the Z-JSON Instrument.

`meta.createdOn`: String.

The date of creation of the Z-JSON Instrument in the format 'YYYY-MM-DD'. Each new version of an instrument will have a new `createdOn` date. Small
changes, such as bug fixes, that do not require the creation of a new version of an instrument should use `meta.lastUpdateOn`
instead to track updates.
                 
`meta.createdWith`: String.

The software or tool responsible for the creation of the ZJSON Instrument i.e. the Instrument Builder module or some conversion script.

`meta.defaultLanguage`: Required String.
                        
The default (human communication) language of the instrument, represented by an IETF BCP 47 (RFC 5646 Standard) language tag e.g. "en-CA".
It is important to set the default language as it is used as a key in other locations of the `schema` object.

`meta.derivedFrom`: String.
                    
The resource instrument that the Z-JSON Instrument derived from as a result of significant content modification such that the instrument is no longer the same                    
instrument, and the creation of a new version does not suffice. What is considered significant here is not defined in this specification, but is instead up to the author to decide.
                    
This level of modification does not include format transcription i.e. linst to
JSON, unless the content of the instrument has also been modified. The
`meta.importedFrom` key should be used in the case of conversions.

`meta.importedFrom`: String.

The resource instrument that this Z-JSON Instrument was converted from, if it was imported from another format and is otherwise unmodified. If any modifications to the content of the instrument are made after conversion, this value should be empty and `meta.derivedFrom` used instead.

If the Z-JSON instrument is an original instrument, the value of this key is empty.

`meta.includeMetaDataFields`: Boolean. 

True of false that the Z-JSON Instrument will include LORIS-specific
metadata fields, such as 'Candidate Age', or 'Examiner', which
calculates the candidate's age, and selects the examiner
administering the instrument, respectively.  

`meta.instrumentVersion`: Required string.

The version of the instrument being described.

It follows some convention as determined by the author of the instrument,
starting with some representation of the number 1 and incrementing itself alongside any changes made to the `schema` object. It is self-contained and
interpreted independently of the instrument's `shortName` or `longName`.

`meta.lastUpdateOn`: String.

The date at which small modifications, such as bug fixes, that do not justify
a new version be created, was last made.
                          
`meta.longName`: Required object with IETF BCP 47 language tags as keys.

The value of each key will be the long, human readable version of the instrument's name
- its title - provided in every language that the instrument comes in.

`meta.previousVersion`: String.

The previous version of the Z-JSON Instrument, if significant changes
were made to justify creating this new version of the instrument.

This may be redundant metadata but it may also be helpful in showing the
lineage of existing instruments. If changes to an instrument is so
significant that they no longer share the same lineage, `meta.derivedFrom`
would be used to track changes. 

`meta.schemaVersion`: Required string.

The version of this Z-JSON Instrument Specification document that the
instrument complies with. It follows the format of v*SpecVersion*-dev i.e. `v0.0.1-dev` if following this
current version.

`meta.shortName`: Required string.

The unique name and identifier of the instrument, also the test name in the
database.

The name of the Z-JSON Instrument JSON file will follow the format *shortName_instrumentVersion*.

## 2.2: Page Setup

The `setup` key contains an array of objects that each represent a page (or LORIS subtest) of an instrument.

```js
{
    "schema" : {
        ...
        "setup" : [
            {
                "name" : string,
                "type" : "page",
                "description" : string,
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


`setup.name`: String.
              The name and ID of the page object.

`setup.type`: Required string with value "page".

`setup.description`: Required string. The label or title of the page that will be rendered on the front-end as a link to the
page.

`setup.order`: Required array.

An ordered list of strings that are the keys to objects previously defined in
`fields` or `helpers`. The order in which they are listed will be the order in which they will appear on the rendered instrument.

# 3.0: Field Elements

An instrument "field" represents a variable to which the instrument will insert some clinical data via a front-end input element. The `fields` component here describes the data structure of these instrument fields and provides a way to validate the data that is collected. It is here that the data's type, choice of values, and rules are defined.

While it's natural to think of these instrument fields as front-end input elements, they are not. The front-end representation of these fields are only defined later within the `ui` component. 

Each type of field may contain type specific options. These options will be broken down and described in the section [3.2: Field Types](#32-field-types) section below. In general, a field object has the following format:

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
            "displayIf": string, /* LORIS Logic Parser formula */
            "disableIf": string, /* LORIS Logic Parser formula */
        }
      }
}
```

A field object has a unique key that is its identifier (ID) and name. The ID will also be used as an identifier for a
database column or a front-end element. Within the field object, there are 4 required keys: type, description, options,
and rules.

`type`: Required string. It represents the field's data type i.e. integer, string, boolean, etc.

This will be the data type of the field's value within the `data` component upon collection:

```js
{
    "data" : {
        "nameOfField" : `schema.fields.nameOfField.type`
    }
}
```

`description`: Required object with IETF BCP 47 language tags as keys. The value of each key is a string that is the human readable description of this field, provided in every available language. It
may be rendered on the front-end as a question, label or text.

`options`: Required object of type-specific keys. It contains the type-dependent options for this field, further
described in section [3.2: Field Types](#32-field-types).

`rules`: Required object with keys whose value may be an empty string.

## 3.1: Rules

The `rules` object contains 3 rules for validation and display: requireIf, displayIf, and disableIf.

```js
{
    "schema" : {
        ...
        "fields" : {
            "nameOfField" : {
                ...
                "rules": {
                    "requireIf": string, /* LORIS Logic Parser formula */
                    "displayIf": string, /* LORIS Logic Parser formula */
                    "disableIf": string, /* LORIS Logic Parser formula */
                }
        ...
}
```

The value of these keys are string expressions of logical formulas. These formulas, when calculated, evaluate to true
or false. The formulas are parsed and calculated using the Evaluator function of the LORIS Logic
Parser, [LParse](https://gitlab.com/zainvirani/LParse). The currently supported logic operations are available in the LParse [README.md](https://gitlab.com/zainvirani/LParse/blob/master/README.md), as well as
instructions on how to customize functions. 

`rules.requireIf`: String. True or false that the field requires data input, given the condition in the string expression.

`rules.displayIf`: String. True or false that the field is displayed in the instrument, given the condition in the string
expression.

`rules.disableIf`: String. True or false that the field is disabled i.e. not editable nor submittable, given the condition in
the string expression.

## 3.2: Field types

There are 8 different field types: enum, string, int, decimal, date, time, boolean, and score. Each type
of `fields` object has specific `options` defined.


### 3.2.1: Enum

An enum type is a field whose data can be chosen from a list of values. This type of field can
be rendered on the front-end as a select element, radio buttons, or a multiselect element if `options.allowMultipleValues` is set to true.

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
            "readonly": boolean
        },
        "rules": {
            ...
        }
    }
}
```

`options.values`: Required array of JSON objects that specify the ordered list of choices that the data is to be selected from. These objects have a `description` and a `value` key:

    `description`: Required object with IETF BCP 47 language tags as keys. The value of each key is a string that describes the choice value in human friendly text, and in every available language.

    `value`: Required string of the choice. The value is set as a string to allow for string key values such as 'dont_know'.

`options.allowMultipleValues`: Required boolean. True if multiple values may be selected at once. False if only
one value may be selected.

`options.requireResponse`: Required Boolean. True or false that an input is required. This key is different to
`rules.requireIf` in that it is a true boolean and not dependent on a condition - it is always either true or false.

If true, an implementation should automatically add a 'not_answered' value e.g. rendered as a checkbox, to allow explicit non-answering while
still requiring some input value. This is done to distinguish data that has not been entered from data that was intentionally not answered. This choice is added here instead of in `options.values` to allow for consistency with other field types.

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
            "readonly": boolean
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

This key is different to `rules.requireIf` in that it is a true boolean and not dependent on a condition - it is always either true or false.
If true, an implementation should automatically add a 'not_answered' value e.g. rendered as a checkbox, to allow explicit non-answering while
still requiring some input value. This is done to distinguish data that has not been entered from data that was intentionally not answered.

### 3.2.3: Numeric - Int and Decimal

A numeric field takes an int or a decimal as data input. It has the form of:

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
            "readonly": boolean
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

`options.requireResponse`: Required boolean.
                           True or false that an input is required. This key is different to
                           `rules.requireIf` in that it is a true boolean and not dependent on a condition - it is always either true or false.
                           If true, an implementation should automatically add a 'not_answered' value, e.g. rendered as a checkbox, to allow
                           explicit non-answering while still requiring some input value.

### 3.2.4: Date and Time

A date field takes a data type of form "YYYY-MM-DD". A time field takes a data type of form "HH:MM". The general format is as follows:

```js
{
    "nameOfField" : {
        "type": "date" OR "time",
        "description" : {
            ...
        },
        "options": {
            "minValue" : `nameOfField.type`,
            "maxValue" : `nameOfField.type`, 
            "requireResponse" : boolean,
            "readonly" : boolean,
        },
        "rules": {
            ...
        }
    } 
}
```

`options.minValue`: Date or time, depending on `nameOfField.type`.
                    The earliest date or time the data can be.

`options.maxValue`: Date or time, depending on `nameOfField.type`.
                    The latest date or time the data can be.

`options.requireResponse`: Required Boolean. True or false that an input is required. This key is different to `rules.requireIf` in that it is a true boolean and not dependent on a condition - it is always either true or false.

If true, an implementation should automatically add a 'not_answered' value, e.g. rendered as a checkbox, to allow explicit non-answering while still requiring some input value.

`options.readonly`: Boolean.
                    True or false that the field is read only i.e. not editable on the front-end but
                    submittable on save. This key is different to `rules.disableIf` in that it is not
                    dependent on a condition, and a 'disabled' field is not submittable.

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
        },
        "rules": {
            ...
        }
    } 
}
```

`options.requireResponse`: Required boolean.
                           True or false that an input is required. This key is different to
                           `rules.requireIf` in that it is a true boolean and not dependent on a condition - it is always either true or false.
                           If true, a data input of "false" cannot be submitted, and a 'not_answered' value cannot be given.

`options.readonly`: Boolean.
                    True or false that the field is read only i.e. not editable on the front-end but
                    submittable on save. This key is different to `rules.disableIf` in that it is not
                    dependent on a condition, and a 'disabled' field is not submittable.

### 3.2.6: Score

A score field is a placeholder whose values are based on the other fields' data. A score field is not
represented on the front-end by an input element. Its value is instead calculated from a string expression containing a logical formula that is evaluated by the LORIS Logic Parser, [LParse](https://gitlab.com/zainvirani/LParse).

```js
{
    "nameOfField" : {
        "type": "score",
        "description" : {
            ...
        },
        "options": {
            "scoringFormula" : string,
            "readonly" : boolean,
            "hideInSurvey" : boolean,
        },
        "rules": {
            ...
        }
    } 
}
```

# 4.0: Helper Elements

A helper object represents a non-input, layout-related front-end element. Each type of helper may
contain type specific options. The different types and their options are described in the section
[4.0: Helper Types](#4.0:-helper-types) below. 

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
            "displayIf": string, /* LORIS Logic Parser formula */
            "disableIf": string, /* LORIS Logic Parser formula */
        }
    } 
}
```

`type`: Required string.
        It represents the helper's data type i.e. statictext, section, table, etc.

`description`: Required object with IETF BCP 47 language tags as keys. The value of each key is a string that is the human readable description of this helper, provided in every available language,
               and also the text to be displayed in the instrument.

It may be rendered on the front-end as a header, depending on the helper type i.e. this will be the
content of the statictext helper itself, the header of the section helper, or column header for the table.

`options`: Required object of type-specific keys.
           It contains the type-dependent options for this helper, further described in section
           [4.0: Helper Types](#4.0:-helper-types).

`rules`: Required object with keys whose value may be an empty string as described for `fields`.
While instrument `fields` have corresponding `data` associated with it upon form submission, a `helper` is rendered on the front-end as an integral element that however does not collect data. There are
5 types of helpers: the static text element, and 4 other layout-specific formatting elements, group, row, table, and section.

## 4.1: Helper Types

### 4.1.1: Static Text

A `helper` of type "statictext" represents headings, sub-headings, labels, or informational text that is required in
an instrument. These can be rendered on the front-end as a header, static, or link element.
Static helpers are some text displayed to provide information and without an accompanying data input.
Static helpers do not have an `options` key.

```js
{
    "nameOfHelper" : {
        "type": "statictext",
        "description": {
            ...
        },
        "rules": {
            ...
        }
    } 
}
```

### 4.1.2: Group

A helper of type "group" denotes a horizontal collection of elements which should be displayed
together and is separated by a delimiter.

They often have rules which work together and may be interdependent. Groups have the following form:

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
            ]
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
 
### 4.1.3: Row

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
            ]
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

### 4.1.4: Table

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

### 4.1.5: Section

A helper of type "section" is a vertical grouping of elements whose `rules` can affect its children's rules.

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
on the front-end. It is composed of JSON objects whose keys match those of the field or helper object it's describing.
This component should only make decisions on which HTML or HTML Form element those objects get rendered as,
and nothing else. It may also provide additional UI properties that assist in the rendering.

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

- [header](#519-header-element) (from h1 to h6)
- [link](#5110-link-element)
- [statictext](#5111-static-text-element)

These are all mappable to some LORIS React Form element, except for "header" which is native to HTML.

### 5.1.1 Checkbox Element

```js
{
    "nameOfField" : {
        "type" : "checkbox"
    }
}
```

### 5.1.2 Date Element

```js
{
    "nameOfField" : {
        "type" : "date"
    } 
}
```

### 5.1.3 Numeric Element

```js
{
    "nameOfField" : {
        "type" : "number"
    } 
}
```

### 5.1.4 Radio Button Element

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

`options.vertical`: Boolean. True or false that the radio group is rendered vertically. The default value is false, or
horizontally. 

### 5.1.5 Select Element

```js
{
    "nameOfField" : {
        "type" : "select"
    }
}
```

### 5.1.6 Text Element

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

```js
{
    "nameOfField" : {
        "type" : "time"
    }
}
```

### 5.1.9 Header Element

A header element renders a "statictext" `helper` that should be displayed with some level of prominence.

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

`options.level`: Int. The number indicating the level of the html heading element to be rendered i.e. h1, the highest
and most prominent, and h6, the lowest and reserved for subheadings.

### 5.1.10 Link Element

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

```js
{
    "nameOfHelper" : {
        "type" : "static"
    }
}
```
