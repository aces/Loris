# Instrument Builder

This module allows you to create new behavioural forms in your LORIS database.

If you want to edit an existing instrument form created with this module, go to the **Load** tab and open the file from your computer.

If you are creating a new instrument, navigate to the **Build** tab. Use the fields and dropdown menus provided to build out the questions for your new instrument. Important information on each Field Type and how to use it is below in this Help text.

After entering a question, click **Add row** and it will appear in the "form preview" just above, showing fields added already to your form. Click on any field in this form preview to modify with the **Edit** or **Delete* buttons.

Once you are satisfied with the instrument form, navigate to the **Save** tab. Populate the fields and click **Save**.

**Important** to know when defining fields storing data

_"Question Name"_ will be the database table (back-end) field name, never seen by users. This name must be unique and fairly brief, and no special characters or spaces can go into this name. It's recommended to begin with the question number e.g. `q09_number_cigarettes_daily`.

_"Question Text"_ is the prompt seen by users or survey respondents entering data into the form. The full text of the question goes here.

#### Field types, by category : 

_Some fields display or calculate information :_
- Header : for the Title of an instrument, page or section. Appears bold and centered in the form. 
- Label : for explanations or blocks of text, e.g. instructions for the next section of questions
- Scored Field : for storing calculated values (this can include dates which are calculated instead of entered)

_Data entry fields_ : 

- Textbox : for short-answer text questions (do not use for numbers). 	

- Textarea : for long-answer questions, e.g. comment fields. 

- Dropdown : for selecting one option from a list. To create the list of options, type in the "Dropdown option" row and then click "add option" - in the "preview" dropdown underneath you'll see your new option.  Type again in the boxes to begin defining your second option, and when all options are added, click "add row".  

Note: _"not_answered"_ will be automatically added as the last option for any dropdown. 
The next time you add a dropdown field, you'll see your last options list is suggested for convenience - click "reset" to clear them.  
	
- Multiselect : for selecting one or more options from a list. see _Dropdown_ for information on creating/re-using Options.

- Date : for dates such as _Date of first reported incident_	

- Numeric : for numbers - e.g. height, weight, etc.	 Ranges can be specified to enforce valid data entry.

_Formatting fields_ for cosmetic/visual form features:

- Blank Line : for separating blocks of questions. Leave blank "Question Name" and "Question Text".	
- Page Break : for add a new page within the instrument. The "Question Text" should be populated with the name of the new page. 
Note that the first page of an instrument should be the _Top_ page (containing scores), followed by _page 1_.	
