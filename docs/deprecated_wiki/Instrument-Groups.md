**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[DEVELOPER'S INSTRUMENT GUIDE|Developer's Instrument Guide]]** > **[[HOW TO CODE AN INSTRUMENT|How to Code an Instrument]]**  > **[[GROUPS|Instrument Groups]]**

> Under construction

Groups are mostly used in combination with tables - i.e. Use groups to display instrument data in a grid-table in the front-end of an instrument form (not MySQL tables).

The following example table - taken from a medical history questionnaire - contains 6 rows and 3 columns. The first row is the headers and the remaining rows are the label and data field rows. 

To recreate this table, we need to first create an array containing the created elements.  

There are two functions for creating an element:  “createElement” and “addElement”. The function with the “add” prefix creates and adds the element to the page. The “create” function creates the element, but it needs to be added to the page manually. 

```php
        // Table headers
        $group[] =& $this->form->createElement(
            "static",
            null,
            null,
            "Incident"
        );
        $group[] =& $this->form->createElement(
            "static",
            null,
            null,
            "Hospitalized?"
        );
        $group[] =& $this->form->createElement(
            "static",
            null,
            null,
            "Age"
        );
        $this->form->addGroup(
            $group,
            "concussion_titles",
            null,
            $this->_GUIDelimiter,
            false
        );
        unset($group);

        // data entry fields
        for ($i = 1; $i < 4; $i++) {
            $group[] =& $this->createText(
                "concussion_" . $i . "_description",
                "Incident"
            );
            $this->XINRegisterRule(
                "concussion_" . $i . "_description",
                array("concussion_" . $i . "_description{@}=={@}NEVER_REQUIRED"),
                "Required."
            );
            $group[] =& $this->createSelect(
                "concussion_" . $i . "_hospitalized",
                "Hospitalized?",
                $yesNoOptions
            );
            $this->XINRegisterRule(
                "concussion_" . $i . "_hospitalized",
                array("concussion_" . $i . "_hospitalized{@}=={@}NEVER_REQUIRED"),
                "Required."
            );
            $group[] =& $this->createText(
                "concussion_" . $i . "_age",
                "Age"
            );
            $this->XINRegisterRule(
                "concussion_" . $i . "_age",
                array("concussion_" . $i . "_age{@}=={@}NEVER_REQUIRED"),
                "Required."
            );
            $this->form->addGroup(
                $group,
                "concussion_table_" . $i,
                null,
                $this->_GUIDelimiter,
                false
            );
            unset($group);
        }
```