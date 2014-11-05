This file describes the general format to be used by Loris to describe
instruments as a JSON object and will likely become an important of the
API and/or mobile specific versions of Loris.

This spec is NOT YET IMPLEMENTED. Anywhere. However, it will supercede
the .linst files created by the current instrument builder.

=========================================================================

# 1.0: Instrument format overview

Instruments consist of a JSON object describing the instrument to be loaded
and rendered. The object contains a Meta key which contains an object representing
meta data about the instrument and the version of it described by the JSON object.

An implementation should ignore any keys it doesn't expect so as to make it easier to extend
this standard without breaking backwards compatibility. Instruments MAY implement both
the instrument format described below and the accompagning rules format in the same
JSON object, or they MAY be used independently.

## 1.1: The Top Level JSON object

The high level view of the JSON object looks like this:

Instrument format:

```json
{
    "Meta" : {
        "InstrumentVersion": string,
        "InstrumentFormatVersion" : "v0.0.1a-dev",
        "ShortName" : "InstrumentName", /* Required */
        "LongName"  : "The Human Readable Instrument Name", /* Required */
        "IncludeMetaDataFields" : boolean
    },
    "Elements" : [ PageElements ]
}
```


Where each key should be interpreted as so:

`Meta.InstrumentVersion`: A string (determined by the instrument author) to describe the
                        version of the instrument being described by this object. There
                        are no restrictions on how to determine the InstrumentVersion,
                        but it SHOULD change with any changes to the instrument.

`Meta.InstrumentFormatVersion`: A hardcoded string specifying what version of this spec
                              the instrument is written to comply to. Required.

`Meta.ShortName`: A short name for this test suitable for a database table or file name.

`Meta.LongName`: The long, human readable version of this instrument name.

`Meta.IncludeMetaDataFields`: An implementation (such as Loris) may have special fields
              that are included with every instrument such as a scored Candidate Age or
              examiner for the instrument. If this is true, a rendering of this instrument
              SHOULD include those fields. If false, the instrument has a reason to exclude
              them.
              Default: true

`Elements`: An array of elements which this instrument consits of. Elements are described by
       JSON objects defined below and can be either an individual element, or an ElementGroup.







# 2.0: Page Elements

PageElements represent an individual element in an instrument such as a select box or textbox.
Each type of element may contain type specific options. In general, a PageElement object has
the following format:


```json
{
    "Type" : string,
    "Name" : UniqueQuestionIdentifier,
    "Description" : "Human readable question text",
    "Options" : {
        /* TypeDependent JSON Options */
    }
}
```

`Type`: A string representing what type of element it is.

`Name`: A unique (within the instrument) identifier to identify
        this PageElement. This identifier MUST be unique and
        MUST NOT contain special characters as an implementation
        MAY use it as an identifier for a database column or DOM object.
        Name may be required or may not depending on the type. The
        descriptions of the types below only specify if it's required,
        but these restrictions apply to all types where it's required.

`Description`: The human readable description of this element, such
               as question or label text. This may or may not be required
               depending on element type.

`Options`: An object containing the type dependent options for this element. If omitted
           defaults are used.


## 2.1: Specific element types

2.1.x describes input related types
2.2.x describes layout related types
3.x   will describe ElementGroup related types.

### 2.1.1: SelectPageElement

A SelectPageElement encompasses both HTML select and multiselect types and appears
as follows:

```json
{
    "Type" : "select",
    "Name" : REQUIRED,
    "Description" : REQUIRED,
    Options : {
        "Values" : {
            "SaveValue"       : "Human Readable Description",
            "SaveValue2"      : "Another human readable description"
            ...
        },
        "AllowMultiple"   : boolean,
        "RequireResponse" : boolean
    }
}
```

`Type`: MUST be select.

`Name`: Required. Follows PageElement.Name rules.

`Description`: Required. Follows PageElement.Name rules.

`Options.Values`: REQUIRED. Contains a JSON object specifying the
                options to be selected. Each key/value corresponds
                to <option value="JSONKey">JSONValue</option> in an
                HTML implementation. The JSONKey contains the value
                to be saved if selected, and the JSONValue contains
                the human friendly text to display to the user.

`Options.AllowMultiple`: Boolean. If true, multiple values may be
                         selected by the user at once. If false, only
                         one option can be selected.
                         Default: false

`Options.RequireResponse`: Boolean. If true, an implementation should
                       automatically add a not_answered option to the
                       select box in addition to the values specified
                       to allow the user to explicitly not answer a question
                       but require that some answer is entered.
                       If false, it should not.
                       This is done instead of simply adding the option to
                       Values to ensure consistency with other PageElement types
                       such as date or text.
                       Default true.



### 2.1.2: TextElement

A text element represents a place for the user to enter text into a form and
save it. The format is as follows:

