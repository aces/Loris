Instrument builder Test Plan

1.  Check user permission – ‘superuser’
2.  Create Instrument
    2.a Add Header
    2.b Add Label
    2.c Add Scored Field
      2.c.1 Validate that this requires both QuestionName and QuestionText
    2.d Add Textbox
      2.d.1 Validate that this requires both QuestionName and QuestionText
    2.e Add Textarea
      2.e.1 Validate that this requires both QuestionName and QuestionText
      2.e.2 Validate that not_answered option is added in the linst file for this question
    2.f Add Dropdown
     2.f.1 Validate that this requires both QuestionName and QuestionText
     2.f.2 Validate not_answered option is added as last dropdown option in the linst file
           for this question
    2.g Add Multiselect
      2.g.1 Validate that this requires both QuestionName and QuestionText
      2.g.2 Validate not_answered option is added as last dropdown option in the linst file
            for this question
    2.h Add Date
      2.h.1 Validate that this requires both QuestionName and QuestionText
      2.h.2 Validate not_answered option is added as last dropdown option in the linst file
            for this question
      2.h.3 Validate adding range (startyear-endyear)
    2.i Add Numeric
      2.i.1 Validate that this requires both QuestionName and QuestionText
      2.i.2 Validate adding range
    2.j Add Blank Line
    2.k Add Page break
3.  Edit DatabaseName and Question in the table directly and check if it sticks
4.  Preview Instrument
5.  Add Rules
6.  Save Rules file
7.  Validate Instrument (Does not save if there is a same QuestionName twice)
8.  Save Instrument file
9.  Re-load existing instrument
    9.a  Add questions
    9.b Save instrument file and ensure new changes are reflected in the file
10. Install and test instrument and rules implemented
