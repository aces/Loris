**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[DEVELOPER'S INSTRUMENT GUIDE|Developer's Instrument Guide]]** > **[[HOW TO CODE AN INSTRUMENT|How to Code an Instrument]]**  > **[[XIN RULES|XIN Rules]]**

# What are XIN Rules?
XIN Rules validate your input and prevent you from moving forward if you forget to fill in a required field.
They can be used to enforce dependencies between fields. 
> i.e. If  A1 is selected in question A and if A2 is selected in question B, then give examiner a break and skip question 3 and 4.

For example: 
> A. Do you smoke?  (Options:) A1: Yes  A2: No 
<br>
> B: How often do you smoke?  #Skip question B if A2 "No" response was given for question A

## How to use XIN Rules

### Enable XIN Rules for your instrument

See [Sample Instrument Template](https://github.com/aces/Loris/blob/master/docs/instruments/NDB_BVL_Instrument_TEMPLATE.class.inc) for code to invoke XIN rules from the `setup()` and `setupForm()` functions

### Add XIN Rules to form elements

All elements are required if no rule is specified, unless it is part of a group.
```php
$this->XINRegisterRule(
    "field_name1",
    array("field_name2{@}=={@}yes|maybe|sure"),
    "Required." 
);
```

```php
$this->XINRegisterRule(
    "field_name", // field name on which the rule is applied
    array("field_name{@}=={@}"), // rule
    "Required.", // message
    "group_1" // group [if field is a part of a group]
);
```

> NOTE: When adding XIN rules some elements are implicitly added to a group in NDB_BVL_Instrument.class.inc. In consequence, a group name needs to be specified when registering a rule. A group name is necessary for the following elements:
```php
$this->addHourMinElement();  // Group name: {$fieldName}_group
$this->addTextElement();  // Group name: {$fieldName}_group
$this->addNumericElement();  // Group name:{$fieldName}_group
$this->addDateElement();  // Group name: {$fieldName}_dategroup
```

Field is never required
```php
$this->XINRegisterRule(
    "field_name",
    array("field_name{@}=={@}NEVER_REQUIRED"),
    "Not required",
    "group1" 
);
```
Field is required based on value of another field (check for equality)
```php
$this->XINRegisterRule(
    "field_name1",
    array("field_name2{@}=={@}yes"),
    "Required." 
);
```
Field is required based on value of another field (check for equality with multiple valid values)
```php
$this->XINRegisterRule(
    "field_name1",
    array("field_name2{@}=={@}yes|maybe|sure"),
    "Required." 
);
```
Multiple rules applied in AND fashion
```php
$this->XINRegisterRule(
    "field_name3",
    array("field_name1{@}=={@}yes", "field_name2{@}=={@}no"), // Use , (comma) to "AND" the rules
    "Required." 
);
```
Multiple rules applied in OR fashion 
```php
$this->XINRegisterRule(
    "field_name3",
    array("field_name1{@}=={@}yes|field_name2{@}=={@}yes"), // Use | (pipe) to "OR" the rules
    "Required.",
    "group1" 
);
```

## Validating multi-selects
Currently, multi-selects do not work well within XINRules. To validate that a multi-select has been filled, an additional validation function is a best practice, to ensure that an informative error message is displayed for the user, if the multi-select fails validation and the form is not saved. 
```php
    function _page1() {
        ...
        $this->addSelect(
            "multiselect_ex",
            "Multi-Select Example",
            $options,
            ["multiple"]
        );
        ...
        $this->form->addFormRule(array(&$this,'validateMultiSelects'));
    }

    function validateMultiSelects($values)
    {
        $errors = array();

        if(empty($values['multiselect_ex'])){
            $errors['multiselect_ex'] = "Required.";
        }
        
        return $errors;
    }
```
For more on validation functions, see (validation function section under construction)