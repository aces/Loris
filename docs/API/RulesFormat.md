This file describes the general format to be used by Loris to describe
rules as a JSON object and will likely become an important of the
API and/or mobile specific versions of Loris.

This spec is NOT YET IMPLEMENTED. Anywhere. However, it will supercede
the .rules files created by the current instrument builder.

=========================================================================

# 1.0 Rules Format Overview

A "rule" represents a dependency between values on two questions or user inputs.
Rules may be on the same page or between different pages.
This spec is meant to complement the accompagning InstrumentFormat spec but may
be used independently.

On a high level, a rule has the following form:

```json
{
    "Meta": {
        "InstrumentVersion": string,
        "RulesFormatVersion" : "v0.0.1a-dev",
        "RequiredDefault" : boolean
    },
    "Rules": {
        "$QuestionName": [ QuestionRules ],
        "$AnotherQuestion": [ QuestionRules ]
        ....
    }
}
```

The Meta object mirrors the Instrument format and has the following meaning.

`InstrumentVersion`: represents the (author-specified) version of this instrument

`RulesFormatVersion`: specifies the version of this spec that the accompagning JSON document follows.
                      If combined with the instrument JSON format in the same JSON object,
                      `RulesFormatVersion` and `InstrumentFormatVersion` MAY be different.

`RequiredDefault`: Whether the default rule for fields obeying this spec is to be required, or
                   not required. If `RequiredDefault` is true, all fields will be required unless
                   one or more rules are specified for the question. If `RequiredDefault` is false,
                   all fields will not be required unless a rule is set. When `RequiredDefault`
                   is true and you need to specify that a question is NOT required, you can add
                   a rule with no dependencies so that there is a rule registered.




Like in the instrument JSON object, `InstrumentVersion` SHOULD change if the rules are
modified in any way.

An implementation should ignore any unexpected keys so as to support extensions of this
spec.

The `Rules` key contains an object where each key matches the identifier of the question
for which the rule applies. The value is an array of QuestionRules (specified below). ALL
QuestionRules in the array must pass in order for the rule to be valid. Thus, if ANY rule
fails, the validation of the field fails and an error should be displayed.

You can thus think of the QuestionRules array as an if statement with OR operators.

```
if (Rule1 Fails) OR (Rule2 Fails) OR (Rule3 Fails) OR ...
    throw error for question
```

which is equivalent to

```
if NOT (Rule1 Passes AND Rule2 Passes AND Rule3 Passes AND ...)
    throw error for question

```

(proof left as an exercise to the reader)

This logic can be inverted with an inverted depencency type. If a dependency is inverted, it will
be interpreted as

```
IF (Rule1 Passes OR Rule2 Passes OR Rule3 Passes OR ...)
    throw error for question
```

(which is equivalent to

```
If NOT (Rule1 Fails AND Rule2 Fails AND Rule3 Fails AND ...)
    throw error for question
```


## 1.1 Question Rules

The `Rules` array in the top level element contains a set of rules. Each individual rule
is a JSON object of the following form.


```json
{
    "Name": string,
    "Description" : string,
    "ErrorMessage" : string,
    "DependencyType": "normal|inverted",
    "Dependencies" : { /* Section 1.2 */
        "$DependentQuestionName" : {
            "Operation"       : "equal|notequal|AdditionalRuleSet"
            "Value"           : "value",
            "Negate"          : boolean,
            "ComparisonField" : "$FieldName",
            "ruleset" : [ QuestionRule* ]
        }
        /* More question dependencies.. */
    }
}
```

`Name`: The `Name` field if not used, but can be used to give a name to this rule. It is
        encouraged to aid readability and debugging of complex rules. Implementations should
        not depend on this field.
        Name MAY be stripped out of JSON object in a production environment.

`Description`: Similar to `Name`, this is may be used to give a more verbose human-readable description
               of the rule and the logic behind it. `Description` MAY be stripped out of the JSON object.

`ErrorMessage`: This contains a string to be used as the error message if this `QuestionRule`
                is violated.

`Dependencies`: A JSON object of the dependencies for this question. Each key is the name of the
                question which this rule depends on, and the value is a `DependencyRule` described
                in section 1.2.
                By default, a question depends on ALL of its dependencies passing, thus the logic behind
                multiple depenencies multiple dependencies is similar to the logic behind multiple
                QuestionRules for a question.
                The dependency JSON object format is described in section 1.2

`DependencyType`: This will invert the logic for the dependencies of this rule in the way described
                  in section 1.0 if set to "inverted". This and `DependencyRule` "Negate" are included for logical
                  completeness, but should be avoided if possible to make reading and interpreting your rules
                  easier.
                  Default: "normal"

## 1.2 Dependency Rules

DependencyRules implement that actual logic behind the rule being implemented. They are generally a key-value
pair in another JSON object where the key is the field that is to be compared, and the value is a JSON object
of the comparison to be done.

The JSON object has the following form:

```json
{
    "Operation"       : "equal|notequal|AdditionalRuleSet"
    "Negate"          : boolean,
    "Value"           : "value",
    "ComparisonField" : "$FieldName",
    "ruleset" : [ QuestionRule* ]
}
```

`Operation`: The operation to be used for the comparison. Possible values are:
    1. `equal` - The check passed if the field is equal to the value or ComparisonField
    2. `notequal` - The inverse of equal.
    3. `AdditionalRuleSet` - The QuestionRules in the `ruleset` array must pass. This is a
                             method of performing an AND operation.

`Negate`: If true, this rule will be negated such that the inverse must be true. Default: false

`Value`: A (static) value to compare the field to using `Operation`. Not used for `AdditionalRuleSet`

`ComparisonField`: Another field to use for a the comparison, so that you can perform rules such as
                   Field1 == Field2. Either this or `Value` should be specified but not both.

`ruleset`: If `Operation` is equal to `AdditionalRuleSet`, this contains an array of further QuestionRules that
           must be evaluated. You can think of `AdditionalRuleSet`s as brackets in an IF statement. If
           specified, this MUST be an array of further `QuestionRule`s and mirrors the top level field QuestionRule
           array.