```json
{
    Type: "text",
    "Name": REQUIRED,
    Description: REQUIRED,
    Options {
        Type: "large|small",
        Regex: "string",
        "SupressNotAnswered" : boolean
    }
}
```

`Type`: MUST be "text"

`Name`: Required. Follows PageElement.Name rules.

`Description`: Required. Follows PageElement.Name rules.

`Options.Type`: Either "large" or "small". If "large", the user is meant to enter
              a lot of text (ie. a comment box) and is likely to be represented
              by a textarea in an HTML implementation.
              If "small" the user is meant to enter a little text and is likely
              to be implemented by a <input type="text"> in an HTML implementation.
              Default: small

`Options.Regex`: Optional, a regex that the data entered must conform to. If not
               entered, no rules are enforced.

`Options.RequireResponse`: If true, there MUST be some way for the user to specify
              that the question is not answered, regardless of other rules. If false,
              the not answered option is supressed.
              Default: true



### 2.1.3: DateElement

A DateElement represents a way for a user to enter a date. The general format is
as follows:

```json
{
    Type: "date",
    Name: REQUIRED,
    "Description": REQUIRED,
    Options {
        MinDate : "YYYY-MM-DD",
        MaxDate : "YYYY-MM-DD",
        "SupressNotAnswered" : boolean
    }
}
```

`Type`: MUST be "date"

`Name`: Required. Follows PageElement.Name rules.

`Description`: Required. Follows PageElement.Name rules.

`Options.MinDate`: The minimum date that can be chosen by the user. Format is YYYY-MM-DD

`Options.MaxDate`: The maximum date that can be chosen by the user. Format is YYYY-MM-DD

`Options.RequireResponse`: Follows the same rules as TextElement:Options.RequireResponse




### 2.1.4: NumericElement

A NumericElement represents a numeric data input and has the general form of:

```json
{
    Type: "numeric",
    Name: REQUIRED,
    Description: REQUIRED,
    Options {
        NumberType: "integer|decimal",
        MinValue: number,
        MaxValue: number
    }
}
```

`Type`: MUST be "numeric".

`Name`: Required. Follows PageElement.Name rules.

`Description`: Required. Follows PageElement.Name rules.

`Options.NumberType`: "integer" or "decimal". If "integer", the input must be
                    an integer. If "decimal", it can contain a decimal point.

`Options.MinValue`: A number representing the minimum value that can be chosen
                  by the user. May be a decimal if "NumberType" is decimal, and
                  an integer if "NumberType" is integer

`Options.MaxValue`: A number representing the maximum value that the user can select.
                  Type of number depends on "NumberType" value. If both MinValue and
                  MaxValue are specified MaxValue MUST be greater than or equal to
                  MinValue.

`Options.RequireResponse`: Follows the same rules as TextElement:Options.RequireResponse



### 2.1.5: ScoreFieldElement

A score field represents a placeholder to display/save values based on other
data entered by the user in the instrument but does not directly get input from
the user. It has the following form.

```
{
    Type: "score",
    Name: REQUIRED,
    Description: OPTIONAL,
    Options: {
        /* None currently */
    }
}
```

`Type`: MUST be "score".

`Name`: Required. Follows PageElement.Name rules. The Name MAY be used by an
      implementation as a field name to save calculated data into.

`Description`: Optional. Follows PageElement.Name rules. If not specified, the
             score will be displayed with no accompagning text.


## 2.2: Layout related types

The following types are related to page layout and not directly related to user input,
but are nonetheless important for rendering of instruments. For these elements, Name
is NOT REQUIRED and unused.


### 2.2.1: HeaderElement

A HeaderElement represents a header which should be displayed with some level of prominence
(ie bolded or centered.) 1 is the most prominent header, and lower numbers should be used
for subsection/subheaders. There is no need to add a header with the instrument name as an
implementation of this spec MAY already do so.

```json
{
    Type: "header",
    Description: "Required",
    Options: {
        Level: integer
    }
}
```

`Type`: MUST be "header"

`Description`: Required. The text to display in the header

`Options.Level`: The level of the header. 1 is the most prominent and subheaders (or sub-subheaders, or
               sub-sub-sub-headers) get increasingly high levels.




### 2.2.2: LabelElement

A label element represents some text to display to the user with no accompagning user
input. It has the following form:

```json
{
    Type: "label",
    "Description" : Required,
    "Options": {
        /* None currently */

    }
}
```

`Type`: MUST be "label"

`Description`: Required. The text to display in the label.

`Options`: None

# 3.0.0: ElementGroups

ElementGroups represent some kind of grouping of elements and may represent,
for instance, a table, rows in that table, pages, or groups of elements that aren't
tabular but should be logically grouped together into a row. This part of the spec has yet to
be written.

TODO: Add PageGroups
      ElementGroups
      TableGroup
      RowGroup
