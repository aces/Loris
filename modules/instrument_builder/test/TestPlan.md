Instrument builder Test Plan

1.  Create Instrument
    1.a Add Header
    1.b Add Label
    1.c Add Scored Field
      1.c.1 Validate that this requires both QuestionName and QuestionText
      1.c.2 Validate that a second score field with the same name can not be added.
    1.d Add Textbox
      1.d.1 Validate that this requires both QuestionName and QuestionText
    1.e Add Textarea
      1.e.1 Validate that this requires both QuestionName and QuestionText
      1.e.2 Validate that not_answered option is added in the linst file for this question
    1.f Add Dropdown
     1.f.1 Validate that this requires both QuestionName and QuestionText
     1.f.2 Validate not_answered option is added as last dropdown option in the linst file
           for this question
    1.g Add Multiselect
      1.g.1 Validate that this requires both QuestionName and QuestionText
      1.g.2 Validate not_answered option is added as last dropdown option in the linst file
            for this question
    1.h Add Date
      1.h.1 Validate that this requires both QuestionName and QuestionText
      1.h.2 Validate not_answered option is added as last dropdown option in the linst file
            for this question
      1.h.3 Validate adding range (startyear-endyear)
    1.i Add Numeric
      1.i.1 Validate that this requires both QuestionName and QuestionText
      1.i.2 Validate adding range
    1.j Add Blank Line
    1.k Add Page break
2.  Save instrument file
3.  Validate not_answered option is added for Textarea, Dropdown, Multiselect and Date.
4.  Re-load existing instrument
    4.a Add questions
    4.b Save instrument file and ensure new changes are reflected in the file
