# Configuration Module

The Configuration Module allows you to edit configuration settings from the front end. The configuration values are stored in the database, instead of in the `config.xml` file. Any settings that are not currently in the Configuration Module can still be found and edited from the `config.xml` file.

### How to use the module
To edit any configuration settings, navigate to the field that you'd like to edit in the module, and edit or insert a new value.

Some configuration settings can accept multiple values. For these settings, you can add additional fields by pressing the "Add Field" button. This will create an empty form area where you can insert new values. You can delete any of the settings by pressing the red delete button attached to the form.

Press the Submit button at the bottom of the page to save your changes. You must press the Submit button that is on the page where you are making the changes for the changes to be stored in the database. If you press the Submit button on another configuration page, it will not store any changes made on other pages.

Care should be taken when editing the fields as there is currently no way to "undo" changes. You can reset the form to its values on page load by pressing the Reset button. However, this will not undo any changes made before the Submit button was pressed.
